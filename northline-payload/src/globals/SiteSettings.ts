import type { GlobalConfig } from "payload";
import { anyone } from "../access/anyone";
import { authenticated } from "../access/authenticated";

export const SiteSettings: GlobalConfig = {
  slug: "site-settings",
  label: "Site Settings",
  admin: {
    group: "Settings",
    description: "Global brand identity, contact details, and social links used across the site.",
  },
  access: { read: anyone, update: authenticated },
  fields: [
    {
      type: "tabs",
      tabs: [
        {
          label: "Brand",
          admin: { description: "Name, tagline, logo and favicon." },
          fields: [
            { name: "siteName", type: "text", defaultValue: "Northline" },
            {
              name: "tagline",
              type: "text",
              admin: { description: "Short phrase shown under the brand name." },
            },
            {
              name: "logo",
              type: "upload",
              relationTo: "media",
              admin: { description: "Primary logo. SVG or transparent PNG recommended." },
            },
            {
              name: "favicon",
              type: "upload",
              relationTo: "media",
              admin: { description: "Square browser-tab icon, 32×32 or larger." },
            },
          ],
        },
        {
          label: "Contact",
          fields: [
            {
              name: "email",
              type: "email",
              admin: { description: "Public contact address." },
            },
            { name: "phone", type: "text" },
            { name: "address", type: "textarea" },
          ],
        },
        {
          label: "Social",
          admin: { description: "Full profile URLs, including https://." },
          fields: [
            { name: "twitter", type: "text", admin: { description: "e.g. https://x.com/yourhandle" } },
            {
              name: "linkedin",
              type: "text",
              admin: { description: "e.g. https://linkedin.com/company/yourcompany" },
            },
            { name: "github", type: "text", admin: { description: "e.g. https://github.com/yourorg" } },
            {
              name: "instagram",
              type: "text",
              admin: { description: "e.g. https://instagram.com/yourhandle" },
            },
          ],
        },
      ],
    },
  ],
};
