import type { CollectionConfig } from "payload";
import { anyone } from "../access/anyone";
import { authenticated } from "../access/authenticated";
import { slugField } from "../fields/slug";

export const Industries: CollectionConfig = {
  slug: "industries",
  labels: { singular: "Industry", plural: "Industries" },
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "icon", "order", "updatedAt"],
    group: "Catalog",
    description: "Industry pages (fintech, healthcare, retail…) shown on the industries grid and detail pages.",
    listSearchableFields: ["title", "summary", "slug"],
  },
  access: { read: anyone, create: authenticated, update: authenticated, delete: authenticated },
  defaultSort: "order",
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
      admin: { description: "Display name / nav label, e.g. Fintech." },
    },
    {
      type: "tabs",
      tabs: [
        {
          label: "Hero",
          fields: [
            { name: "eyebrow", type: "text", admin: { description: "Small label above the headline." } },
            {
              type: "row",
              fields: [
                {
                  name: "heading",
                  type: "text",
                  admin: { width: "70%", description: "Headline text before the gold italic word." },
                },
                {
                  name: "headingEm",
                  type: "text",
                  admin: { width: "30%", description: "The gold italic word." },
                },
              ],
            },
            { name: "subtitle", type: "textarea", admin: { description: "Hero paragraph." } },
            {
              name: "summary",
              type: "textarea",
              admin: { description: "One or two sentences shown on the industry card." },
            },
            {
              name: "image",
              type: "upload",
              relationTo: "media",
              admin: { description: "Hero illustration (falls back to a stock image if empty)." },
            },
            {
              name: "matches",
              type: "text",
              hasMany: true,
              admin: {
                description: "Case-study `industry` values that belong to this page, e.g. Ecommerce, Retail.",
              },
            },
          ],
        },
        {
          label: "Sections",
          fields: [
            {
              name: "points",
              type: "array",
              admin: { description: "Capability points shown on the detail page." },
              fields: [
                {
                  name: "icon",
                  type: "text",
                  admin: { description: "Lucide icon name, e.g. Banknote, ShieldCheck, Gauge." },
                },
                { name: "title", type: "text", required: true },
                { name: "desc", type: "textarea", required: true },
              ],
            },
            {
              name: "stats",
              type: "array",
              admin: { description: "Headline stats for this industry." },
              fields: [
                { name: "value", type: "text", required: true },
                { name: "label", type: "text", required: true },
              ],
            },
          ],
        },
        {
          label: "CTA",
          fields: [
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
                      admin: { width: "60%", description: "Banner headline before the italic word." },
                    },
                    { name: "titleEm", type: "text", admin: { width: "40%", description: "Italic word." } },
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
      admin: { position: "sidebar", description: "Lucide icon for the card, e.g. Landmark, Stethoscope." },
    },
    {
      name: "order",
      type: "number",
      defaultValue: 0,
      admin: { position: "sidebar", description: "Lower shows first." },
    },
    slugField(),
  ],
};
