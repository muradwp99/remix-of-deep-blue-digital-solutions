import type { Field } from "payload";
import { slugField } from "./slug";

/**
 * Shared field set for the Services and Solutions collections. Both drive the
 * same bespoke "subpage" detail template on the live site (see
 * `src/lib/subpages.ts` → `Subpage`), so they share one schema.
 *
 * Fields are kept FLAT (unnamed tabs organise the admin UI without nesting the
 * JSON) so the frontend contract stays `doc.heading`, not `doc.hero.heading`.
 * The one exception is `banner`, a genuinely self-contained sub-object that
 * maps 1:1 to `Subpage.banner`.
 *
 * SEO title/description come from the seoPlugin `meta` group, not fields here.
 */
export const subpageFields = (iconHint: string): Field[] => [
  {
    name: "title",
    type: "text",
    required: true,
    admin: { description: "Display name / nav label, e.g. Website Development." },
  },
  {
    type: "tabs",
    tabs: [
      {
        label: "Hero",
        fields: [
          {
            name: "eyebrow",
            type: "text",
            admin: { description: "Small label shown above the headline." },
          },
          {
            type: "row",
            fields: [
              {
                name: "heading",
                type: "text",
                admin: { width: "50%", description: "Headline text before the gold italic word." },
              },
              {
                name: "headingEm",
                type: "text",
                admin: { width: "25%", description: "The gold italic word." },
              },
              {
                name: "headingAfter",
                type: "text",
                admin: {
                  width: "25%",
                  description: "Optional text after the italic word (include leading space/punctuation).",
                },
              },
            ],
          },
          { name: "subtitle", type: "textarea", admin: { description: "Hero paragraph." } },
          {
            name: "summary",
            type: "textarea",
            admin: { description: "One or two sentences shown on the grid card." },
          },
          {
            name: "image",
            type: "upload",
            relationTo: "media",
            admin: { description: "Hero / card illustration (falls back to a stock image if empty)." },
          },
        ],
      },
      {
        label: "Sections",
        fields: [
          {
            name: "features",
            type: "array",
            admin: { description: "'What's included' cards on the detail page." },
            fields: [
              {
                name: "icon",
                type: "text",
                admin: { description: `Lucide icon name, e.g. ${iconHint}.` },
              },
              { name: "title", type: "text", required: true },
              { name: "desc", type: "textarea", required: true },
            ],
          },
          {
            name: "steps",
            type: "array",
            admin: { description: "Process steps, shown in order." },
            fields: [
              { name: "title", type: "text", required: true },
              { name: "desc", type: "textarea", required: true },
            ],
          },
          {
            name: "benefits",
            type: "array",
            admin: { description: "'Why us' benefit list." },
            fields: [
              { name: "title", type: "text", required: true },
              { name: "desc", type: "textarea", required: true },
            ],
          },
        ],
      },
      {
        label: "FAQ & CTA",
        fields: [
          {
            name: "faqs",
            type: "array",
            admin: { description: "Questions shown in the FAQ accordion." },
            fields: [
              { name: "question", type: "text", required: true },
              { name: "answer", type: "textarea", required: true },
            ],
          },
          {
            name: "banner",
            type: "group",
            admin: { description: "Closing call-to-action banner." },
            fields: [
              {
                type: "row",
                fields: [
                  { name: "messageLine1", type: "text", admin: { width: "50%" } },
                  { name: "messageLine2", type: "text", admin: { width: "50%" } },
                ],
              },
              {
                type: "row",
                fields: [
                  {
                    name: "title",
                    type: "text",
                    admin: { width: "45%", description: "Banner headline before the italic word." },
                  },
                  { name: "titleEm", type: "text", admin: { width: "30%", description: "Italic word." } },
                  {
                    name: "titleAfter",
                    type: "text",
                    admin: { width: "25%", description: 'After the italic word (defaults to "."). ' },
                  },
                ],
              },
              { name: "label", type: "text", admin: { description: "Button label." } },
            ],
          },
        ],
      },
    ],
  },
  {
    name: "icon",
    type: "text",
    admin: { position: "sidebar", description: `Lucide icon for the card, e.g. ${iconHint}.` },
  },
  {
    name: "order",
    type: "number",
    defaultValue: 0,
    admin: { position: "sidebar", description: "Lower shows first." },
  },
  slugField(),
];
