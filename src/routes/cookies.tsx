import { createFileRoute } from "@tanstack/react-router";
import { LegalPage, normalizeLegalSections, type LegalSection } from "@/components/legal-page";
import { cmsFindOne, pageRows, pageStr, type SitePageDoc } from "@/lib/cms";
import { useLiveEdits } from "@/lib/edit-bridge";

export const Route = createFileRoute("/cookies")({
  // LivePress: editable via the `cookies` Site Page doc, fail-soft to copy below.
  loader: async (): Promise<{ doc: SitePageDoc }> => {
    const doc = await cmsFindOne<Record<string, unknown>>("sitepages", "cookies");
    return { doc };
  },
  head: ({ loaderData }) => {
    const d = loaderData?.doc ?? null;
    const title = pageStr(d, "meta_title", "Cookie Policy — Auxtech");
    const description = pageStr(
      d,
      "meta_description",
      "What cookies the Auxtech website sets, why, and how to control them.",
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
  component: Page,
});

const sectionsFallback: LegalSection[] = [
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
];

function Page() {
  const { doc } = Route.useLoaderData();
  // LivePress: overlay admin keystrokes (flat meta keys) on the page doc.
  const d = useLiveEdits(doc);
  return (
    <LegalPage
      title={pageStr(d, "legal_title", "Cookie Policy")}
      intro={pageStr(
        d,
        "legal_intro",
        "This site runs on a deliberately small cookie footprint: what's strictly necessary, plus lightweight analytics. No ad trackers, no cross-site profiling.",
      )}
      updated={pageStr(d, "legal_updated", "July 12, 2026")}
      sections={normalizeLegalSections(pageRows(d, "legal_sections", sectionsFallback))}
    />
  );
}
