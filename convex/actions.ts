import { action, internalAction } from "./_generated/server";
import { v } from "convex/values";
import { api } from "./_generated/api";
import { z } from "zod/v3";
import { storyAgent } from "./agents/storyAgent";
import { internal } from "./_generated/api";
import { getAuthUserId } from "@convex-dev/auth/server";
import { __vfTrack, __vfTrackSync } from "./_vibeflowTracking";

export const processRequest_storyAgent = internalAction({
  args: { input: v.any() },
  handler: async (ctx, args) => {
    // Convert input to string if needed
    const inputString = typeof args?.input === 'string' ? args.input : args?.input?.text || JSON.stringify(args?.input);
    
    let content = [{ type: "text", text: inputString }]
    
    if (typeof args?.input !== 'string' && args?.input?.image) {
      content.push({ type: "image", image: args.input.image });
    }
    
    // Call AI agent
    const { thread } = await storyAgent.createThread(ctx);
    
    
    const result = await thread.generateText({ 
      messages: [{ role: "user", content }],
      
    });
    const aiResponse = result.text.trim();
    
    const response = {
      content: aiResponse
    }
    
    return response;
  },
});

/**
 * Required Environment Variables:
 * - API_ELEVENLABS_KEY: Set this in your Convex deployment
 */
/**
 * HTTP Request: POST
 * Generated from HTTP Request node: node_1771990793802_e8br5jg
 */
export const getApi_node_1771990793802_e8br5jg = action({
  args: {
    // Arguments expected by this HTTP request
    text: v.optional(v.any()),
    voiceSettings: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    const method = 'POST';
    const url = 'https://integration.vibeflow.ai/api/actions/elevenlabs/text-to-speech';
    
    // Build headers
    const headers: Record<string, string> = {
          'Content-Type': 'application/json',
    };
        // Add Bearer token authentication from environment
        const apiKey = process.env.API_ELEVENLABS_KEY;
        if (!apiKey) {
          throw new Error('API_ELEVENLABS_KEY environment variable is required');
        }
        headers.Authorization = `Bearer ${apiKey}`;
    
        // Build body (fields mode)
        const bodyObj: Record<string, any> = {
        "voiceId": "21m00Tcm4TlvDq8ikWAM",
        "modelId": "eleven_multilingual_v2",
        "outputFormat": "mp3_44100_128"
    };
        bodyObj['text'] = args.text ?? '';
        bodyObj['voiceSettings'] = args.voiceSettings;
    // Build body
    const body = bodyObj;
    
    try {
      console.log(`🌐 Making ${method} request to ${url}`);
    
      const response = await fetch(url, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
      });
    
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
    
      const contentType = response.headers.get('content-type');
      let result;
    
      if (contentType?.includes('application/json')) {
        result = await response.json();
      } else if (contentType?.includes('audio/') || contentType?.includes('image/') || contentType?.includes('video/') || contentType?.includes('application/pdf') || contentType?.includes('application/octet-stream')) {
        const arrayBuffer = await response.arrayBuffer();
        const uint8Array = new Uint8Array(arrayBuffer);
        let binaryString = '';
        for (let i = 0; i < uint8Array.length; i++) {
          binaryString += String.fromCharCode(uint8Array[i]);
        }
        const base64 = btoa(binaryString);
        result = base64;
      } else {
        result = await response.text();
      }
    
      // Extract specific path if specified
      return result;
    } catch (error) {
      console.error(`❌ HTTP request failed:`, error);
      throw error;
    }
  },
});

export const processFlow_node_1771990793802_4t1vocr = action({
  args: {
    input: v.optional(v.any()),
  },
  handler: async (ctx, args) => {

  function getFieldOrStringify(obj: any, fieldName: string): any {
  try {
    if (typeof obj !== 'object' || obj === null) {
      return obj;
    }

    if (fieldName in obj) {
      return obj[fieldName];
    }

    return JSON.stringify(obj);
  } catch (error) {
    console.error('Error in getFieldOrStringify:', error);
    return undefined;
  }
}

  // Initialize tracking data storage
  const __vibeflowTracking: Record<string, { input?: any; output?: any }> = {};

  try {
    
    __vfTrackSync(__vibeflowTracking, 'node_1771990793802_4t1vocr', 'Story Request', args.input, args.input);
    const agentResult_node_1771990793802_lxzxs97 = await __vfTrack(__vibeflowTracking, 'node_1771990793802_lxzxs97', 'Story Agent', args.input, async () => {
      
    return  await ctx.runAction(internal.actions.processRequest_storyAgent, {
    input: `Write an original children's story with the following parameters:

Age: ${args.input?.age}
Language: ${args.input?.language}. Write the entire story in this language.
Setting: ${args.input?.world}
Topic to teach: ${args.input?.theme}
Writing style: ${args.input?.storytellerStyle}
Main character: ${args.input?.childName !== "" ? args.input?.childName : "our little hero"}

Story length and complexity by age:
- 0 to 3 years: 100 to 150 words. One idea only. Extremely simple vocabulary. Short, repetitive sentences. Rich sensory detail. No subplot. The world is safe and full of wonder.
- 3 to 6 years: 250 to 350 words. Simple vocabulary with one or two new words introduced naturally in context. Clear beginning, middle, and end. One small problem that gets resolved warmly. The hero tries, stumbles, and succeeds.
- 6 to 9 years: 450 to 550 words. Richer vocabulary. Varied sentence length. A real challenge the hero must face. A meaningful choice is made. Emotions are named and explored honestly.
- 9 to 12 years: 650 to 750 words. Confident vocabulary including words specific to the topic being taught. Multiple characters with distinct voices. A genuine dilemma with real consequences. The lesson about the selected theme must emerge entirely from what happens in the story. Never state it directly. Never summarize it at the end.

Return only the story text. No titles, no labels, no preamble.`
    });
    });
    const mutationResult_node_1771990793802_xf5b51k = await __vfTrack(__vibeflowTracking, 'node_1771990793802_xf5b51k', 'Save Story', agentResult_node_1771990793802_lxzxs97, async () => {
      
    return  await ctx.runMutation(internal.stories.saveStory, {
      theme: args.input?.theme,
      world: args.input?.world,
      age: args.input?.age,
      language: args.input?.language,
      childName: args.input?.childName,
      storytellerStyle: args.input?.storytellerStyle,
      authorCredit: args.input?.authorCredit,
      storyText: getFieldOrStringify(agentResult_node_1771990793802_lxzxs97, "content"),
    });
    });
    const returnValue_node_1771990793802_7rsr8tt = await __vfTrack(__vibeflowTracking, 'node_1771990793802_7rsr8tt', 'Return Story', mutationResult_node_1771990793802_xf5b51k, async () => {
      
    return  mutationResult_node_1771990793802_xf5b51k;

    });

    const __finalResult = returnValue_node_1771990793802_7rsr8tt;
    return { __result: __finalResult, __vibeflowTracking };
  } catch (error) {
    // Always return tracking data even on error, so we can see what happened up to the failure point
    return {
      __result: undefined,
      __vibeflowTracking,
      __error: error instanceof Error ? error.message : String(error)
    };
  }
  },
});

