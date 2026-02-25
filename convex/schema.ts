import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

export default defineSchema({
  ...authTables,
  // Keep existing tables and add:
  stories: defineTable({
       theme: v.string(),
       world: v.string(),
       age: v.string(),
       language: v.string(),
       childName: v.optional(v.string()),
       storytellerStyle: v.string(),
       authorCredit: v.string(),
       storyText: v.string(),
  }),
  savedStories: defineTable({
       userId: v.string(),
       storyId: v.optional(v.string()),
       theme: v.string(),
       world: v.string(),
       age: v.string(),
       language: v.string(),
       storytellerStyle: v.string(),
       authorCredit: v.string(),
       storyText: v.string(),
  }),
});