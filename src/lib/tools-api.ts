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

/* ------------------------------------------------------------------ */
/* Project Estimator                                                   */
/* ------------------------------------------------------------------ */

export type EstimateResult = {
  low: number;
  high: number;
  weeks: number;
  phases: { name: string; weeks: number; detail: string }[];
  brief: string;
  ai: boolean;
};

const PROJECT_BASE: Record<string, { low: number; high: number; weeks: number }> = {
  "marketing-site": { low: 6500, high: 18000, weeks: 5 },
  "web-app": { low: 22000, high: 60000, weeks: 10 },
  "mobile-app": { low: 28000, high: 90000, weeks: 12 },
  ecommerce: { low: 15000, high: 45000, weeks: 8 },
  "saas-mvp": { low: 22000, high: 70000, weeks: 9 },
};

const FEATURE_COST: Record<string, { cost: number; weeks: number; label: string }> = {
  auth: { cost: 3500, weeks: 1, label: "Accounts & auth" },
  payments: { cost: 4500, weeks: 1, label: "Payments & billing" },
  cms: { cost: 3000, weeks: 1, label: "CMS editing" },
  ai: { cost: 6000, weeks: 1.5, label: "AI features" },
  integrations: { cost: 4000, weeks: 1, label: "3rd-party integrations" },
  dashboard: { cost: 5000, weeks: 1.5, label: "Dashboards & reporting" },
};

export const runProjectEstimate = createServerFn({ method: "POST" })
  .validator(
    (d: { type: string; size: number; features: string[]; urgency: "standard" | "fast" }) => d,
  )
  .handler(async ({ data }): Promise<EstimateResult> => {
    const base = PROJECT_BASE[data.type] ?? PROJECT_BASE["marketing-site"];
    const sizeFactor = 1 + Math.max(0, data.size - 8) * 0.035;
    const feats = data.features.map((f) => FEATURE_COST[f]).filter(Boolean);
    const featCost = feats.reduce((s, f) => s + f.cost, 0);
    const featWeeks = feats.reduce((s, f) => s + f.weeks, 0);
    const rush = data.urgency === "fast" ? 1.2 : 1;

    const low = Math.round(((base.low + featCost * 0.8) * sizeFactor * rush) / 500) * 500;
    const high = Math.round(((base.high + featCost * 1.2) * sizeFactor * rush) / 500) * 500;
    const weeks = Math.round((base.weeks + featWeeks) * (data.urgency === "fast" ? 0.8 : 1));

    const discovery = Math.max(1, Math.round(weeks * 0.15));
    const design = Math.max(1, Math.round(weeks * 0.25));
    const build = Math.max(2, Math.round(weeks * 0.45));
    const launch = Math.max(1, weeks - discovery - design - build);
    const phases = [
      { name: "Discovery", weeks: discovery, detail: "Workshops, scope lock, success metrics. Your number goes in writing here." },
      { name: "Design", weeks: design, detail: "Flows, prototype, and the design system. Clickable by the end of week one." },
      { name: "Build", weeks: build, detail: "Weekly demos in staging. First live demo by day 7 of this phase." },
      { name: "Launch & handover", weeks: launch, detail: "QA, performance pass, analytics wiring, docs, and full IP transfer." },
    ];

    const brief = await geminiText(
      "Write a 3-sentence project brief for a prospect who estimated: " +
        data.type.replace("-", " ") +
        ", ~" + data.size + " pages/screens, features [" +
        (feats.map((f) => f.label).join(", ") || "core only") +
        "], " + data.urgency + " timeline, budget range $" + low.toLocaleString() +
        "-$" + high.toLocaleString() + ", ~" + weeks +
        " weeks. Consultative, direct, second person, no greetings, no exclamation marks. End by noting the number becomes fixed after one scoping call.",
    );

    return {
      low,
      high,
      weeks,
      phases,
      brief:
        brief ??
        "A " + data.type.replace("-", " ") + " at this scope typically lands between $" +
          low.toLocaleString() + " and $" + high.toLocaleString() + " over about " + weeks +
          " weeks. The range narrows to a fixed number after one scoping call, and that number is the one we put in writing.",
      ai: !!brief,
    };
  });

/* ------------------------------------------------------------------ */
/* Stack Recommender                                                   */
/* ------------------------------------------------------------------ */

export type StackResult = {
  stack: { layer: string; pick: string; why: string }[];
  alternatives: string;
  hiring: string;
  ai: boolean;
};

export const runStackRecommend = createServerFn({ method: "POST" })
  .validator(
    (d: { product: string; scale: string; team: string; priorities: string }) => d,
  )
  .handler(async ({ data }): Promise<StackResult> => {
    const ai = await geminiJson<StackResult>(
      "You are a principal engineer at Auxtech advising a founder. Recommend a pragmatic 2026 production stack.\n" +
        "Product: " + data.product + "\nExpected scale: " + data.scale +
        "\nTeam background: " + (data.team || "unspecified") +
        "\nPriorities: " + (data.priorities || "speed to market") +
        '\nReturn JSON exactly: {"stack": [{"layer": "Frontend"|"Backend"|"Database"|"Hosting"|"Extras", "pick": string, "why": "one concrete sentence"}], "alternatives": "one sentence naming the strongest alternative stack and when to prefer it", "hiring": "one sentence on how easy it is to hire for this stack"} with exactly 5 stack rows. Prefer boring, proven tech; no exotic picks without reason.',
    );
    if (ai?.stack?.length) return { ...ai, ai: true };
    return {
      stack: [
        { layer: "Frontend", pick: "React + Next.js + Tailwind", why: "Largest talent pool, mature tooling, and SSR out of the box." },
        { layer: "Backend", pick: "Node.js (TypeScript)", why: "One language across the stack keeps a small team fast." },
        { layer: "Database", pick: "PostgreSQL", why: "Handles relational and JSON workloads; boring in the best way." },
        { layer: "Hosting", pick: "Vercel + managed Postgres", why: "Zero-ops deploys until real scale demands more control." },
        { layer: "Extras", pick: "Stripe, Resend, Sentry", why: "Payments, email, and error tracking solved with vendor-grade reliability." },
      ],
      alternatives: "If your team is Python-first, Django + HTMX ships CRUD products faster; prefer it when the UI is forms-heavy.",
      hiring: "React plus TypeScript plus Postgres is the easiest senior hiring market in the industry.",
      ai: false,
    };
  });