export const processFlow_node_1771990793802_1d2zb6v = action({
  args: {
    input: v.optional(v.any()),
  },
  handler: async (ctx, args) => {

  function getFieldOrStringify(obj: any, fieldName: string): any {
  try {
    if (typeof obj !== 'object' || obj === null) {
      return obj;
    }

    if (fieldName in obj) {
      return obj[fieldName];
    }

    return JSON.stringify(obj);
  } catch (error) {
    console.error('Error in getFieldOrStringify:', error);
    return undefined;
  }
}

  // Initialize tracking data storage
  const __vibeflowTracking: Record<string, { input?: any; output?: any }> = {};

  try {
    
    __vfTrackSync(__vibeflowTracking, 'node_1771990793802_1d2zb6v', 'Narration Request', args.input, args.input);
    const httpResult_node_1771990793802_e8br5jg = await __vfTrack(__vibeflowTracking, 'node_1771990793802_e8br5jg', 'Generate Audio', args.input, async () => {
      
    // Call HTTP request: getApi_node_1771990793802_e8br5jg (from node: node_1771990793802_e8br5jg)
    return  await ctx.runAction(api.actions.getApi_node_1771990793802_e8br5jg, {
      text: args.input?.storyText,
      voiceSettings: { "stability": 0.75, "similarity_boost": 0.75, "style": 0.3, "use_speaker_boost": true },
    });
    });
    const returnValue_node_1771990793802_p608ic3 = await __vfTrack(__vibeflowTracking, 'node_1771990793802_p608ic3', 'Return Audio', httpResult_node_1771990793802_e8br5jg, async () => {
      
    return  httpResult_node_1771990793802_e8br5jg;

    });

    const __finalResult = returnValue_node_1771990793802_p608ic3;
    return { __result: __finalResult, __vibeflowTracking };
  } catch (error) {
    // Always return tracking data even on error, so we can see what happened up to the failure point
    return {
      __result: undefined,
      __vibeflowTracking,
      __error: error instanceof Error ? error.message : String(error)
    };
  }
  },
});

export const processFlow_node_1772029303592_jnt2rbz = action({
  args: {
    input: v.optional(v.any()),
  },
  handler: async (ctx, args) => {

  function getFieldOrStringify(obj: any, fieldName: string): any {
  try {
    if (typeof obj !== 'object' || obj === null) {
      return obj;
    }

    if (fieldName in obj) {
      return obj[fieldName];
    }

    return JSON.stringify(obj);
  } catch (error) {
    console.error('Error in getFieldOrStringify:', error);
    return undefined;
  }
}

  // Initialize tracking data storage
  const __vibeflowTracking: Record<string, { input?: any; output?: any }> = {};

  try {
    
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    __vfTrackSync(__vibeflowTracking, 'node_1772029303592_jnt2rbz', 'Save Story Request', args.input, args.input);
    const mutationResult_node_1772029303592_yjk49oj = await __vfTrack(__vibeflowTracking, 'node_1772029303592_yjk49oj', 'Save Story For User', args.input, async () => {
      
    return  await ctx.runMutation(internal.savedStories.saveStoryForUser, {
      userId: userId,
      storyId: args.input?.storyId,
      theme: args.input?.theme,
      world: args.input?.world,
      age: args.input?.age,
      language: args.input?.language,
      storytellerStyle: args.input?.storytellerStyle,
      authorCredit: args.input?.authorCredit,
      storyText: args.input?.storyText,
    });
    });
    const returnValue_node_1772029303592_vtqhvke = await __vfTrack(__vibeflowTracking, 'node_1772029303592_vtqhvke', 'Return Save Result', mutationResult_node_1772029303592_yjk49oj, async () => {
      
    return  mutationResult_node_1772029303592_yjk49oj;

    });

    const __finalResult = returnValue_node_1772029303592_vtqhvke;
    return { __result: __finalResult, __vibeflowTracking };
  } catch (error) {
    // Always return tracking data even on error, so we can see what happened up to the failure point
    return {
      __result: undefined,
      __vibeflowTracking,
      __error: error instanceof Error ? error.message : String(error)
    };
  }
  },
});