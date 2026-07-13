import type { CollectionConfig } from "payload";
import { anyone } from "../access/anyone";
import { authenticated } from "../access/authenticated";
import { slugField } from "../fields/slug";

export const Resources: CollectionConfig = {
  slug: "resources",
  labels: { singular: "Resource", plural: "Resources" },
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "type", "updatedAt"],
    listSearchableFields: ["title", "summary"],
    description: "Guides, tools, and downloads for the Resources library.",
    group: "Content",
  },
  access: { read: anyone, create: authenticated, update: authenticated, delete: authenticated },
  fields: [
    { name: "title", type: "text", required: true },
    {
      name: "summary",
      type: "textarea",
      admin: { description: "One or two sentences describing the resource." },
    },
    {
      type: "collapsible",
      label: "Files & Links",
      admin: { description: "Where the resource lives and how it previews on cards." },
      fields: [
        { name: "url", type: "text", admin: { description: "External link, if any." } },
        { name: "file", type: "upload", relationTo: "media", admin: { description: "Downloadable asset, if any." } },
        { name: "thumbnail", type: "upload", relationTo: "media", admin: { description: "Preview image shown on cards." } },
      ],
    },
    {
      name: "type",
      type: "select",
      defaultValue: "guide",
      admin: { position: "sidebar", description: "What kind of resource this is." },
      options: ["tool", "guide", "tutorial", "webinar", "template"],
    },
    slugField(),
  ],
};
