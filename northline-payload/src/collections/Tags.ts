import type { CollectionConfig } from "payload";
import { anyone } from "../access/anyone";
import { authenticated } from "../access/authenticated";
import { slugField } from "../fields/slug";

export const Tags: CollectionConfig = {
  slug: "tags",
  labels: { singular: "Tag", plural: "Tags" },
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "slug"],
    listSearchableFields: ["title", "slug"],
    description: "Freeform keywords used to filter and group blog posts.",
    group: "Blog",
  },
  access: { read: anyone, create: authenticated, update: authenticated, delete: authenticated },
  fields: [{ name: "title", type: "text", required: true }, slugField()],
};
