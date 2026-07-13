import type { CollectionConfig } from "payload";
import { authenticated } from "../access/authenticated";

export const Users: CollectionConfig = {
  slug: "users",
  labels: { singular: "User", plural: "Users" },
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "email", "roles"],
    listSearchableFields: ["name", "email"],
    description: "Admin panel accounts. Admins manage everything; editors manage content only.",
    group: "Settings",
  },
  auth: true,
  access: {
    read: authenticated,
    create: authenticated,
    update: authenticated,
    delete: authenticated,
    admin: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    { name: "name", type: "text" },
    {
      name: "roles",
      type: "select",
      hasMany: true,
      defaultValue: ["editor"],
      saveToJWT: true,
      options: [
        { label: "Admin", value: "admin" },
        { label: "Editor", value: "editor" },
      ],
    },
  ],
};
