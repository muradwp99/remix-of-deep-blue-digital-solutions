/**
 * Server functions powering the free tools + site chat.
 * Each runs on the server (createServerFn), combines real measurements with
 * Gemini analysis, and degrades gracefully to heuristics when the model is
 * unavailable — a tool never errors out in front of a visitor.
 */
import { createServerFn } from "@tanstack/react-start";
import { geminiJson, geminiText } from "./gemini.server";

/* ------------------------------------------------------------------ */
/* Shared shapes                                                       */
/* ------------------------------------------------------------------ */

export type ScoreSet = Record<string, number>;
export type Fix = { title: string; impact: "high" | "medium" | "low"; detail: string };

export type AuditResult = {
  url: string;
  scores: { performance: number; seo: number; accessibility: number; conversion: number };
  summary: string;
  fixes: Fix[];
  signals: { label: string; value: string; ok: boolean }[];
  ai: boolean;
};

export type SpeedResult = {
  url: string;
  ttfbMs: number;
  downloadMs: number;
  totalMs: number;
  sizeKb: number;
  compressed: boolean;
  server: string;
  grade: "fast" | "moderate" | "slow";
  vitals: { label: string; value: string; status: "good" | "warn" | "poor" }[];
  advice: string[];
  ai: boolean;
};

export type BrandResult = {
  overall: number;
  scores: { clarity: number; distinctiveness: number; consistency: number; memorability: number };
  verdict: string;
  suggestions: Fix[];
  ai: boolean;
};

const clamp = (n: number, lo = 0, hi = 100) => Math.max(lo, Math.min(hi, Math.round(n)));

function normalizeUrl(input: string): string | null {
  const raw = input.trim();
  if (!raw) return null;
  const withProto = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
  try {
    const u = new URL(withProto);
    if (!u.hostname.includes(".")) return null;
    // Only public http(s) targets.
    if (!/^https?:$/.test(u.protocol)) return null;
    return u.toString();
  } catch {
    return null;
  }
}

async function fetchPage(url: string) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 12000);
  const t0 = Date.now();
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      redirect: "follow",
      headers: { "User-Agent": "Mozilla/5.0 (compatible; AuxtechTools/1.0)" },
    });
    const ttfbMs = Date.now() - t0;
    const html = await res.text();
    const totalMs = Date.now() - t0;
    return {
      ok: res.ok,
      status: res.status,
      ttfbMs,
      downloadMs: totalMs - ttfbMs,
      totalMs,
      sizeKb: Math.round(new TextEncoder().encode(html).length / 1024),
      compressed: !!res.headers.get("content-encoding"),
      server: res.headers.get("server") ?? "unknown",
      html,
    };
  } finally {
    clearTimeout(timer);
  }
}

/* ------------------------------------------------------------------ */
/* Website Audit                                                       */
/* ------------------------------------------------------------------ */

