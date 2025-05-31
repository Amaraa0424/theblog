import { builder } from '../../lib/builder';

builder.prismaObject("Category", {
  fields: (t) => ({
    id: t.exposeID("id"),
    name: t.exposeString("name"),
    description: t.exposeString("description", { nullable: true }),
    posts: t.relation("posts"),
    createdAt: t.expose("createdAt", { type: "Date" }),
    updatedAt: t.expose("updatedAt", { type: "Date" }),
  }),
}); 