import type { CollectionConfig } from "payload";
import { anyone } from "../access/anyone";
import { authenticated } from "../access/authenticated";
import { authenticatedOrPublished } from "../access/authenticatedOrPublished";
import { slugField } from "../fields/slug";
import { layoutBlocks } from "../blocks";

export const Pages: CollectionConfig = {
  slug: "pages",
  labels: { singular: "Page", plural: "Pages" },
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "slug", "_status", "updatedAt"],
    group: "Content",
    description: "Standalone marketing pages composed from reusable layout blocks.",
    listSearchableFields: ["title", "slug"],
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
    {
      name: "title",
      type: "text",
      required: true,
      admin: { description: "Page heading and browser/tab title." },
    },
    {
      name: "layout",
      type: "blocks",
      blocks: layoutBlocks,
      admin: { description: "Compose the page from content blocks. Drag to reorder." },
    },
    slugField(),
  ],
};