export const runWebsiteAudit = createServerFn({ method: "POST" })
  .validator((d: { url: string }) => d)
  .handler(async ({ data }): Promise<AuditResult | { error: string }> => {
    const url = normalizeUrl(String(data?.url ?? ""));
    if (!url) return { error: "That doesn't look like a valid URL. Try e.g. yoursite.com" };

    let page: Awaited<ReturnType<typeof fetchPage>>;
    try {
      page = await fetchPage(url);
    } catch {
      return { error: "We couldn't reach that site. Check the address and try again." };
    }
    const html = page.html.slice(0, 200_000);

    const title = /<title[^>]*>([^<]*)<\/title>/i.exec(html)?.[1]?.trim() ?? "";
    const metaDesc =
      /<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)/i.exec(html)?.[1] ?? "";
    const h1Count = (html.match(/<h1[\s>]/gi) ?? []).length;
    const imgs = html.match(/<img[^>]*>/gi) ?? [];
    const imgsMissingAlt = imgs.filter((i) => !/alt=["'][^"']+["']/i.test(i)).length;
    const hasViewport = /<meta[^>]+name=["']viewport/i.test(html);
    const hasOg = /<meta[^>]+property=["']og:/i.test(html);
    const hasCanonical = /<link[^>]+rel=["']canonical/i.test(html);
    const httpsOk = url.startsWith("https://");

    const perf = clamp(
      100 - Math.max(0, page.ttfbMs - 200) / 14 - Math.max(0, page.sizeKb - 150) / 22 + (page.compressed ? 4 : -8),
    );
    const seo = clamp(
      40 + (title ? 15 : 0) + (metaDesc ? 15 : 0) + (h1Count === 1 ? 12 : h1Count > 1 ? 4 : 0) + (hasCanonical ? 9 : 0) + (hasOg ? 9 : 0),
    );
    const a11y = clamp(
      55 + (hasViewport ? 15 : 0) + (imgs.length ? clamp(30 - (imgsMissingAlt / Math.max(1, imgs.length)) * 30, 0, 30) : 20),
    );
    const conv = clamp(45 + (metaDesc ? 10 : 0) + (/(<button|cta|contact|sign\s?up|get started)/i.test(html) ? 20 : 0) + (httpsOk ? 10 : -10));

    const signals = [
      { label: "TTFB", value: `${page.ttfbMs} ms`, ok: page.ttfbMs < 500 },
      { label: "HTML size", value: `${page.sizeKb} KB`, ok: page.sizeKb < 250 },
      { label: "Compression", value: page.compressed ? "enabled" : "missing", ok: page.compressed },
      { label: "Title tag", value: title ? `${title.slice(0, 42)}${title.length > 42 ? "…" : ""}` : "missing", ok: !!title },
      { label: "Meta description", value: metaDesc ? "present" : "missing", ok: !!metaDesc },
      { label: "H1 structure", value: `${h1Count} found`, ok: h1Count === 1 },
      { label: "Image alt text", value: imgs.length ? `${imgsMissingAlt} of ${imgs.length} missing` : "no images", ok: imgsMissingAlt === 0 },
      { label: "Open Graph", value: hasOg ? "present" : "missing", ok: hasOg },
      { label: "HTTPS", value: httpsOk ? "secure" : "not secure", ok: httpsOk },
    ];

    const ai = await geminiJson<{ summary: string; fixes: Fix[] }>(
      `You are a senior web consultant at Auxtech. A prospect ran our free audit on ${url}.
Measured signals: ${JSON.stringify({ ttfbMs: page.ttfbMs, sizeKb: page.sizeKb, compressed: page.compressed, title, metaDescPresent: !!metaDesc, h1Count, imgs: imgs.length, imgsMissingAlt, hasViewport, hasOg, hasCanonical })}
Scores: performance ${perf}, seo ${seo}, accessibility ${a11y}, conversion ${conv}.
Return JSON: {"summary": "2 sentence plain-English verdict, specific to the signals, no fluff", "fixes": [{"title": string, "impact": "high"|"medium"|"low", "detail": "one concrete sentence"}]} with the 4 to 6 highest-impact fixes ordered by impact.`,
    );

    const fixes: Fix[] =
      ai?.fixes?.slice(0, 6) ??
      signals
        .filter((s) => !s.ok)
        .slice(0, 5)
        .map((s) => ({
          title: `Fix ${s.label.toLowerCase()}`,
          impact: "medium" as const,
          detail: `${s.label} currently reads "${s.value}". Bringing this in line is a quick, measurable win.`,
        }));

    return {
      url,
      scores: { performance: perf, seo, accessibility: a11y, conversion: conv },
      summary:
        ai?.summary ??
        `We reached ${new URL(url).hostname} in ${page.ttfbMs}ms and reviewed ${signals.length} signals. ${signals.filter((s) => !s.ok).length} need attention; the fixes below are ordered by impact.`,
      fixes,
      signals,
      ai: !!ai,
    };
  },
);

/* ------------------------------------------------------------------ */
/* Speed Test                                                          */
/* ------------------------------------------------------------------ */

export const runSpeedTest = createServerFn({ method: "POST" })
  .validator((d: { url: string }) => d)
  .handler(async ({ data }): Promise<SpeedResult | { error: string }> => {
    const url = normalizeUrl(String(data?.url ?? ""));
    if (!url) return { error: "That doesn't look like a valid URL. Try e.g. yoursite.com" };

    // Two passes; keep the faster (warms DNS/TLS like a repeat visit).
    let best: Awaited<ReturnType<typeof fetchPage>> | null = null;
    try {
      for (let i = 0; i < 2; i++) {
        const run = await fetchPage(url);
        if (!best || run.totalMs < best.totalMs) best = run;
      }
    } catch {
      return { error: "We couldn't reach that site. Check the address and try again." };
    }
    const page = best!;

    const lcpEst = page.ttfbMs + page.downloadMs + Math.min(1800, page.sizeKb * 2.2);
    const grade: SpeedResult["grade"] = lcpEst < 1800 ? "fast" : lcpEst < 3500 ? "moderate" : "slow";
    const status = (v: number, good: number, warn: number): "good" | "warn" | "poor" =>
      v <= good ? "good" : v <= warn ? "warn" : "poor";

    const vitals: SpeedResult["vitals"] = [
      { label: "TTFB (server response)", value: `${page.ttfbMs} ms`, status: status(page.ttfbMs, 300, 800) },
      { label: "HTML download", value: `${page.downloadMs} ms`, status: status(page.downloadMs, 300, 900) },
      { label: "Estimated LCP", value: `${(lcpEst / 1000).toFixed(1)} s`, status: status(lcpEst, 1800, 3500) },
      { label: "Document weight", value: `${page.sizeKb} KB`, status: status(page.sizeKb, 200, 600) },
    ];

    const aiAdvice = await geminiJson<{ advice: string[] }>(
      `Speed check for ${url}: TTFB ${page.ttfbMs}ms, download ${page.downloadMs}ms, HTML ${page.sizeKb}KB, compression ${page.compressed ? "on" : "off"}, server "${page.server}", estimated LCP ${(lcpEst / 1000).toFixed(1)}s.
Return JSON {"advice": [three one-sentence, concrete, prioritized speed fixes for this exact profile]}.`,
    );

    return {
      url,
      ttfbMs: page.ttfbMs,
      downloadMs: page.downloadMs,
      totalMs: page.totalMs,
      sizeKb: page.sizeKb,
      compressed: page.compressed,
      server: page.server,
      grade,
      vitals,
      advice:
        aiAdvice?.advice?.slice(0, 3) ??
        [
          page.ttfbMs > 500 ? "Move to a faster host or add edge caching; server response is the bottleneck." : "Server response is healthy; protect it with a CDN cache policy.",
          page.compressed ? "Compression is on; next win is trimming render-blocking scripts." : "Enable gzip or brotli compression; it's the single fastest win available.",
          page.sizeKb > 300 ? "Slim the HTML payload; ship less markup and defer non-critical content." : "Payload is lean; focus on image formats (WebP/AVIF) and font loading.",
        ],
      ai: !!aiAdvice,
    };
  },
);

/* ------------------------------------------------------------------ */
/* Brand Grader                                                        */
/* ------------------------------------------------------------------ */

export const runBrandGrader = createServerFn({ method: "POST" })
  .validator((d: { name: string; tagline?: string; industry?: string; audience?: string }) => d)
  .handler(async ({ data }): Promise<BrandResult | { error: string }> => {
    const d = data;
    const name = String(d?.name ?? "").trim();
    const tagline = String(d?.tagline ?? "").trim();
    const industry = String(d?.industry ?? "").trim();
    const audience = String(d?.audience ?? "").trim();
    if (!name) return { error: "Give us at least the brand name." };

    const ai = await geminiJson<BrandResult>(
      `You are a brand strategist at Auxtech. Grade this brand identity honestly on a 0-100 scale per dimension.
Brand name: "${name}"
Tagline: "${tagline || "(none provided)"}"
Industry: "${industry || "(unspecified)"}"
Audience: "${audience || "(unspecified)"}"
Return JSON exactly: {"overall": number, "scores": {"clarity": number, "distinctiveness": number, "consistency": number, "memorability": number}, "verdict": "2 sentences, direct and specific to this brand, no flattery", "suggestions": [{"title": string, "impact": "high"|"medium"|"low", "detail": "one concrete sentence"}]} with 3-5 suggestions. Be a tough but fair grader; scores of 90+ are rare.`,
    );
    if (ai?.scores) return { ...ai, suggestions: ai.suggestions?.slice(0, 5) ?? [], ai: true };

    // Heuristic fallback.
    const clarity = clamp(50 + (tagline ? 20 : 0) + (industry ? 10 : 0));
    const distinctiveness = clamp(45 + Math.min(20, name.length * 2) - (/(tech|solutions|digital|global)$/i.test(name) ? 15 : 0));
    const consistency = clamp(55 + (tagline && tagline.split(" ").length <= 8 ? 15 : 0));
    const memorability = clamp(40 + (name.length <= 8 ? 25 : name.length <= 12 ? 12 : 0));
    const overall = clamp((clarity + distinctiveness + consistency + memorability) / 4);
    return {
      overall,
      scores: { clarity, distinctiveness, consistency, memorability },
      verdict: `${name} reads ${overall >= 70 ? "solid" : "unclear"} on first contact. ${tagline ? "The tagline helps position it; sharpen the promise it makes." : "Without a tagline, the name has to do all the positioning work alone."}`,
      suggestions: [
        { title: "Sharpen the one-line promise", impact: "high", detail: "Write the single outcome a customer gets, in under 8 words, and use it everywhere." },
        { title: "Run the name against competitors", impact: "medium", detail: `Search "${name} ${industry}" and check you're not blending into the category.` },
        { title: "Lock one visual signature", impact: "medium", detail: "One color, one typeface pairing, one mark, applied without exception." },
      ],
      ai: false,
    };
  },
);

/* ------------------------------------------------------------------ */
/* ROI narrative                                                       */
/* ------------------------------------------------------------------ */

export const runRoiNarrative = createServerFn({ method: "POST" })
  .validator((d: { visitors: number; convRate: number; aov: number; uplift: number; monthlyGain: number; yearlyGain: number }) => d)
  .handler(async ({ data }): Promise<{ narrative: string; ai: boolean }> => {
    const d = data;
    const ai = await geminiText(
      `A prospect used Auxtech's ROI calculator: ${d.visitors} monthly visitors, ${d.convRate}% conversion, $${d.aov} average order, modeling a ${d.uplift}% conversion uplift = $${Math.round(d.monthlyGain)}/month ($${Math.round(d.yearlyGain)}/year) additional revenue.
Write 2 sentences, direct and consultative, on what this means and whether a redesign investment pays back. No greetings, no fluff, no exclamation marks.`,
    );
    return {
      narrative:
        ai ??
        `At ${d.visitors.toLocaleString()} visitors and a ${d.uplift}% conversion lift, you'd add roughly $${Math.round(d.monthlyGain).toLocaleString()} per month. Against a typical fixed-scope build, that pays back inside the first year with room to spare.`,
      ai: !!ai,
    };
  },
);

/* ------------------------------------------------------------------ */
/* Site chat                                                           */
/* ------------------------------------------------------------------ */

const CHAT_SYSTEM = `You are the Auxtech website assistant. Auxtech is a senior-only software studio (est. 2014, 50+ senior designers and engineers, remote-first) building websites, apps, ecommerce and SaaS.
Key facts: first demo by day 7, shippable slice by day 14; fixed-scope projects from $6,500 (websites), UI/UX from $4,500, mobile apps from $28,000, SaaS MVP from $22,000; monthly retainers from $9k; 98 median Lighthouse score; full IP transfer; reply within one business day via the contact page.
Rules: answer in 1-3 short sentences, be direct and helpful, never invent prices beyond the floors above, and when the visitor is ready to talk, point them to the contact page. No exclamation marks.`;

export const runChat = createServerFn({ method: "POST" })
  .validator((d: { messages: { role: "user" | "assistant"; text: string }[] }) => d)
  .handler(async ({ data }): Promise<{ reply: string; ai: boolean }> => {
    const d = data;
    const history = (d?.messages ?? [])
      .slice(-10)
      .map((m) => `${m.role === "user" ? "Visitor" : "Assistant"}: ${m.text}`)
      .join("\n");
    const ai = await geminiText(`${history}\nAssistant:`, CHAT_SYSTEM);
    return {
      reply:
        ai ??
        "Happy to help. Tell me what you're building, or head to the contact page and a senior will reply within one business day.",
      ai: !!ai,
    };
  },
);
