import { clerkClient } from "@clerk/nextjs/server";
import type { Post } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import z from "zod";

import {
  createTRPCRouter,
  privateProcedure,
  publicProcedure,
} from "~/server/api/trpc";

const rateLimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(3, "1 m"),
  analytics: true,
});

const addAuthorToPosts = async (posts: Post[]) => {
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
      ...post,
      author: {
        id: user.id,
        username: user.username ?? "anonymous",
        fullName: user.fullName ?? "Anonymous",
        imageUrl: user.imageUrl,
      },
    };
  });
};

export const postRouter = createTRPCRouter({
  create: privateProcedure
    .input(
      z.object({
        content: z.string().min(1).max(280),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const authorId = ctx.userId;
      const { success } = await rateLimit.limit(authorId);

      if (!success) {
        throw new TRPCError({
          code: "TOO_MANY_REQUESTS",
          message: "To many create requests, try again later",
        });
      }

      await ctx.db.post.create({
        data: {
          authorId,
          content: input.content,
        },
      });
    }),
  getByAuthorId: publicProcedure
    .input(z.object({ authorId: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.post
        .findMany({
          where: {
            authorId: input.authorId,
          },
          take: 100,
          orderBy: {
            createdAt: "desc",
          },
        })
        .then(addAuthorToPosts);
    }),
  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const post = await ctx.db.post
        .findUnique({
          where: { id: input.id },
        })
        .then((post) => post && addAuthorToPosts([post]));

      if (!post)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Post for id not found",
        });

      return post.at(0);
    }),
  getAll: publicProcedure.query(async ({ ctx }) => {
    return ctx.db.post
      .findMany({
        take: 100,
        orderBy: {
          createdAt: "desc",
        },
      })
      .then(addAuthorToPosts);
  }),
});