/* ------------------------------------------------------------------ */
/* Headline Analyzer                                                   */
/* ------------------------------------------------------------------ */

export type HeadlineResult = {
  scores: { clarity: number; specificity: number; outcome: number; energy: number };
  overall: number;
  verdict: string;
  rewrites: string[];
  ai: boolean;
};

export const runHeadlineAnalyze = createServerFn({ method: "POST" })
  .validator((d: { headline: string; audience?: string }) => d)
  .handler(async ({ data }): Promise<HeadlineResult | { error: string }> => {
    const headline = data.headline.trim();
    if (!headline) return { error: "Paste the headline first." };
    if (headline.length > 200) return { error: "That's a paragraph, not a headline. Trim it under 200 characters." };

    const ai = await geminiJson<HeadlineResult>(
      "You are a conversion copywriter at Auxtech. Analyze this website headline" +
        (data.audience ? " (audience: " + data.audience + ")" : "") + ':\n"' + headline + '"\n' +
        'Return JSON exactly: {"scores": {"clarity": 0-100, "specificity": 0-100, "outcome": 0-100, "energy": 0-100}, "overall": 0-100, "verdict": "2 direct sentences on what works and what fails", "rewrites": [5 stronger rewrites, each under 10 words, varied angles: outcome-led, number-led, pain-led, contrast-led, plain-spoken]}. Grade hard; generic verbs like elevate/unleash/empower lose points.',
    );
    if (ai?.scores) return { ...ai, rewrites: ai.rewrites?.slice(0, 5) ?? [], ai: true };

    const words = headline.split(/\s+/).length;
    const hasNumber = /\d/.test(headline);
    const vague = /(elevate|unleash|empower|seamless|next-gen|revolutioniz|innovative|solutions)/i.test(headline);
    const clarity = clamp(80 - Math.max(0, words - 10) * 5 - (vague ? 20 : 0));
    const specificity = clamp(40 + (hasNumber ? 30 : 0) - (vague ? 15 : 0) + Math.min(20, headline.length / 6));
    const outcome = clamp(/(get|grow|save|ship|double|cut|win|faster|more)/i.test(headline) ? 72 : 45);
    const energy = clamp(60 - (words > 14 ? 15 : 0) + (hasNumber ? 8 : 0));
    const overall = clamp((clarity + specificity + outcome + energy) / 4);
    return {
      scores: { clarity, specificity, outcome, energy },
      overall,
      verdict:
        (vague ? "It leans on filler verbs that every competitor also uses." : "It reads clean.") +
        " " +
        (hasNumber
          ? "The number helps it feel concrete."
          : "Without a number or named outcome, it asks the visitor to take craft on faith."),
      rewrites: [
        "Ship your product in 14 days",
        "The site your revenue deserves",
        "Stop losing sales to slow pages",
        "98 Lighthouse. Every launch.",
        "Software that pays for itself",
      ],
      ai: false,
    };
  });

/* ------------------------------------------------------------------ */
/* SEO Meta Generator                                                  */
/* ------------------------------------------------------------------ */

export type MetaResult = {
  title: string;
  description: string;
  og: { property: string; content: string }[];
  jsonLd: string;
  ai: boolean;
};

export const runMetaGenerate = createServerFn({ method: "POST" })
  .validator(
    (d: { business: string; offering: string; audience?: string; location?: string }) => d,
  )
  .handler(async ({ data }): Promise<MetaResult | { error: string }> => {
    const business = data.business.trim();
    const offering = data.offering.trim();
    if (!business || !offering) return { error: "Business name and what you offer are both needed." };

    const ai = await geminiJson<{ title: string; description: string }>(
      "Write SEO meta for a homepage.\nBusiness: " + business + ". Offering: " + offering +
        ". Audience: " + (data.audience || "general") + ". Location: " + (data.location || "none") +
        '.\nReturn JSON: {"title": "max 60 chars, brand at end after a hyphen, benefit-led", "description": "max 155 chars, one concrete benefit + one differentiator + soft call to action, no exclamation marks"}.',
    );

    const title = (ai?.title ?? offering.slice(0, 40) + " - " + business).slice(0, 60);
    const description = (
      ai?.description ??
      business + " delivers " + offering.toLowerCase() +
        (data.location ? " in " + data.location : "") +
        ". Built for " + (data.audience || "teams that care about results") + ". See how we can help."
    ).slice(0, 158);

    const og = [
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: business },
      { property: "twitter:card", content: "summary_large_image" },
    ];

    const jsonLd = JSON.stringify(
      {
        "@context": "https://schema.org",
        "@type": data.location ? "LocalBusiness" : "Organization",
        name: business,
        description,
        ...(data.location ? { address: { "@type": "PostalAddress", addressLocality: data.location } } : {}),
      },
      null,
      2,
    );

    return { title, description, og, jsonLd, ai: !!ai };
  });
