import type { CollectionConfig } from "payload";
import { anyone } from "../access/anyone";
import { authenticated } from "../access/authenticated";
import { slugField } from "../fields/slug";

export const Services: CollectionConfig = {
  slug: "services",
  labels: { singular: "Service", plural: "Services" },
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "icon", "order", "updatedAt"],
    group: "Catalog",
    description: "Service offerings shown on the services grid and detail pages.",
    listSearchableFields: ["title", "summary", "slug"],
  },
  access: { read: anyone, create: authenticated, update: authenticated, delete: authenticated },
  defaultSort: "order",
  fields: [
    {
      type: "row",
      fields: [
        { name: "title", type: "text", required: true, admin: { width: "70%" } },
        {
          name: "icon",
          type: "text",
          admin: {
            width: "30%",
            description: "Lucide icon name, e.g. Code2, Palette, Smartphone.",
          },
        },
      ],
    },
    {
      name: "summary",
      type: "textarea",
      admin: { description: "One or two sentences shown on the service card." },
    },
    {
      name: "features",
      type: "array",
      admin: { description: "Bullet points listed on the service detail page." },
      fields: [{ name: "label", type: "text", required: true }],
    },
    { name: "body", type: "richText" },
    {
      name: "image",
      type: "upload",
      relationTo: "media",
      admin: { description: "Illustration for the service detail page." },
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
