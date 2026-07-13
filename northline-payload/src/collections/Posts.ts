import type { CollectionConfig } from "payload";
import { anyone } from "../access/anyone";
import { authenticated } from "../access/authenticated";
import { authenticatedOrPublished } from "../access/authenticatedOrPublished";
import { slugField } from "../fields/slug";

export const Posts: CollectionConfig = {
  slug: "posts",
  labels: { singular: "Post", plural: "Posts" },
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "authors", "publishedAt", "_status"],
    group: "Blog",
    description: "Blog articles and editorial posts.",
    listSearchableFields: ["title", "excerpt", "slug"],
  },
  access: {
    read: authenticatedOrPublished,
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  versions: {
    drafts: { autosave: { interval: 300 } },
    maxPerDoc: 25,
  },
  fields: [
    { name: "title", type: "text", required: true },
    {
      type: "tabs",
      tabs: [
        {
          label: "Content",
          fields: [
            {
              name: "excerpt",
              type: "textarea",
              admin: { description: "Short summary shown on cards, listings, and previews." },
            },
            {
              name: "heroImage",
              type: "upload",
              relationTo: "media",
              admin: { description: "Header image for the article." },
            },
            { name: "content", type: "richText" },
          ],
        },
        {
          label: "Taxonomy",
          fields: [
            {
              name: "categories",
              type: "relationship",
              relationTo: "categories",
              hasMany: true,
              admin: { description: "Primary groupings for this post." },
            },
            {
              name: "tags",
              type: "relationship",
              relationTo: "tags",
              hasMany: true,
              admin: { description: "Free-form keywords for filtering and related posts." },
            },
          ],
        },
      ],
    },
    {
      name: "authors",
      type: "relationship",
      relationTo: "users",
      hasMany: true,
      admin: { position: "sidebar", description: "One or more bylines." },
    },
    {
      name: "publishedAt",
      type: "date",
      admin: {
        position: "sidebar",
        date: { pickerAppearance: "dayAndTime" },
        description: "Set automatically on first publish; override to backdate.",
      },
      hooks: {
        beforeChange: [
          ({ siblingData, value }) => {
            if (siblingData._status === "published" && !value) return new Date();
            return value;
          },
        ],
      },
    },
    slugField(),
  ],
};
