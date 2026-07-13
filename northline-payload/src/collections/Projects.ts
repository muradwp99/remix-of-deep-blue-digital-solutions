import type { CollectionConfig } from "payload";
import { authenticated } from "../access/authenticated";
import { authenticatedOrPublished } from "../access/authenticatedOrPublished";
import { slugField } from "../fields/slug";

export const Projects: CollectionConfig = {
  slug: "projects",
  labels: { singular: "Project", plural: "Works / Projects" },
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "client", "industry", "featured", "_status"],
    group: "Catalog",
    description: "Case studies and portfolio work shown on the Works grid and detail pages.",
    listSearchableFields: ["title", "client", "summary", "slug"],
  },
  access: {
    read: authenticatedOrPublished,
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  versions: { drafts: true },
  fields: [
    { name: "title", type: "text", required: true },
    {
      type: "tabs",
      tabs: [
        {
          label: "Overview",
          fields: [
            {
              type: "row",
              fields: [
                { name: "client", type: "text", admin: { width: "50%" } },
                {
                  name: "industry",
                  type: "select",
                  admin: { width: "50%" },
                  options: ["SaaS", "Fintech", "Healthcare", "Ecommerce", "Media", "DevTools", "Other"],
                },
              ],
            },
            {
              name: "summary",
              type: "textarea",
              admin: { description: "Short teaser shown on the Works grid." },
            },
            {
              name: "tag",
              type: "text",
              admin: { description: 'Short project tag, e.g. "Headless replatform".' },
            },
          ],
        },
        {
          label: "Media",
          fields: [
            {
              name: "coverImage",
              type: "upload",
              relationTo: "media",
              admin: { description: "Main image for cards and the case-study header." },
            },
            {
              name: "gallery",
              type: "array",
              admin: { description: "Additional images shown on the case-study page." },
              fields: [{ name: "image", type: "upload", relationTo: "media", required: true }],
            },
          ],
        },
        {
          label: "Case Study",
          fields: [
            {
              name: "challenge",
              type: "textarea",
              admin: { description: "Where the numbers stood before the project (the case-study 'challenge')." },
            },
            {
              name: "approach",
              type: "array",
              admin: { description: "The steps taken, in order (the case-study 'approach')." },
              fields: [
                { name: "phase", type: "text", required: true },
                { name: "detail", type: "textarea", required: true },
              ],
            },
            { name: "body", type: "richText", admin: { description: "Optional long-form narrative." } },
            {
              name: "results",
              type: "array",
              admin: { description: "Headline metrics shown on the card and case study." },
              fields: [
                { name: "value", type: "text", required: true },
                { name: "label", type: "text", required: true },
                {
                  name: "direction",
                  type: "select",
                  defaultValue: "up",
                  admin: { description: "Arrow direction for the metric." },
                  options: ["up", "down"],
                },
              ],
            },
            {
              type: "row",
              fields: [
                {
                  name: "services",
                  type: "text",
                  hasMany: true,
                  admin: { width: "50%", description: "Services delivered, e.g. Design, Engineering." },
                },
                {
                  name: "stack",
                  type: "text",
                  hasMany: true,
                  admin: { width: "50%", description: "Tech stack, e.g. React, Node, Postgres." },
                },
              ],
            },
            {
              name: "testimonial",
              type: "group",
              admin: { description: "Optional client quote shown on the case study." },
              fields: [
                { name: "quote", type: "textarea" },
                { name: "author", type: "text" },
                { name: "role", type: "text" },
              ],
            },
          ],
        },
      ],
    },
    {
      name: "year",
      type: "text",
      admin: { position: "sidebar", description: "Year the project shipped, e.g. 2024." },
    },
    {
      name: "featured",
      type: "checkbox",
      admin: { position: "sidebar", description: "Show in featured spots." },
    },
    slugField(),
  ],
};
