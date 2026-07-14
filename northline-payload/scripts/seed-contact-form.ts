import "dotenv/config";
import { getPayload } from "payload";
import config from "../src/payload.config";

/**
 * Contact form seed — UPSERTS (by title "Contact") the single form that backs
 * the live site's contact page (src/routes/contact.tsx).
 *
 * The field `name`s below are the CONTRACT: the live form POSTs its
 * submissionData keyed by exactly these names, so keep them in sync with
 * contact.tsx. Non-destructive and re-runnable (upsert-by-title, no deletes).
 */

/** Minimal Lexical rich-text value from a plain string. */
const rt = (text: string) => ({
  root: {
    type: "root",
    direction: "ltr" as const,
    format: "" as const,
    indent: 0,
    version: 1,
    children: [
      {
        type: "paragraph",
        version: 1,
        direction: "ltr" as const,
        format: "" as const,
        indent: 0,
        children: [
          { type: "text", text, version: 1, detail: 0, format: 0, mode: "normal", style: "" },
        ],
      },
    ],
  },
});

const payload = await getPayload({ config });

// Field `name`s here MUST match the keys contact.tsx sends. `width` is purely
// cosmetic for the admin form preview — the live site renders its own layout.
const contactForm = {
  title: "Contact",
  submitButtonLabel: "Send message",
  confirmationType: "message" as const,
  confirmationMessage: rt(
    "Thanks. Your brief is in front of a senior right now — expect a reply within one business day.",
  ),
  fields: [
    { blockType: "text", name: "name", label: "Your name", required: true, width: 50 },
    { blockType: "email", name: "email", label: "Work email", required: true, width: 50 },
    { blockType: "text", name: "company", label: "Company", width: 50 },
    { blockType: "text", name: "website", label: "Website", width: 50 },
    { blockType: "text", name: "services", label: "What do you need?", width: 100 },
    { blockType: "text", name: "budget", label: "Budget", width: 100 },
    {
      blockType: "textarea",
      name: "message",
      label: "Tell us about your project",
      required: true,
      width: 100,
    },
  ],
};

// Upsert by title (non-destructive, re-runnable).
const found = await payload.find({
  collection: "forms" as never,
  where: { title: { equals: contactForm.title } },
  limit: 1,
  depth: 0,
});
const existing = found.docs[0] as { id: number | string } | undefined;

if (existing) {
  await payload.update({
    collection: "forms" as never,
    id: existing.id as never,
    data: contactForm as never,
  });
  console.log(`✓ forms: updated "${contactForm.title}" (id ${existing.id})`);
} else {
  const created = (await payload.create({
    collection: "forms" as never,
    data: contactForm as never,
  })) as { id: number | string };
  console.log(`✓ forms: created "${contactForm.title}" (id ${created.id})`);
}

console.log("Contact form seed complete.");
process.exit(0);
