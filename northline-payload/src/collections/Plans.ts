import type { CollectionConfig } from "payload";
import { anyone } from "../access/anyone";
import { authenticated } from "../access/authenticated";

export const Plans: CollectionConfig = {
  slug: "plans",
  labels: { singular: "Pricing Plan", plural: "Pricing Plans" },
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "price", "featured", "order"],
    group: "Catalog",
    description: "Pricing tiers shown on the pricing page.",
    listSearchableFields: ["name", "description"],
  },
  access: { read: anyone, create: authenticated, update: authenticated, delete: authenticated },
  defaultSort: "order",
  fields: [
    { name: "name", type: "text", required: true },
    {
      type: "row",
      fields: [
        {
          name: "price",
          type: "text",
          required: true,
          admin: { width: "50%", description: "e.g. $49 or Custom." },
        },
        {
          name: "period",
          type: "text",
          admin: { width: "50%", description: "e.g. /month. Leave blank for one-off pricing." },
        },
      ],
    },
    {
      name: "description",
      type: "textarea",
      admin: { description: "One-line pitch shown under the plan name." },
    },
    {
      name: "features",
      type: "array",
      admin: { description: "Each item becomes a checkmark line on the pricing card." },
      fields: [{ name: "label", type: "text", required: true }],
    },
    {
      type: "row",
      fields: [
        {
          name: "ctaLabel",
          type: "text",
          defaultValue: "Get started",
          admin: { width: "50%", description: "Button text." },
        },
        {
          name: "ctaUrl",
          type: "text",
          defaultValue: "/contact",
          admin: { width: "50%", description: "Where the button links, e.g. /contact." },
        },
      ],
    },
    {
      name: "featured",
      type: "checkbox",
      admin: { position: "sidebar", description: "Highlight as the recommended plan." },
    },
    {
      name: "order",
      type: "number",
      defaultValue: 0,
      admin: { position: "sidebar", description: "Lower shows first." },
    },
  ],
};
