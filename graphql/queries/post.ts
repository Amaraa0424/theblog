import { builder } from "@/lib/builder";
import { prisma } from "@/lib/prisma";

builder.queryField("post", (t) =>
  t.prismaField({
    type: "Post",
    args: {
      id: t.arg.string({ required: true }),
    },
    resolve: async (query, _parent, args, _ctx, _info) => {
      const post = await prisma.post.findUniqueOrThrow({
        ...query,
        where: { id: args.id },
      });

      return post;
    },
  })
);

// Add viewCount to Post type
builder.prismaObject('Post', {
  fields: (t) => ({
    viewCount: t.field({
      type: 'Int',
      resolve: async (parent) => {
        const count = await prisma.view.count({
          where: { postId: parent.id },
        });
        return count;
      },
    }),
  }),
}); 