import type { CollectionConfig } from "payload";
import { anyone } from "../access/anyone";
import { authenticated } from "../access/authenticated";
import { slugField } from "../fields/slug";

export const Jobs: CollectionConfig = {
  slug: "jobs",
  labels: { singular: "Job Opening", plural: "Careers / Jobs" },
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "department", "type", "location", "open"],
    listSearchableFields: ["title", "location"],
    description: "Open roles listed on the Careers page. Uncheck Open to hide a filled role.",
    group: "Careers",
  },
  access: { read: anyone, create: authenticated, update: authenticated, delete: authenticated },
  fields: [
    { name: "title", type: "text", required: true, admin: { description: "Role title, e.g. Senior Product Designer." } },
    {
      name: "description",
      type: "richText",
      admin: { description: "Responsibilities, requirements, and what the role offers." },
    },
    {
      type: "collapsible",
      label: "How to Apply",
      admin: { description: "Where candidates go to apply." },
      fields: [
        {
          name: "applyUrl",
          type: "text",
          admin: { description: "Application link or mailto address for this role." },
        },
      ],
    },
    {
      name: "department",
      type: "select",
      admin: { position: "sidebar", description: "Team this role sits in." },
      options: ["Engineering", "Design", "Product", "Growth", "Operations"],
    },
    {
      name: "type",
      type: "select",
      defaultValue: "full-time",
      admin: { position: "sidebar", description: "Employment type." },
      options: ["full-time", "part-time", "contract", "internship"],
    },
    {
      name: "location",
      type: "text",
      defaultValue: "Remote",
      admin: { position: "sidebar", description: "e.g. Remote, or a specific city." },
    },
    {
      name: "open",
      type: "checkbox",
      defaultValue: true,
      admin: { position: "sidebar", description: "Uncheck to hide a filled role." },
    },
    slugField(),
  ],
};
