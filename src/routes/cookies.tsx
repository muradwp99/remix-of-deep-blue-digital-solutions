import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/legal-page";

export const Route = createFileRoute("/cookies")({
  head: () => ({
    meta: [
      { title: "Cookie Policy — Northline Studio" },
      {
        name: "description",
        content: "What cookies the Northline Studio website sets, why, and how to control them.",
      },
      { property: "og:title", content: "Cookie Policy — Northline Studio" },
      {
        property: "og:description",
        content: "What cookies the Northline Studio website sets, why, and how to control them.",
      },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <LegalPage
      title="Cookie Policy"
      intro="This site runs on a deliberately small cookie footprint: what's strictly necessary, plus lightweight analytics. No ad trackers, no cross-site profiling."
      updated="July 12, 2026"
      sections={[
        {
          h: "What cookies are",
          body: [
            "Cookies are small text files a website stores in your browser to remember state between pages or visits. Similar technologies — localStorage and sessionStorage — serve the same purpose, and this policy covers those too.",
          ],
        },
        {
          h: "Strictly necessary storage",
          body: [
            "We use session storage to remember interface state — for example, that the loading animation has already played this visit. These entries contain no personal data, are never sent to a server, and expire when you close the tab.",
          ],
        },
        {
          h: "Analytics",
          body: [
            "We use privacy-respecting analytics to understand which pages help visitors and which don't. Data is aggregated, IP addresses are not stored, and no profile of you is built or shared. Where consent is legally required for analytics cookies, we ask first.",
          ],
        },
        {
          h: "What we don't do",
          body: [
            "No advertising cookies, no social-media pixels, no fingerprinting, and no selling of browsing data — on this site, ever.",
          ],
        },
        {
          h: "Managing cookies",
          body: [
            'You can clear or block cookies in your browser settings at any time; the site keeps working, though some interface preferences will reset. Instructions live in your browser\'s help pages under "cookies" or "site data".',
          ],
        },
        {
          h: "Changes",
          body: [
            "If we add a category of cookies, this page and the date above will say so before the change takes effect.",
          ],
        },
      ]}
    />
  );
}
