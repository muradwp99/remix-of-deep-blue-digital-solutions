import type { CollectionConfig } from "payload";
import { anyone } from "../access/anyone";
import { authenticated } from "../access/authenticated";
import { slugField } from "../fields/slug";

export const Learning: CollectionConfig = {
  slug: "learning",
  labels: { singular: "Learning Item", plural: "Learning" },
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "type", "order", "updatedAt"],
    group: "Content",
    description: "Guides, tutorials, webinars and templates shown in the Learning hub.",
    listSearchableFields: ["title", "summary", "slug"],
  },
  access: { read: anyone, create: authenticated, update: authenticated, delete: authenticated },
  defaultSort: "order",
  fields: [
    { name: "title", type: "text", required: true },
    {
      name: "type",
      type: "select",
      defaultValue: "guide",
      options: [
        { label: "Guide", value: "guide" },
        { label: "Tutorial", value: "tutorial" },
        { label: "Webinar", value: "webinar" },
        { label: "Template", value: "template" },
      ],
      admin: { position: "sidebar", description: "Which Learning section this belongs to." },
    },
    { name: "summary", type: "textarea", admin: { description: "One or two sentences shown on the card." } },
    { name: "body", type: "richText" },
    { name: "image", type: "upload", relationTo: "media", admin: { description: "Cover image for the learning item." } },
    { name: "order", type: "number", defaultValue: 0, admin: { position: "sidebar", description: "Lower shows first." } },
    slugField(),
  ],
};
