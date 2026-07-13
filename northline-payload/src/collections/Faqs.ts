import type { CollectionConfig } from "payload";
import { anyone } from "../access/anyone";
import { authenticated } from "../access/authenticated";

export const Faqs: CollectionConfig = {
  slug: "faqs",
  labels: { singular: "FAQ", plural: "FAQs" },
  admin: {
    useAsTitle: "question",
    defaultColumns: ["question", "category", "order", "updatedAt"],
    listSearchableFields: ["question"],
    description: "Questions and answers shown on the FAQ page, grouped by category.",
    group: "Content",
  },
  access: { read: anyone, create: authenticated, update: authenticated, delete: authenticated },
  defaultSort: "order",
  fields: [
    {
      name: "question",
      type: "text",
      required: true,
      admin: { description: "The question phrased the way a visitor would ask it." },
    },
    {
      name: "answer",
      type: "richText",
      required: true,
      admin: { description: "The answer. Supports links and formatting." },
    },
    {
      name: "category",
      type: "select",
      defaultValue: "general",
      admin: { position: "sidebar", description: "Groups the FAQ into a section on the site." },
      options: ["general", "pricing", "process", "support", "legal"],
    },
    {
      name: "order",
      type: "number",
      defaultValue: 0,
      admin: { position: "sidebar", description: "Lower numbers show first." },
    },
  ],
};
