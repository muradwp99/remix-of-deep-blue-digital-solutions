import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/legal-page";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms of Service — Northline Studio" },
      {
        name: "description",
        content:
          "The terms that govern use of the Northline Studio website and our engagement process.",
      },
      { property: "og:title", content: "Terms of Service — Northline Studio" },
      {
        property: "og:description",
        content:
          "The terms that govern use of the Northline Studio website and our engagement process.",
      },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <LegalPage
      title="Terms of Service"
      intro="Short version: use the site fairly, our published content stays ours until a contract says otherwise, and every engagement runs on a written agreement — not on this page."
      updated="July 12, 2026"
      sections={[
        {
          h: "Scope",
          body: [
            "These terms govern your use of the Northline Studio website and the materials published on it. Client engagements are governed by a separately signed services agreement; if that agreement conflicts with these terms, the agreement wins.",
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
            "The design, text, and imagery on this site belong to Northline Studio or their respective licensors. Case-study names and client marks belong to their owners and appear with permission.",
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
            "The site is provided without warranties of any kind, express or implied. To the maximum extent permitted by law, Northline Studio is not liable for indirect or consequential loss arising from use of this site. Nothing here limits liability that cannot lawfully be limited.",
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
      ]}
    />
  );
}
