import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const create = mutation({
  args: {
    foodType: v.string(),
    quantity: v.string(),
    expirationTime: v.optional(v.number()),
    notes: v.optional(v.string()),
    address: v.string(),
    latitude: v.number(),
    longitude: v.number(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    return await ctx.db.insert("donations", {
      donorId: userId,
      status: "active",
      ...args,
    });
  },
});

export const listActive = query({
  handler: async (ctx) => {
    return await ctx.db
      .query("donations")
      .withIndex("by_status", (q) => q.eq("status", "active"))
      .collect();
  },
});

export const claim = mutation({
  args: {
    donationId: v.id("donations"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    await ctx.db.patch(args.donationId, {
      status: "claimed",
    });

    return await ctx.db.insert("claims", {
      donationId: args.donationId,
      receiverId: userId,
      status: "pending",
    });
  },
});
