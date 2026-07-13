import type { CollectionConfig } from "payload";
import { anyone } from "../access/anyone";
import { authenticated } from "../access/authenticated";

export const Testimonials: CollectionConfig = {
  slug: "testimonials",
  labels: { singular: "Testimonial", plural: "Testimonials" },
  admin: {
    useAsTitle: "author",
    defaultColumns: ["author", "company", "rating", "featured"],
    listSearchableFields: ["author", "company", "quote"],
    description: "Client quotes shown across the site. Mark the strongest ones as Featured.",
    group: "People",
  },
  access: { read: anyone, create: authenticated, update: authenticated, delete: authenticated },
  fields: [
    {
      name: "quote",
      type: "textarea",
      required: true,
      admin: { description: "The testimonial text, shown in quotation marks on the site." },
    },
    {
      type: "row",
      fields: [
        {
          name: "author",
          type: "text",
          required: true,
          admin: { width: "50%", description: "Person being quoted." },
        },
        { name: "role", type: "text", admin: { width: "50%", description: "Their job title." } },
      ],
    },
    { name: "company", type: "text", admin: { description: "Company or organization." } },
    { name: "avatar", type: "upload", relationTo: "media", admin: { description: "Author photo or company logo." } },
    {
      name: "rating",
      type: "number",
      min: 1,
      max: 5,
      defaultValue: 5,
      admin: { position: "sidebar", description: "1-5 stars." },
    },
    {
      name: "featured",
      type: "checkbox",
      admin: { position: "sidebar", description: "Show in featured testimonial spots." },
    },
  ],
};
