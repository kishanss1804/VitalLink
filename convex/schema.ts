import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

const applicationTables = {
  userProfiles: defineTable({
    userId: v.id("users"),
    role: v.union(v.literal("donor"), v.literal("receiver")),
    name: v.string(),
    address: v.optional(v.string()),
    latitude: v.optional(v.number()),
    longitude: v.optional(v.number()),
  }).index("by_user", ["userId"]),

  donations: defineTable({
    donorId: v.id("users"),
    foodType: v.string(),
    quantity: v.string(),
    expirationTime: v.optional(v.number()),
    notes: v.optional(v.string()),
    address: v.string(),
    latitude: v.number(),
    longitude: v.number(),
    status: v.union(v.literal("active"), v.literal("claimed"), v.literal("expired")),
  })
    .index("by_donor", ["donorId"])
    .index("by_status", ["status"]),

  claims: defineTable({
    donationId: v.id("donations"),
    receiverId: v.id("users"),
    status: v.union(v.literal("pending"), v.literal("accepted"), v.literal("rejected")),
  }).index("by_donation", ["donationId"]),
};

export default defineSchema({
  ...authTables,
  ...applicationTables,
});
