import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { Id } from "./_generated/dataModel";

export const createProfile = mutation({
  args: {
    role: v.union(v.literal("donor"), v.literal("receiver")),
    name: v.string(),
    address: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    
    return await ctx.db.insert("userProfiles", {
      userId: userId as Id<"users">, // Ensure userId is of type Id<"users">
      role: args.role,
      name: args.name,
      address: args.address || "",
    });
  },
});

export const getProfile = query({
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;
    
    const profile = await ctx.db
      .query("userProfiles")
      .withIndex("by_user", (q) => q.eq("userId", userId as Id<"users">)) // Type assertion here
      .unique();
    
    return profile;
  },
});

export const updateRole = mutation({
  args: {
    role: v.union(v.literal("donor"), v.literal("receiver")),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }
    
    const existingProfile = await ctx.db
      .query("userProfiles")
      .withIndex("by_user", (q) => q.eq("userId", userId as Id<"users">)) // Type assertion here
      .unique();
    
    if (!existingProfile) {
      throw new Error("Profile not found");
    }
    
    await ctx.db.patch(existingProfile._id, {
      role: args.role,
    });
    
    return true;
  },
});

// Optional: Get user profile by ID
export const getProfileById = query({
  args: {
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const profile = await ctx.db
      .query("userProfiles")
      .withIndex("by_user", (q) => q.eq("userId", args.userId as Id<"users">)) // Type assertion here
      .unique();
    
    return profile ? {
      name: profile.name,
      role: profile.role,
    } : null;
  },
});

// Optional: Update user profile information
export const updateProfile = mutation({
  args: {
    name: v.optional(v.string()),
    address: v.optional(v.string()),
    phone: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }
    
    const existingProfile = await ctx.db
      .query("userProfiles")
      .withIndex("by_user", (q) => q.eq("userId", userId as Id<"users">)) // Type assertion here
      .unique();
    
    if (!existingProfile) {
      throw new Error("Profile not found");
    }
    
    const updates: any = {};
    if (args.name !== undefined) updates.name = args.name;
    if (args.address !== undefined) updates.address = args.address;
    if (args.phone !== undefined) updates.phone = args.phone;
    
    await ctx.db.patch(existingProfile._id, updates);
    
    return true;
  },
});
