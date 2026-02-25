import { Agent } from "@convex-dev/agent";
import { components } from "../_generated/api";
import { createOpenAI } from "@ai-sdk/openai";

export const storyAgent = new Agent(components.agent, {
  chat: createOpenAI({baseURL: "https://api.openai.com/v1"}).chat("gpt-4o"),
  instructions: `You are a master children's author. Write original children's stories that genuinely teach important life lessons through narrative. Never state the lesson directly. Never summarize at the end. Let the events of the story do all the teaching. Use concrete examples, cause and effect, and real consequences that make the topic tangible and memorable for a child. Return only the story text. No titles, no labels, no preamble.`,
});