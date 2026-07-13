import type { CollectionConfig } from "payload";
import { anyone } from "../access/anyone";
import { authenticated } from "../access/authenticated";
import { slugField } from "../fields/slug";

export const Team: CollectionConfig = {
  slug: "team",
  labels: { singular: "Team Member", plural: "Team / Leadership" },
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "role", "order", "updatedAt"],
    listSearchableFields: ["name", "role", "bio"],
    description: "People shown on the About and Leadership pages, sorted by the Order field.",
    group: "People",
  },
  access: { read: anyone, create: authenticated, update: authenticated, delete: authenticated },
  defaultSort: "order",
  fields: [
    {
      type: "row",
      fields: [
        { name: "name", type: "text", required: true, admin: { width: "50%" } },
        {
          name: "role",
          type: "text",
          required: true,
          admin: { width: "50%", description: "Job title shown beneath the name." },
        },
      ],
    },
    { name: "bio", type: "textarea", admin: { description: "Short bio for the profile card." } },
    { name: "photo", type: "upload", relationTo: "media", admin: { description: "Headshot or avatar image." } },
    {
      name: "socials",
      type: "group",
      admin: { description: "Full profile URLs. Leave a field blank to hide that icon." },
      fields: [
        { name: "linkedin", type: "text", admin: { placeholder: "https://linkedin.com/in/username" } },
        { name: "twitter", type: "text", admin: { placeholder: "https://x.com/username" } },
        { name: "github", type: "text", admin: { placeholder: "https://github.com/username" } },
      ],
    },
    {
      name: "order",
      type: "number",
      defaultValue: 0,
      admin: { position: "sidebar", description: "Lower numbers show first." },
    },
    slugField("name"),
  ],
};
