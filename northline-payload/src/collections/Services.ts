import type { CollectionConfig } from "payload";
import { anyone } from "../access/anyone";
import { authenticated } from "../access/authenticated";
import { subpageFields } from "../fields/subpageFields";

export const Services: CollectionConfig = {
  slug: "services",
  labels: { singular: "Service", plural: "Services" },
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "icon", "order", "updatedAt"],
    group: "Catalog",
    description: "Service offerings shown on the services grid and detail pages.",
    listSearchableFields: ["title", "summary", "slug"],
  },
  access: { read: anyone, create: authenticated, update: authenticated, delete: authenticated },
  defaultSort: "order",
  fields: subpageFields("Code2, Palette, Smartphone"),
};
