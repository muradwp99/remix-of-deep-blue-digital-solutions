import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteShell } from "@/components/site-shell";
import { Mail, MapPin, Phone, ArrowUpRight, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import {
  cmsFind,
  cmsFindOne,
  cmsSubmitForm,
  pageLines,
  pageRows,
  pageStr,
  type SitePageDoc,
} from "@/lib/cms";
import { useLiveEdits } from "@/lib/edit-bridge";

export const Route = createFileRoute("/contact")({
  /**
   * `?role=` turns this into an application form. The careers page sends
   * candidates here, and without it they are asked for a budget and which
   * services they would like to buy — a client's questions, put to someone
   * applying for a job.
   */
  validateSearch: (search: Record<string, unknown>): { role?: string } => {
    const role = typeof search.role === "string" ? search.role.trim() : "";
    // Only return the key when it has a value — a schema that always carries
    // `role` makes `search` a required prop on every `<Link to="/contact">`
    // on the site.
    return role ? { role } : {};
  },
  // Resolve the CMS "Contact" form id so submissions can be saved, plus the
  // `contact` Site Page doc for LivePress copy. Both fail soft.
  loader: async (): Promise<{ formId: string | number | null; doc: SitePageDoc }> => {
    const [docs, doc] = await Promise.all([
      cmsFind<{ id: string | number }>("forms", {
        where: { title: { equals: "Contact" } },
        limit: 1,
        depth: 0,
      }),
      cmsFindOne<Record<string, unknown>>("sitepages", "contact"),
    ]);
    return { formId: docs[0]?.id ?? null, doc };
  },
  head: ({ loaderData }) => {
    const d = loaderData?.doc ?? null;
    const title = pageStr(d, "meta_title", "Contact — Auxtech");
    const description = pageStr(
      d,
      "meta_description",
      "Start a project with Auxtech. We reply within one business day.",
    );
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
      ],
    };
  },
  component: ContactPage,
});

const services = [
  "Website Development",
  "UI/UX Design",
  "CMS Website",
  "Mobile App",
  "Ecommerce",
  "SaaS Product",
  "Brand & Marketing",
  "Monthly Care",
  "Other",
];

const budgets = ["< $10k", "$10k – $25k", "$25k – $60k", "$60k – $150k", "$150k+"];

const nextSteps = [
  {
    n: "01",
    t: "A senior replies — within one business day",
    d: "Not a sales rep or an SDR sequence. Whoever answers is someone who could build your project.",
  },
  {
    n: "02",
    t: "A 30-minute scoping call",
    d: "We pressure-test the brief, flag risks, and tell you honestly if we're not the right fit.",
  },
  {
    n: "03",
    t: "A fixed number in writing",
    d: "Plan, timeline, and budget on paper. Say yes and your first demo is on screen by day 7.",
  },
];

