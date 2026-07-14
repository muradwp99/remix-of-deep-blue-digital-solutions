import type { CollectionConfig } from "payload";
import { anyone } from "../access/anyone";
import { authenticated } from "../access/authenticated";
import { slugField } from "../fields/slug";

export const Tools: CollectionConfig = {
  slug: "tools",
  labels: { singular: "Tool", plural: "Tools" },
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "icon", "order", "updatedAt"],
    group: "Catalog",
    description: "Interactive free tools (audit, ROI calculator, speed test, brand grader).",
    listSearchableFields: ["title", "summary", "slug"],
  },
  access: { read: anyone, create: authenticated, update: authenticated, delete: authenticated },
  defaultSort: "order",
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
      admin: { description: "Display name / nav label, e.g. Website Audit Tool." },
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
              admin: { description: "Small label above the headline, e.g. 'Free Tool · Website Audit'." },
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
                    description: "Optional text after the italic word (include leading punctuation).",
                  },
                },
              ],
            },
            { name: "subtitle", type: "textarea", admin: { description: "Hero paragraph." } },
            {
              name: "summary",
              type: "textarea",
              admin: { description: "One-line description shown on the tool card." },
            },
            {
              name: "image",
              type: "upload",
              relationTo: "media",
              admin: { description: "Hero illustration (falls back to a stock image if empty)." },
            },
          ],
        },
        {
          label: "Checklist",
          fields: [
            {
              name: "checks",
              type: "text",
              hasMany: true,
              admin: {
                description: "Bullet points describing what the tool checks (leave empty for calculator-style tools).",
              },
            },
          ],
        },
      ],
    },
    {
      name: "icon",
      type: "text",
      admin: { position: "sidebar", description: "Lucide icon for the card, e.g. Gauge, Calculator, Search." },
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
