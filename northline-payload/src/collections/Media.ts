import type { CollectionConfig } from "payload";
import { anyone } from "../access/anyone";
import { authenticated } from "../access/authenticated";

export const Media: CollectionConfig = {
  slug: "media",
  labels: { singular: "Media Item", plural: "Media Library" },
  admin: {
    description:
      "Images and PDFs used across the site. Add alt text so screen readers and search engines can describe each file.",
    defaultColumns: ["filename", "alt", "caption", "updatedAt"],
    listSearchableFields: ["filename", "alt", "caption"],
    group: "Settings",
  },
  access: {
    read: anyone,
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  fields: [
    {
      name: "alt",
      type: "text",
      admin: {
        description:
          "Describes the image for screen readers and SEO. Leave blank only for purely decorative images.",
      },
    },
    {
      name: "caption",
      type: "text",
      admin: {
        description: "Optional visible caption shown beneath the image where the layout supports it.",
      },
    },
  ],
  upload: {
    mimeTypes: ["image/*", "application/pdf"],
  },
};
