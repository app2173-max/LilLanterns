import { internalMutation } from "./_generated/server";
import { v } from "convex/values";

export const saveStory = internalMutation({
  args: {
    theme: v.any(),
    world: v.any(),
    age: v.any(),
    language: v.any(),
    childName: v.optional(v.any()),
    storytellerStyle: v.any(),
    authorCredit: v.any(),
    storyText: v.any(),
  },
  handler: async (ctx, args) => {
    const id = await ctx.db.insert("stories", {
          theme: args.theme,
          world: args.world,
          age: args.age,
          language: args.language,
          childName: args.childName,
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