import { createFileRoute } from "@tanstack/react-router";
import { LegalPage, normalizeLegalSections, type LegalSection } from "@/components/legal-page";
import { cmsFindOne, pageRows, pageStr, type SitePageDoc } from "@/lib/cms";
import { useLiveEdits } from "@/lib/edit-bridge";

export const Route = createFileRoute("/terms")({
  // LivePress: editable via the `terms` Site Page doc, fail-soft to copy below.
  loader: async (): Promise<{ doc: SitePageDoc }> => {
    const doc = await cmsFindOne<Record<string, unknown>>("sitepages", "terms");
    return { doc };
  },
  head: ({ loaderData }) => {
    const d = loaderData?.doc ?? null;
    const title = pageStr(d, "meta_title", "Terms of Service — Auxtech");
    const description = pageStr(
      d,
      "meta_description",
      "The terms that govern use of the Auxtech website and our engagement process.",
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
    h: "Scope",
    body: [
      "These terms govern your use of the Auxtech website and the materials published on it. Client engagements are governed by a separately signed services agreement; if that agreement conflicts with these terms, the agreement wins.",
    ],
  },
  {
    h: "Use of the site",
    body: [
      "You may browse, link to, and quote from this site with attribution. You may not scrape it at scale, misrepresent its content as your own, attempt to breach its security, or use it to send us unlawful material.",
    ],
  },
  {
    h: "Intellectual property",
    body: [
      "The design, text, and imagery on this site belong to Auxtech or their respective licensors. Case-study names and client marks belong to their owners and appear with permission.",
      "For client work: intellectual property in deliverables transfers to you as set out in your services agreement — typically in full, on final payment.",
    ],
  },
  {
    h: "Proposals and estimates",
    body: [
      "Figures published on this site — timelines, price ranges, and outcome metrics — are historical or indicative. They become commitments only when written into a signed proposal or agreement.",
    ],
  },
  {
    h: "Free tools and resources",
    body: [
      "Audits, calculators, templates, and guides are provided as-is, for information only, and do not constitute professional advice. Verify results against your own data before making decisions based on them.",
    ],
  },
  {
    h: "Disclaimers and liability",
    body: [
      "The site is provided without warranties of any kind, express or implied. To the maximum extent permitted by law, Auxtech is not liable for indirect or consequential loss arising from use of this site. Nothing here limits liability that cannot lawfully be limited.",
    ],
  },
  {
    h: "Third-party links",
    body: [
      "The site links to external services and content we do not control. Their terms and privacy practices are their own; a link is not an endorsement.",
    ],
  },
  {
    h: "Changes and contact",
    body: [
      "We may update these terms; the date above reflects the current version. Continued use of the site after a change constitutes acceptance. Questions are welcome via the contact page.",
    ],
  },
];

function Page() {
  const { doc } = Route.useLoaderData();
  // LivePress: overlay admin keystrokes (flat meta keys) on the page doc.
  const d = useLiveEdits(doc);
  return (
    <LegalPage
      title={pageStr(d, "legal_title", "Terms of Service")}
      intro={pageStr(
        d,
        "legal_intro",
        "Short version: use the site fairly, our published content stays ours until a contract says otherwise, and every engagement runs on a written agreement — not on this page.",
      )}
      updated={pageStr(d, "legal_updated", "July 12, 2026")}
      sections={normalizeLegalSections(pageRows(d, "legal_sections", sectionsFallback))}
    />
  );
}
