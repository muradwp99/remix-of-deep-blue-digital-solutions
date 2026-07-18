/**
 * Server-side Gemini client (never ships to the browser — import only from
 * createServerFn handlers). Reads GEMINI_API_KEY from the environment; every
 * call fails soft to null so tools always fall back to heuristics.
 */

const MODEL = "gemini-2.0-flash";
const ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`;

type GeminiPart = { text?: string };
type GeminiResponse = {
  candidates?: { content?: { parts?: GeminiPart[] } }[];
};

async function call(
  prompt: string,
  opts: { system?: string; json?: boolean } = {},
): Promise<string | null> {
  const key = process.env.GEMINI_API_KEY;
  if (!key) return null;

  const body = JSON.stringify({
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    ...(opts.system
      ? { systemInstruction: { parts: [{ text: opts.system }] } }
      : {}),
    generationConfig: {
      temperature: 0.4,
      maxOutputTokens: 1600,
      ...(opts.json ? { responseMimeType: "application/json" } : {}),
    },
  });

  const attempt = async (headers: Record<string, string>) => {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 14000);
    try {
      const res = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...headers },
        body,
        signal: controller.signal,
      });
      if (!res.ok) return { status: res.status, text: null as string | null };
      const json = (await res.json()) as GeminiResponse;
      const text =
        json.candidates?.[0]?.content?.parts?.map((p) => p.text ?? "").join("") ?? null;
      return { status: res.status, text };
    } finally {
      clearTimeout(timer);
    }
  };

  try {
    // Standard API-key header first; some key formats only work as Bearer.
    const first = await attempt({ "x-goog-api-key": key });
    if (first.text) return first.text;
    if (first.status === 401 || first.status === 403) {
      const second = await attempt({ Authorization: `Bearer ${key}` });
      if (second.text) return second.text;
    }
    return null;
  } catch {
    return null;
  }
}

/** Free-form text completion. */
export async function geminiText(prompt: string, system?: string): Promise<string | null> {
  return call(prompt, { system });
}

/** JSON completion — parses the response, null on any failure. */
export async function geminiJson<T>(prompt: string, system?: string): Promise<T | null> {
  const raw = await call(prompt, { system, json: true });
  if (!raw) return null;
  try {
    // Trim accidental code fences.
    const cleaned = raw.replace(/^```(?:json)?/m, "").replace(/```$/m, "").trim();
    return JSON.parse(cleaned) as T;
  } catch {
    return null;
  }
}
