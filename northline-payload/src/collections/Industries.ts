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
      type: "row",
      fields: [
        { name: "title", type: "text", required: true, admin: { width: "70%" } },
        {
          name: "icon",
          type: "text",
          admin: { width: "30%", description: "Lucide icon name, e.g. Landmark, Stethoscope, ShoppingBag." },
        },
      ],
    },
    { name: "summary", type: "textarea", admin: { description: "One or two sentences shown on the industry card." } },
    { name: "body", type: "richText" },
    { name: "image", type: "upload", relationTo: "media", admin: { description: "Illustration for the industry detail page." } },
    { name: "order", type: "number", defaultValue: 0, admin: { position: "sidebar", description: "Lower shows first." } },
    slugField(),
  ],
};