function ContactPage() {
  const { formId, doc } = Route.useLoaderData();
  // LivePress: overlay admin keystrokes (flat meta keys) on the page doc.
  const d = useLiveEdits(doc);
  const s = (key: string, fallback: string) => pageStr(d, key, fallback);
  const serviceOptions = pageLines(d, "service_options", services);
  const budgetOptions = pageLines(d, "budget_options", budgets);
  const steps = pageRows(d, "next_steps", nextSteps);
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [website, setWebsite] = useState("");
  // Named `selectedServices` to avoid shadowing the module-level `services`
  // options array used to render the checkboxes below.
  const { role } = Route.useSearch();
  const applying = Boolean(role);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [budget, setBudget] = useState("");
  const [message, setMessage] = useState("");

  const toggleService = (s: string) =>
    setSelectedServices((prev) => (prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]));

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = {
      name,
      email,
      company,
      website,
      services: selectedServices.join(", "),
      budget,
      message,
      ...(role ? { role } : {}),
    };
    // Save to the CMS when the form exists; never regress the UX — always show
    // the success state, even if the POST fails or the form id is unavailable.
    if (formId != null) {
      const ok = await cmsSubmitForm(formId, data);
      if (!ok) console.warn("Contact form: submission failed to save to the CMS.");
    } else {
      console.warn("Contact form: no CMS form id — submission not saved.");
    }
    setSubmitted(true);
  };

  return (
    <SiteShell>
      {/* ---- Hero (light editorial) ---- */}
      <section className="block-light">
        <div className="container-page grid items-end gap-12 py-24 md:grid-cols-[1.1fr_0.9fr] md:py-32">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-gold" data-reveal>
              {s("hero_eyebrow", "Contact")}
            </p>
            <h1
              className="mt-6 max-w-[15ch] font-display text-5xl font-semibold leading-[0.98] md:text-7xl"
              data-reveal
            >
              {applying ? "Tell us why you'd be" : s("hero_title", "Tell us about your")}{" "}
              <span className="text-gold">
                {applying ? "a fit" : s("hero_title_em", "project")}
              </span>
              .
            </h1>
            <p className="mt-7 max-w-md text-lg leading-relaxed text-muted-foreground" data-reveal>
              {applying
                ? `Applying for ${role}. Tell us what you would own and show us one thing you have shipped — we reply within one business day.`
                : s(
                    "hero_subtitle",
                    "Answer a few questions and we'll reply within one business day with a plan, a timeline, and a fair budget.",
                  )}
            </p>
          </div>
          <figure className="relative" data-reveal>
            <div
              className="absolute -left-4 -top-4 h-full w-full rounded-[2rem] border border-gold/30"
              aria-hidden
            />
            <img
              src={s(
                "hero_img",
                "https://images.unsplash.com/photo-1423666639041-f56000c27a9a?auto=format&fit=crop&w=1200&q=75",
              )}
              alt="A quiet place to start the conversation"
              className="aspect-[4/5] w-full rounded-[2rem] border border-black/10 object-cover shadow-elegant transition-transform duration-700 hover:scale-[1.015]"
              data-parallax-img
            />
          </figure>
        </div>
      </section>

      <section className="block-light">
        <div className="container-page relative grid gap-16 py-24 md:grid-cols-12">
          {/* decorative parallax glow */}
          <div
            className="pointer-events-none absolute -left-40 top-1/3 -z-10 h-96 w-96 rounded-full opacity-25"
            style={{ background: "var(--gradient-lime)", filter: "blur(100px)" }}
            data-parallax="0.3"
          />

          <div className="space-y-12 md:col-span-4">
            <div data-reveal-group>
              <p className="text-xs uppercase tracking-[0.28em] text-lime" data-reveal-child>
                {s("steps_eyebrow", "What happens next")}
              </p>
              <h2 className="mt-4 font-display text-3xl font-semibold" data-reveal-child>
                {s("steps_heading", "Three steps, no run-around.")}
              </h2>
              <div className="mt-8 space-y-3">
                {steps.map((step) => (
                  <div
                    key={step.n}
                    className="glass lift flex gap-5 rounded-2xl p-6"
                    data-reveal-child
                  >
                    <span className="shrink-0 font-display text-2xl font-semibold text-gradient-lime">
                      {step.n}
                    </span>
                    <div>
                      <h3 className="font-display text-base font-semibold">{step.t}</h3>
                      <p className="mt-1.5 text-sm text-muted-foreground">{step.d}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-6" data-reveal>
              <p className="text-xs uppercase tracking-[0.28em] text-lime">Direct lines</p>
              <div className="flex gap-4">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg border border-border bg-surface">
                  <Mail className="h-5 w-5 text-lime" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Email</p>
                  <a
                    href={`mailto:${s("contact_email", "hello@auxtech.studio")}`}
                    className="link-underline mt-1 inline-block text-foreground"
                  >
                    {s("contact_email", "hello@auxtech.studio")}
                  </a>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg border border-border bg-surface">
                  <Phone className="h-5 w-5 text-lime" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Phone</p>
                  <a
                    href={`tel:${s("contact_phone", "+1 (415) 555-0134").replace(/[^+\d]/g, "")}`}
                    className="link-underline mt-1 inline-block text-foreground"
                  >
                    {s("contact_phone", "+1 (415) 555-0134")}
                  </a>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg border border-border bg-surface">
                  <MapPin className="h-5 w-5 text-lime" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Studio</p>
                  <p className="mt-1 text-foreground">{s("contact_studio", "Remote-first")}</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {s(
                      "contact_studio_note",
                      "Remote-first since 2014 — one senior team, and the people who answer are the people who build.",
                    )}
                  </p>
                </div>
              </div>
            </div>

            <div className="gradient-card-gold rounded-2xl border border-gold/25 p-6" data-reveal>
              <p className="text-xs uppercase tracking-[0.2em] text-gold">
                {s("response_eyebrow", "Response time")}
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                {s(
                  "response_text",
                  "Reply within one business day — from a senior, not a sales rep. Usually the same afternoon.",
                )}
              </p>
            </div>
          </div>

          <div className="md:col-span-8" data-reveal>
            {submitted ? (
              <div className="glass-strong relative overflow-hidden rounded-3xl border border-lime/30 p-10 md:p-14">
                <div className="pointer-events-none absolute inset-0 grain-bg" />
                <div className="relative">
                  <div className="grid h-14 w-14 place-items-center rounded-2xl border border-lime/30 bg-lime/10">
                    <CheckCircle2 className="h-7 w-7 text-lime" />
                  </div>
                  <p className="mt-8 text-xs uppercase tracking-[0.28em] text-lime">Received</p>
                  <h3 className="mt-4 font-display text-4xl font-semibold md:text-5xl">
                    Thanks. Talk <span className="text-gold">soon</span>.
                  </h3>
                  <p className="mt-4 max-w-md text-lg text-muted-foreground">
                    Your brief is in front of a senior right now. Expect a reply within one business
                    day.
                  </p>
                  <div className="mt-10 space-y-3 border-t border-black/10 pt-8">
                    <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                      While you wait
                    </p>
                    <div className="flex flex-wrap gap-3">
                      <Link
                        to="/works"
                        className="inline-flex items-center gap-2 rounded-full glass px-5 py-2.5 text-sm font-medium hover:bg-white/5"
                      >
                        Browse recent work
                        <ArrowUpRight className="h-4 w-4" />
                      </Link>
                      <Link
                        to="/pricing"
                        className="inline-flex items-center gap-2 rounded-full glass px-5 py-2.5 text-sm font-medium hover:bg-white/5"
                      >
                        Check the pricing floors
                        <ArrowUpRight className="h-4 w-4" />
                      </Link>
                    </div>
                    <p className="pt-2 text-sm text-muted-foreground">
                      In a hurry? Email{" "}
                      <a
                        href={`mailto:${s("contact_email", "hello@auxtech.studio")}`}
                        className="link-underline text-foreground"
                      >
                        {s("contact_email", "hello@auxtech.studio")}
                      </a>{" "}
                      with "urgent" in the subject and we'll bump you up the queue.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="glass-strong space-y-6 rounded-3xl p-8 md:p-10"
              >
                <div className="grid gap-6 md:grid-cols-2">
                  <Field label="Your name">
                    <input
                      required
                      className={inputCls}
                      placeholder="Jane Doe"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </Field>
                  <Field label="Work email">
                    <input
                      required
                      type="email"
                      className={inputCls}
                      placeholder="jane@company.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </Field>
                  <Field label="Company">
                    <input
                      className={inputCls}
                      placeholder="Acme Inc."
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                    />
                  </Field>
                  <Field label="Website">
                    <input
                      className={inputCls}
                      placeholder="acme.com"
                      value={website}
                      onChange={(e) => setWebsite(e.target.value)}
                    />
                  </Field>
                </div>

                {!applying && (
                  <>
                    <Field label="What do you need?">
                      <div className="flex flex-wrap gap-2">
                        {serviceOptions.map((s) => (
                          <label
                            key={s}
                            className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-border bg-background/50 px-3 py-1.5 text-sm transition-colors hover:border-lime/40 hover:bg-surface has-checked:border-lime/50 has-checked:bg-lime/10 has-checked:text-foreground"
                          >
                            <input
                              type="checkbox"
                              className="accent-lime"
                              checked={selectedServices.includes(s)}
                              onChange={() => toggleService(s)}
                            />
                            {s}
                          </label>
                        ))}
                      </div>
                    </Field>

                    <Field label="Budget">
                      <div className="flex flex-wrap gap-2">
                        {budgetOptions.map((b) => (
                          <label
                            key={b}
                            className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-border bg-background/50 px-3 py-1.5 text-sm transition-colors hover:border-lime/40 hover:bg-surface has-checked:border-lime/50 has-checked:bg-lime/10 has-checked:text-foreground"
                          >
                            <input
                              type="radio"
                              name="budget"
                              className="accent-lime"
                              checked={budget === b}
                              onChange={() => setBudget(b)}
                            />
                            {b}
                          </label>
                        ))}
                      </div>
                    </Field>
                  </>
                )}

                <Field
                  label={
                    applying
                      ? "Why this role, and one thing you have shipped"
                      : "Tell us about your project"
                  }
                >
                  <textarea
                    rows={5}
                    required
                    className={inputCls}
                    placeholder="Goals, timeline, links to anything relevant..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                </Field>

                <div className="flex flex-wrap items-center gap-5 pt-2">
                  <button
                    type="submit"
                    data-magnetic
                    className="group inline-flex items-center gap-2 rounded-full btn-gold shine px-6 py-3.5 text-sm font-semibold hover:border-lime/40"
                  >
                    Send message
                    <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </button>
                  <p className="text-sm text-muted-foreground">
                    Reply within one business day —{" "}
                    <span className="text-foreground">a senior, not a sales rep</span>.
                  </p>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>
    </SiteShell>
  );
}

const inputCls =
  "w-full rounded-lg border border-input bg-input/15 px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 transition-colors focus:outline-none focus:border-lime/50 focus:ring-1 focus:ring-lime/30";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-xs font-medium uppercase tracking-[0.2em] text-foreground/75">
        {label}
      </span>
      <div className="mt-2">{children}</div>
    </label>
  );
}
