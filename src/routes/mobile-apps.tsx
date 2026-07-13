import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteShell } from "@/components/site-shell";
import { pageThemes } from "@/lib/themes";
import { BentoShowcase } from "@/components/bento-features";
import {
  FeatureGrid,
  ProcessSteps,
  BenefitList,
  Testimonials,
  FAQAccordion,
  CTABand,
} from "@/components/sections";
import { ArrowUpRight, Apple, Smartphone, Layers, Zap, Rocket, Activity } from "lucide-react";

export const Route = createFileRoute("/mobile-apps")({
  head: () => ({
    meta: [
      { title: "Mobile App Development — Northline Studio" },
      { name: "description", content: "iOS, Android, Flutter, and React Native apps engineered for retention — a working prototype on your phone in 14 days, store-ready builds from week one." },
      { property: "og:title", content: "Mobile App Development — Northline Studio" },
      { property: "og:description", content: "Apps engineered for retention. A working prototype on your phone in 14 days." },
    ],
  }),
  component: Page,
});

const INCLUDED_CHIPS = [
  "Crash reporting wired",
  "Offline-first sync",
  "Push infrastructure",
  "Deep links & universal links",
  "Analytics events mapped",
  "CI builds on every commit",
  "TestFlight & Play betas",
  "Store listing & screenshots",
  "Accessibility pass",
  "60fps animation budget",
  "Biometric auth",
  "OTA update pipeline",
];

const beyondBuild = [
  { icon: Rocket, title: "MVP Development", desc: "A lean, store-ready first version in 8–14 weeks to test demand with real users." },
  { icon: Layers, title: "App Modernization", desc: "Rescue aging Objective-C and Java codebases without a big-bang rewrite." },
  { icon: Activity, title: "Mobile Analytics", desc: "Event taxonomy, funnels, and cohorts — so 'how's the app doing' has a number." },
  { icon: Zap, title: "Wearable & IoT", desc: "watchOS, Wear OS, and BLE device integration when the phone is only half the product." },
];

