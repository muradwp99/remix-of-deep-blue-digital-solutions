import type { GlobalConfig } from "payload";
import { anyone } from "../access/anyone";
import { authenticated } from "../access/authenticated";

export const Footer: GlobalConfig = {
  slug: "footer",
  label: "Footer",
  admin: {
    group: "Settings",
    description: "Footer intro text, link columns, and the legal / copyright row.",
  },
  access: { read: anyone, update: authenticated },
  fields: [
    {
      type: "collapsible",
      label: "Intro",
      fields: [
        {
          name: "blurb",
          type: "textarea",
          admin: { description: "Short paragraph shown beside the footer link columns." },
        },
      ],
    },
    {
      type: "collapsible",
      label: "Link columns",
      admin: {
        description: "Grouped footer navigation. Each column has a heading and a list of links.",
      },
      fields: [
        {
          name: "columns",
          type: "array",
          label: "Link columns",
          fields: [
            { name: "title", type: "text", required: true },
            {
              name: "links",
              type: "array",
              fields: [
                {
                  type: "row",
                  fields: [
                    { name: "label", type: "text", required: true, admin: { width: "50%" } },
                    { name: "href", type: "text", required: true, admin: { width: "50%" } },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
    {
      type: "collapsible",
      label: "Legal",
      fields: [
        { name: "copyright", type: "text", defaultValue: "© Northline Studio. All rights reserved." },
        {
          name: "legal",
          type: "array",
          label: "Legal links",
          admin: { description: "Small-print links such as Privacy Policy and Terms." },
          fields: [
            {
              type: "row",
              fields: [
                { name: "label", type: "text", required: true, admin: { width: "50%" } },
                { name: "href", type: "text", required: true, admin: { width: "50%" } },
              ],
            },
          ],
        },
      ],
    },
  ],
};
