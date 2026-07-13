import type { GlobalConfig } from "payload";
import { anyone } from "../access/anyone";
import { authenticated } from "../access/authenticated";

export const Header: GlobalConfig = {
  slug: "header",
  label: "Header / Navigation",
  admin: {
    group: "Settings",
    description: "The primary site navigation and the call-to-action button shown in the header.",
  },
  access: { read: anyone, update: authenticated },
  fields: [
    {
      type: "collapsible",
      label: "Navigation",
      fields: [
        {
          name: "nav",
          type: "array",
          label: "Navigation items",
          admin: { description: "Top-level menu. Add children to make a dropdown/mega menu." },
          fields: [
            {
              type: "row",
              fields: [
                { name: "label", type: "text", required: true, admin: { width: "50%" } },
                {
                  name: "href",
                  type: "text",
                  required: true,
                  admin: { width: "50%", description: "Path or URL, e.g. /services or https://…" },
                },
              ],
            },
            {
              name: "children",
              type: "array",
              label: "Dropdown links",
              admin: {
                description: "Leave empty for a plain link; add items to render a dropdown.",
              },
              fields: [
                {
                  type: "row",
                  fields: [
                    { name: "label", type: "text", required: true, admin: { width: "40%" } },
                    { name: "href", type: "text", required: true, admin: { width: "30%" } },
                    {
                      name: "description",
                      type: "text",
                      admin: { width: "30%", description: "Short helper text shown in a mega menu." },
                    },
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
      label: "Call to Action",
      admin: { description: "The button shown at the end of the header." },
      fields: [
        {
          name: "cta",
          type: "group",
          label: false,
          fields: [
            {
              type: "row",
              fields: [
                {
                  name: "label",
                  type: "text",
                  defaultValue: "Start a Project",
                  admin: { width: "50%" },
                },
                {
                  name: "href",
                  type: "text",
                  defaultValue: "/contact",
                  admin: { width: "50%", description: "Where the button links, e.g. /contact." },
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};
