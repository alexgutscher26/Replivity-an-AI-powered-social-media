import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { randomUUID } from "crypto";

export const templatesRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1),
        description: z.string().optional(),
        hashtags: z.array(z.string()).min(1).max(30),
        category: z.string().optional(),
        platform: z.enum(["instagram", "twitter", "facebook", "linkedin", "all"]).default("all"),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      // Check if user has an active billing subscription
      const userSubscription = await ctx.db.userSubscription.findFirst({
        where: {
          userId,
          status: "active",
        },
      });

      if (!userSubscription) {
        throw new Error("Active subscription required to create templates");
      }

      // Check usage limits
      const currentUsage = await ctx.db.usage.findFirst({
        where: {
          userId,
          type: "template_creation",
        },
      });

      const usageLimit = userSubscription.plan === "pro" ? 100 : 20; // Example limits
      const currentCount = currentUsage?.count || 0;

      if (currentCount >= usageLimit) {
        throw new Error(`Template creation limit reached (${usageLimit})`);
      }

      // Create the template
      const template = await ctx.db.hashtagTemplate.create({
        data: {
          id: randomUUID(),
          name: input.name,
          description: input.description,
          hashtags: input.hashtags,
          category: input.category,
          platform: input.platform,
          userId,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });

      // Update usage count
      await ctx.db.usage.upsert({
        where: {
          userId_type: {
            userId,
            type: "template_creation",
          },
        },
        update: {
          count: currentCount + 1,
        },
        create: {
          userId,
          type: "template_creation",
          count: 1,
        },
      });

      return template;
    }),

  getAll: protectedProcedure
    .input(
      z.object({
        category: z.string().optional(),
        platform: z.enum(["instagram", "twitter", "facebook", "linkedin", "all"]).optional(),
        limit: z.number().min(1).max(100).default(20),
        offset: z.number().min(0).default(0),
      })
    )
    .query(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      const templates = await ctx.db.hashtagTemplate.findMany({
        where: {
          userId,
          ...(input.category && { category: input.category }),
          ...(input.platform && input.platform !== "all" && { platform: input.platform }),
        },
        orderBy: {
          createdAt: "desc",
        },
        take: input.limit,
        skip: input.offset,
      });

      const totalCount = await ctx.db.hashtagTemplate.count({
        where: {
          userId,
          ...(input.category && { category: input.category }),
          ...(input.platform && input.platform !== "all" && { platform: input.platform }),
        },
      });

      return {
        templates,
        totalCount,
        hasMore: input.offset + input.limit < totalCount,
      };
    }),

  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      const template = await ctx.db.hashtagTemplate.findFirst({
        where: {
          id: input.id,
          userId,
        },
      });

      if (!template) {
        throw new Error("Template not found");
      }

      return template;
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().min(1).optional(),
        description: z.string().optional(),
        hashtags: z.array(z.string()).min(1).max(30).optional(),
        category: z.string().optional(),
        platform: z.enum(["instagram", "twitter", "facebook", "linkedin", "all"]).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      const template = await ctx.db.hashtagTemplate.findFirst({
        where: {
          id: input.id,
          userId,
        },
      });

      if (!template) {
        throw new Error("Template not found");
      }

      const updatedTemplate = await ctx.db.hashtagTemplate.update({
        where: {
          id: input.id,
        },
        data: {
          ...(input.name && { name: input.name }),
          ...(input.description !== undefined && { description: input.description }),
          ...(input.hashtags && { hashtags: input.hashtags }),
          ...(input.category !== undefined && { category: input.category }),
          ...(input.platform && { platform: input.platform }),
          updatedAt: new Date(),
        },
      });

      return updatedTemplate;
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      const template = await ctx.db.hashtagTemplate.findFirst({
        where: {
          id: input.id,
          userId,
        },
      });

      if (!template) {
        throw new Error("Template not found");
      }

      await ctx.db.hashtagTemplate.delete({
        where: {
          id: input.id,
        },
      });

      return { success: true };
    }),

  duplicate: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      // Check if user has an active billing subscription
      const userSubscription = await ctx.db.userSubscription.findFirst({
        where: {
          userId,
          status: "active",
        },
      });

      if (!userSubscription) {
        throw new Error("Active subscription required to duplicate templates");
      }

      // Check usage limits
      const currentUsage = await ctx.db.usage.findFirst({
        where: {
          userId,
          type: "template_creation",
        },
      });

      const usageLimit = userSubscription.plan === "pro" ? 100 : 20;
      const currentCount = currentUsage?.count || 0;

      if (currentCount >= usageLimit) {
        throw new Error(`Template creation limit reached (${usageLimit})`);
      }

      const originalTemplate = await ctx.db.hashtagTemplate.findFirst({
        where: {
          id: input.id,
          userId,
        },
      });

      if (!originalTemplate) {
        throw new Error("Template not found");
      }

      const duplicatedTemplate = await ctx.db.hashtagTemplate.create({
        data: {
          id: randomUUID(),
          name: `${originalTemplate.name} (Copy)`,
          description: originalTemplate.description,
          hashtags: originalTemplate.hashtags,
          category: originalTemplate.category,
          platform: originalTemplate.platform,
          userId,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });

      // Update usage count
      await ctx.db.usage.upsert({
        where: {
          userId_type: {
            userId,
            type: "template_creation",
          },
        },
        update: {
          count: currentCount + 1,
        },
        create: {
          userId,
          type: "template_creation",
          count: 1,
        },
      });

      return duplicatedTemplate;
    }),

  getCategories: protectedProcedure
    .query(async ({ ctx }) => {
      const userId = ctx.session.user.id;

      const categories = await ctx.db.hashtagTemplate.findMany({
        where: {
          userId,
          category: {
            not: null,
          },
        },
        select: {
          category: true,
        },
        distinct: ["category"],
      });

      return categories.map(c => c.category).filter(Boolean);
    }),

  getUsageStats: protectedProcedure
    .query(async ({ ctx }) => {
      const userId = ctx.session.user.id;

      const userSubscription = await ctx.db.userSubscription.findFirst({
        where: {
          userId,
          status: "active",
        },
      });

      const currentUsage = await ctx.db.usage.findFirst({
        where: {
          userId,
          type: "template_creation",
        },
      });

      const usageLimit = userSubscription?.plan === "pro" ? 100 : 20;
      const currentCount = currentUsage?.count || 0;

      return {
        current: currentCount,
        limit: usageLimit,
        percentage: Math.round((currentCount / usageLimit) * 100),
        hasActiveSubscription: !!userSubscription,
      };
    }),
});
