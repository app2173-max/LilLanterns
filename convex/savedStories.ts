import { internalMutation } from "./_generated/server";
import { v } from "convex/values";

export const saveStoryForUser = internalMutation({
  args: {
    userId: v.any(),
    storyId: v.optional(v.any()),
    theme: v.any(),
    world: v.any(),
    age: v.any(),
    language: v.any(),
    storytellerStyle: v.any(),
    authorCredit: v.any(),
    storyText: v.any(),
  },
  handler: async (ctx, args) => {
    const id = await ctx.db.insert("savedStories", {
          userId: args.userId,
          storyId: args.storyId,
          theme: args.theme,
          world: args.world,
          age: args.age,
          language: args.language,
          storytellerStyle: args.storytellerStyle,
          authorCredit: args.authorCredit,
          storyText: args.storyText,
        });
        return {
          ...args,
          id
    , _id: id    };
  },
});