import type { CollectionConfig } from "payload";
import { anyone } from "../access/anyone";
import { authenticated } from "../access/authenticated";
import { subpageFields } from "../fields/subpageFields";

export const Solutions: CollectionConfig = {
  slug: "solutions",
  labels: { singular: "Solution", plural: "Solutions" },
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "icon", "order", "updatedAt"],
    group: "Catalog",
    description: "Industry and use-case solutions shown on the solutions grid and detail pages.",
    listSearchableFields: ["title", "summary", "slug"],
  },
  access: { read: anyone, create: authenticated, update: authenticated, delete: authenticated },
  defaultSort: "order",
  fields: subpageFields("ShoppingCart, Layers, Building2"),
};
