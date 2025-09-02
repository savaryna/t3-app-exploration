import { clerkClient } from "@clerk/nextjs/server";
import { TRPCError } from "@trpc/server";
import z from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const profileRouter = createTRPCRouter({
  getByUsername: publicProcedure
    .input(
      z.object({
        username: z.string(),
      }),
    )
    .query(async ({ input }) => {
      const client = await clerkClient();

      const users = await client.users.getUserList({
        username: [input.username],
      });

      const user = users.data.find((user) => user.username === input.username);

      if (!user || !user.username) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Profile for username not found",
        });
      }

      return {
        id: user.id,
        username: user.username,
        fullName: user.fullName,
        imageUrl: user.imageUrl,
      };
    }),
});
