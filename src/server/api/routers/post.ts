import z from "zod";
import { clerkClient } from "@clerk/nextjs/server";
import { TRPCError } from "@trpc/server";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

import {
  createTRPCRouter,
  privateProcedure,
  publicProcedure,
} from "~/server/api/trpc";

const rateLimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(5, "1 m"),
  analytics: true,
});

export const postRouter = createTRPCRouter({
  create: privateProcedure
    .input(
      z.object({
        content: z.string().min(1).max(280),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const authorId = ctx.session.userId;
      const { success } = await rateLimit.limit(authorId);

      if (!success) {
        throw new TRPCError({
          code: "TOO_MANY_REQUESTS",
        });
      }

      await ctx.db.post.create({
        data: {
          authorId,
          content: input.content,
        },
      });
    }),
  getAll: publicProcedure.query(async ({ ctx }) => {
    const posts = await ctx.db.post.findMany({
      take: 100,
      orderBy: {
        createdAt: "desc",
      },
    });

    const client = await clerkClient();

    const users = await client.users.getUserList({
      userId: posts.map((post) => post.authorId),
      limit: 100,
    });

    return posts.map((post) => {
      const user = users.data.find((user) => user.id === post.authorId);

      if (!user) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Author for post not found",
        });
      }

      return {
        post,
        author: {
          id: user.id,
          username: user.username,
          fullName: user.fullName,
          imageUrl: user.imageUrl,
        },
      };
    });
  }),
});
