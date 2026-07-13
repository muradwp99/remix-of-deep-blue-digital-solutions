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
      type: "row",
      fields: [
        { name: "title", type: "text", required: true, admin: { width: "70%" } },
        {
          name: "icon",
          type: "text",
          admin: { width: "30%", description: "Lucide icon name, e.g. Gauge, Calculator, Search." },
        },
      ],
    },
    { name: "summary", type: "textarea", admin: { description: "One-line description shown on the tool card." } },
    { name: "body", type: "richText" },
    { name: "image", type: "upload", relationTo: "media", admin: { description: "Illustration for the tool page." } },
    { name: "order", type: "number", defaultValue: 0, admin: { position: "sidebar", description: "Lower shows first." } },
    slugField(),
  ],
};
