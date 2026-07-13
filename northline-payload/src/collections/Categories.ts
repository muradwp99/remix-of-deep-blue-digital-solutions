import type { CollectionConfig } from "payload";
import { anyone } from "../access/anyone";
import { authenticated } from "../access/authenticated";
import { slugField } from "../fields/slug";

export const Categories: CollectionConfig = {
  slug: "categories",
  labels: { singular: "Category", plural: "Categories" },
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "slug", "updatedAt"],
    listSearchableFields: ["title", "description"],
    description: "Blog categories used to group posts.",
    group: "Blog",
  },
  access: { read: anyone, create: authenticated, update: authenticated, delete: authenticated },
  fields: [
    { name: "title", type: "text", required: true, admin: { description: "Display name of the category." } },
    {
      name: "description",
      type: "textarea",
      admin: { description: "Optional context for editors; may not appear on the site." },
    },
    slugField(),
  ],
};