function Page() {
  return (
    <SiteShell theme={pageThemes["mobile-apps"]}>
      {/* ---- Hero (bold blue color-block — energetic, ink on saturation) ---- */}
      <section className="block-bold">
        <div className="container-page py-28 md:py-36">
          <p className="text-xs uppercase tracking-[0.28em] text-foreground/70" data-reveal>
            Mobile Apps
          </p>
          <h1
            className="mt-6 max-w-[16ch] font-display text-5xl font-semibold leading-[0.95] md:text-8xl"
            data-split
          >
            Apps people keep on the home screen
          </h1>
          <div className="mt-8 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
            <p className="max-w-xl text-lg leading-relaxed text-muted-foreground" data-reveal>
              Native and cross-platform builds engineered for retention, not just launch day.
              A working prototype on your phone by day 14.
            </p>
            <div data-reveal>
              <Link
                to="/contact"
                data-magnetic
                className="group inline-flex items-center gap-2 rounded-full btn-gold shine px-6 py-3.5 text-sm font-semibold"
              >
                Book a Call
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ---- Light zone: the platform choices ---- */}
      <div className="block-light">
        <FeatureGrid
          variant="rows"
          eyebrow="Capabilities"
          title="The right stack, argued honestly."
          subtitle="We'll tell you when Flutter saves you six figures — and when only native will hit your performance bar."
          items={[
            { icon: Apple, title: "iOS (Swift)", desc: "SwiftUI-first apps that feel like Apple built them. ProMotion, widgets, App Intents." },
            { icon: Smartphone, title: "Android (Kotlin)", desc: "Jetpack Compose, Material 3, and the device-fragmentation testing everyone else skips." },
            { icon: Layers, title: "Flutter", desc: "One codebase, two platforms, pixel parity. Our default for content and commerce apps." },
            { icon: Zap, title: "React Native", desc: "The pragmatic choice when your web team ships TypeScript and speed to market wins." },
          ]}
        />
      </div>

      {/* ---- Tint band: what's in every build (scattered chips) ---- */}
      <div className="block-tint">
        <section className="container-page py-24">
          <div className="mb-14 max-w-3xl">
            <h2 className="font-display text-4xl md:text-6xl leading-tight font-semibold" data-split>
              In the box, every build.
            </h2>
            <p className="mt-6 text-lg text-muted-foreground" data-reveal>
              Not add-ons. Not "phase two." Every Northline app ships with the unglamorous
              infrastructure that decides whether users are still there in month three.
            </p>
          </div>
          <div className="flex flex-wrap gap-3" data-scatter>
            {INCLUDED_CHIPS.map((chip) => (
              <span
                key={chip}
                className="glass rounded-full px-5 py-2.5 text-sm font-medium hover:bg-black/5 hover:text-lime transition-colors"
                data-scatter-item
              >
                {chip}
              </span>
            ))}
          </div>
        </section>
      </div>

      {/* ---- Light zone: process + why our apps win ---- */}
      <div className="block-light">
        <ProcessSteps
          variant="ladder"
          eyebrow="How it works"
          title="Strategy to store in five moves."
          steps={[
            { n: "01", t: "Product Strategy", d: "Platforms, scope, and the one metric the app must move." },
            { n: "02", t: "UX/UI Design", d: "Prototypes tested on real devices in real hands — first live demo on day 7." },
            { n: "03", t: "Agile Development", d: "Weekly builds to your phone via TestFlight and Play internal track." },
            { n: "04", t: "QA & Testing", d: "A 40-device lab, performance profiling, and the edge cases reviewers punish." },
            { n: "05", t: "Launch & Scale", d: "Store submission handled end to end, ASO, and post-launch iteration." },
          ]}
        />

        <BenefitList
          eyebrow="Why our apps win"
          title="Retention is the only vanity-free metric."
          items={[
            { title: "Performance-budgeted", desc: "A 60fps budget enforced in CI — animations that stutter don't merge." },
            { title: "Pixel-accurate UI", desc: "Design QA against the Figma file, screen by screen, before every release." },
            { title: "Offline-first", desc: "Queued writes and conflict resolution, so the app works on the subway and syncs later." },
            { title: "Store-savvy", desc: "We've shipped 60+ store submissions; rejections are edge cases we've already met." },
          ]}
        />
      </div>

      {/* ---- Deep color moment: release machinery bento (dark vignettes) ---- */}
      <div className="block-deep">
        <BentoShowcase
          eyebrow="Release machinery"
          title={
            <>
              From commit to store, on <span className="text-gold">rails</span>.
            </>
          }
          subtitle="Shipping to two app stores every week takes machinery, not heroics. This runs on every build we deliver."
          cards={[
            {
              title: "Stability, measured",
              desc: "Crash reporting is wired before feature one — regressions page us, not your app store reviews.",
              tone: "warm",
              visual: { kind: "gauge", stat: "99.9%", statLabel: "crash-free sessions", value: 0.9 },
            },
            {
              title: "Green before it ships",
              desc: "The 60fps budget, the 40-device lab, and store guideline checks all gate the release — automatically.",
              tone: "cool",
              visual: {
                kind: "checklist",
                rows: ["60fps budget met", "Device lab passed", "Store guidelines clean"],
              },
            },
            {
              title: "Every build in your pocket",
              desc: "Weekly builds land on your phone via TestFlight and Play internal track — you test what users will touch.",
              tone: "cool",
              visual: {
                kind: "inbox",
                tabs: [
                  { label: "All", count: 4 },
                  { label: "Builds", count: 2, active: true },
                  { label: "Reviews", count: 1 },
                ],
                rows: [
                  "Build 214 is on TestFlight",
                  "Play review approved",
                  "Crash triage: 0 open issues",
                ],
              },
            },
            {
              title: "Releases on command",
              desc: "Staged rollouts, promotions, and OTA updates are one-command operations — not release-day ceremonies.",
              tone: "warm",
              visual: {
                kind: "command",
                actions: [
                  { label: "Ship to TestFlight", kbd: "T" },
                  { label: "Promote to Production", kbd: "P" },
                  { label: "Roll Out 10% Cohort", kbd: "C" },
                ],
              },
            },
          ]}
        />
      </div>

      {/* ---- Light zone: proof + what's beyond the build ---- */}
      <div className="block-light">
        {/* Case study callout — metrics-forward, image right */}
        <section className="container-page py-24 border-t border-border/60" data-reveal-group>
          <div className="grid lg:grid-cols-[1.2fr_1fr] overflow-hidden rounded-3xl gradient-card border border-border/60">
            <div className="p-10 md:p-14 order-2 lg:order-1">
              <p className="text-xs uppercase tracking-[0.28em] text-lime" data-reveal-child>
                Case study — Halcyon
              </p>
              <h2 className="mt-4 font-display text-3xl md:text-4xl leading-tight font-semibold" data-reveal-child>
                From two-star legacy app to category leader in one rebuild.
              </h2>
              <p className="mt-4 text-sm text-muted-foreground max-w-lg" data-reveal-child>
                Flutter rebuild of a failing native pair. Shipped to both stores in 16 weeks,
                with the offline sync layer their users had been begging for in reviews.
              </p>
              <div className="mt-8 grid grid-cols-3 gap-6" data-reveal-child>
                {[
                  { v: "4.9", l: "store rating, from 2.3" },
                  { v: "2.1×", l: "day-30 retention" },
                  { v: "99.9%", l: "crash-free sessions" },
                ].map((m) => (
                  <div key={m.l}>
                    <div className="font-display text-3xl font-semibold text-gradient-lime" data-counter>{m.v}</div>
                    <div className="mt-1 text-xs text-muted-foreground">{m.l}</div>
                  </div>
                ))}
              </div>
              <Link to="/works" className="link-underline mt-10 inline-flex items-center gap-2 text-sm font-semibold text-lime" data-reveal-child>
                See how we rebuilt it <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="relative min-h-[300px] overflow-hidden order-1 lg:order-2">
              <img
                src="https://images.unsplash.com/photo-1551650975-87deedd944c3?auto=format&fit=crop&w=1600&q=70"
                alt="Halcyon app on a phone"
                className="absolute inset-0 h-full w-full object-cover"
                data-parallax-img
              />
            </div>
          </div>
        </section>

        {/* Beyond the build — editorial icon-row list (not a second card grid) */}
        <section className="container-page py-24 border-t border-border/60" data-reveal-group>
          <div className="mb-12 max-w-3xl">
            <p className="text-xs uppercase tracking-[0.28em] text-lime" data-reveal-child>
              Beyond the build
            </p>
            <h2 className="mt-4 font-display text-4xl md:text-6xl leading-tight font-semibold" data-reveal-child>
              The app is the start, not the deliverable.
            </h2>
          </div>
          <div className="grid gap-x-12 md:grid-cols-2">
            {beyondBuild.map((it) => (
              <div key={it.title} className="flex gap-5 border-t border-border py-6" data-reveal-child>
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-lime/25 bg-lime/15">
                  <it.icon className="h-5 w-5 text-lime" />
                </span>
                <div>
                  <h3 className="font-display text-lg font-semibold">{it.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{it.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* ---- Dark bookend: prototype offer, testimonials, FAQ, CTA into footer ---- */}
      {/* Conversion band — prototype offer */}
      <section className="container-page py-24 border-t border-border/60" data-reveal>
        <div className="relative overflow-hidden rounded-3xl gradient-card-gold border border-gold/25 p-12 md:p-16">
          <div className="absolute inset-0 grain-bg pointer-events-none" />
          <div
            className="absolute -bottom-32 -left-32 h-80 w-80 rounded-full opacity-30 pointer-events-none"
            style={{ background: "var(--gradient-lime)", filter: "blur(90px)" }}
            data-parallax="-0.15"
          />
          <div className="relative grid lg:grid-cols-[1.4fr_1fr] gap-10 items-center">
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-gold">The 14-day prototype</p>
              <h2 className="mt-4 font-display text-4xl md:text-5xl leading-[1.02] font-semibold">
                A working prototype on your phone in 14 days.
              </h2>
              <p className="mt-5 text-lg text-muted-foreground max-w-xl">
                Fixed price, fixed scope: your core flow, on your device, installable via TestFlight.
                Use it to raise, to test, or to fire us — the prototype is yours either way.
              </p>
            </div>
            <div className="flex lg:justify-end">
              <Link
                to="/contact"
                data-magnetic
                className="group inline-flex items-center gap-2 rounded-full btn-gold shine px-8 py-4 text-sm font-semibold"
              >
                Start the 14-day Sprint
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Testimonials
        items={[
          { q: "Our app hit 4.9 stars and doubled retention in the first quarter.", a: "Lena Novak", r: "Founder, Halcyon" },
          { q: "Weekly builds on my own phone from week one. No agency has ever done that for us.", a: "Sam Rivera", r: "Product Lead, Orbital" },
          { q: "Two OS releases since launch, zero fire drills. The Care plan pays for itself.", a: "Ade Ojo", r: "CEO, Ridgeline" },
        ]}
      />

      <FAQAccordion
        faqs={[
          { q: "Native or cross-platform?", a: "We model it against your roadmap: cross-platform when speed and parity win, native when performance, hardware access, or platform feel is the product. You get the reasoning in writing." },
          { q: "How long to launch?", a: "First live demo on day 7, a prototype on your phone by day 14, and a store-ready MVP typically in 8–14 weeks." },
          { q: "What about maintenance?", a: "Care plans cover OS updates, dependency patches, crash triage, and iteration. 84% of our clients stay on one — it's cheaper than the first fire drill it prevents." },
          { q: "Who owns the app and IP?", a: "You do — code, store listings, and accounts, all transferred at delivery under your own developer accounts from day one." },
        ]}
      />

      <CTABand
        eyebrow="Next step"
        title="Put your idea on a phone."
        subtitle="Book a 30-minute call. We'll tell you what your app should cost, what it shouldn't include at v1, and whether the 14-day prototype fits."
        primary={{ label: "Book a Call", to: "/contact" }}
        secondary={{ label: "View Case Studies", to: "/works" }}
      />
    </SiteShell>
  );
}
