import { createFileRoute } from "@tanstack/react-router";
import { SiteShell, PageHeader } from "@/components/site-shell";
import { Mail, MapPin, Phone, ArrowUpRight } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Northline Studio" },
      { name: "description", content: "Start a project with Northline. We reply within one business day." },
      { property: "og:title", content: "Contact — Northline Studio" },
      { property: "og:description", content: "Start a project with Northline. We reply within one business day." },
    ],
  }),
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

function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <SiteShell>
      <PageHeader
        eyebrow="Contact"
        title={<>Tell us about your <em className="italic text-gradient">project</em>.</>}
        subtitle="Answer a few questions and we'll reply within one business day with a plan, a timeline, and a fair budget."
      />

      <section className="container-page py-24 grid md:grid-cols-12 gap-16">
        <div className="md:col-span-4 space-y-10">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-gold">Get in touch</p>
            <h2 className="mt-3 font-display text-3xl">Direct lines.</h2>
          </div>
          <div className="space-y-6">
            {[
              { icon: Mail, label: "Email", value: "hello@northline.studio" },
              { icon: Phone, label: "Phone", value: "+1 (415) 555-0134" },
              { icon: MapPin, label: "Studio", value: "San Francisco · London · Lisbon" },
            ].map((c) => (
              <div key={c.label} className="flex gap-4">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg border border-border bg-surface">
                  <c.icon className="h-5 w-5 text-gold" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{c.label}</p>
                  <p className="mt-1 text-foreground">{c.value}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-2xl border border-border bg-surface/40 p-6">
            <p className="text-xs uppercase tracking-[0.2em] text-gold">Response time</p>
            <p className="mt-2 text-sm text-muted-foreground">
              We reply to every serious inquiry within one business day, usually the same day.
            </p>
          </div>
        </div>

        <div className="md:col-span-8">
          {submitted ? (
            <div className="rounded-3xl border border-gold/40 bg-surface/50 p-12 text-center">
              <p className="text-xs uppercase tracking-[0.24em] text-gold">Received</p>
              <h3 className="mt-4 font-display text-4xl">Thanks — talk soon.</h3>
              <p className="mt-4 text-muted-foreground max-w-md mx-auto">
                We've got your message and will be in touch within one business day.
              </p>
            </div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setSubmitted(true);
              }}
              className="rounded-3xl border border-border bg-surface/40 p-8 md:p-10 space-y-6"
            >
              <div className="grid md:grid-cols-2 gap-6">
                <Field label="Your name">
                  <input required className={inputCls} placeholder="Jane Doe" />
                </Field>
                <Field label="Work email">
                  <input required type="email" className={inputCls} placeholder="jane@company.com" />
                </Field>
                <Field label="Company">
                  <input className={inputCls} placeholder="Acme Inc." />
                </Field>
                <Field label="Website">
                  <input className={inputCls} placeholder="acme.com" />
                </Field>
              </div>

              <Field label="What do you need?">
                <div className="flex flex-wrap gap-2">
                  {services.map((s) => (
                    <label
                      key={s}
                      className="inline-flex items-center gap-2 rounded-full border border-border bg-background/50 px-3 py-1.5 text-sm cursor-pointer hover:bg-surface"
                    >
                      <input type="checkbox" className="accent-gold" />
                      {s}
                    </label>
                  ))}
                </div>
              </Field>

              <Field label="Budget">
                <div className="flex flex-wrap gap-2">
                  {budgets.map((b) => (
                    <label
                      key={b}
                      className="inline-flex items-center gap-2 rounded-full border border-border bg-background/50 px-3 py-1.5 text-sm cursor-pointer hover:bg-surface"
                    >
                      <input type="radio" name="budget" className="accent-gold" />
                      {b}
                    </label>
                  ))}
                </div>
              </Field>

              <Field label="Tell us about your project">
                <textarea rows={5} required className={inputCls} placeholder="Goals, timeline, links to anything relevant..." />
              </Field>

              <button
                type="submit"
                className="group inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background hover:bg-foreground/90"
              >
                Send message
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </button>
            </form>
          )}
        </div>
      </section>
    </SiteShell>
  );
}

const inputCls =
  "w-full rounded-lg border border-border bg-background/60 px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-gold/60";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{label}</span>
      <div className="mt-2">{children}</div>
    </label>
  );
}
