import type { CollectionConfig } from "payload";
import { anyone } from "../access/anyone";
import { authenticated } from "../access/authenticated";
import { slugField } from "../fields/slug";

export const Solutions: CollectionConfig = {
  slug: "solutions",
  labels: { singular: "Solution", plural: "Solutions" },
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "icon", "order", "updatedAt"],
    group: "Catalog",
    description: "Industry and use-case solutions shown on the solutions grid and detail pages.",
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
            description: "Lucide icon name, e.g. ShoppingCart, Layers, Building2.",
          },
        },
      ],
    },
    {
      name: "summary",
      type: "textarea",
      admin: { description: "One or two sentences shown on the solution card." },
    },
    { name: "body", type: "richText" },
    {
      name: "image",
      type: "upload",
      relationTo: "media",
      admin: { description: "Illustration for the solution detail page." },
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
