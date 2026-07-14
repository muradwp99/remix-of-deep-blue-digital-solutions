import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/legal-page";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — Northline Studio" },
      {
        name: "description",
        content: "How Northline Studio collects, uses, and protects your personal data.",
      },
      { property: "og:title", content: "Privacy Policy — Northline Studio" },
      {
        property: "og:description",
        content: "How Northline Studio collects, uses, and protects your personal data.",
      },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <LegalPage
      title="Privacy Policy"
      intro="We collect as little as we can, tell you exactly what we do with it, and never sell it. This policy explains the details in plain language."
      updated="July 12, 2026"
      sections={[
        {
          h: "Who we are",
          body: [
            'Northline Studio ("Northline", "we", "us") is a software design and engineering studio. We are the data controller for personal data collected through this website and through our sales and delivery processes.',
          ],
        },
        {
          h: "What we collect",
          body: [
            "Contact details you give us — name, email, company, and anything you write in a project brief or contact form.",
            "Usage data — pages visited, approximate location derived from IP, browser and device type, collected through privacy-respecting analytics.",
            "Client project data — repositories, credentials, and content shared with us during an engagement, handled under the terms of your service agreement and our confidentiality obligations.",
          ],
        },
        {
          h: "How we use it",
          body: [
            "To respond to enquiries, prepare proposals, and deliver contracted work; to improve this website; and to send project-relevant communication. We send marketing email only with your explicit consent, and every message includes a working unsubscribe link.",
            "We never sell personal data, and we never share it with third parties for their own marketing.",
          ],
        },
        {
          h: "Legal bases",
          body: [
            "We process data under contract performance (delivering work you hired us for), legitimate interest (responding to enquiries, securing our systems, minimal analytics), and consent (newsletters and optional cookies). Where consent applies, you can withdraw it at any time.",
          ],
        },
        {
          h: "Third-party processors",
          body: [
            "We use a small set of vetted processors to run our business: cloud hosting, email, analytics, and payment providers. Each is bound by a data processing agreement, and we review the list annually. A current list is available on request.",
          ],
        },
        {
          h: "Retention",
          body: [
            "Enquiry data is kept for 24 months after our last exchange, then deleted. Contract and invoicing records are kept for the period required by tax law. Project data is deleted or returned at handover unless your agreement says otherwise.",
          ],
        },
        {
          h: "Your rights",
          body: [
            "You can request access to, correction of, or deletion of your personal data; ask us to restrict or stop processing; and receive a portable copy. Email us and we will respond within 30 days. If you are in the EEA or UK, you may also lodge a complaint with your supervisory authority.",
          ],
        },
        {
          h: "Security",
          body: [
            "Data is encrypted in transit and at rest. Access follows least privilege with mandatory two-factor authentication, and client credentials live in a managed secrets vault — never in email, chat, or repositories.",
          ],
        },
        {
          h: "Changes to this policy",
          body: [
            "When we change this policy in a way that matters, we update the date above and note the change here. Significant changes affecting active clients are communicated directly.",
          ],
        },
      ]}
    />
  );
}
