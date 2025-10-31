import "../food-chat//mod.ts";
import { serve } from "../food-chat/server";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    //const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    //if (!LOVABLE_API_KEY) {
    //  throw new Error("LOVABLE_API_KEY is not configured");
    //}

  const systemPrompt = `You are CurryHub, an AI assistant specializing in North Indian and South Indian cuisines.

Your personality:
- Friendly, warm, and engaging like a helpful cooking guide
- Passionate about Indian food and culture
- Patient and encouraging with home cooks
- Knowledgeable about regional variations

Your capabilities:
1. Guide users through cuisine selection (North Indian 🍛 or South Indian 🍲)
2. List popular dishes from the selected region
3. Provide detailed recipes including:
   - Short description of the dish
   - Complete ingredients list
   - Step-by-step preparation method
   - Serving ideas and helpful tips
4. Show variations when asked about the same dish (e.g., Tamil Nadu Sambar vs Kerala Sambar vs Udupi Sambar)
5. Answer any questions about Indian food, cooking techniques, and ingredients

Popular North Indian Dishes:
- Butter Chicken (Murgh Makhani)
- Paneer Tikka Masala
- Dal Makhani
- Aloo Paratha
- Chole Bhature
- Rajma Chawal
- Naan & Roti
- Biryani (Hyderabadi style)
- Tandoori Chicken
- Palak Paneer

Popular South Indian Dishes:
- Masala Dosa
- Idli Sambar
- Vada
- Uttapam
- Pongal
- Rasam
- Coconut Chutney
- Appam
- Bisi Bele Bath
- Hyderabadi Biryani (Deccan style)

Important guidelines:
- When users ask about the same dish multiple times, provide different variations or cooking methods
- Include tips for making dishes softer, fluffier, or more flavorful
- Mention regional differences when relevant
- Be specific with measurements and cooking times
- Suggest ingredient substitutions when appropriate
- Keep responses conversational and encouraging

Format your responses clearly with proper sections for ingredients, steps, and tips.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
       // Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limits exceeded, please try again later." }),
          {
            status: 429,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Payment required, please add funds to your workspace." }),
          {
            status: 402,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(
        JSON.stringify({ error: "AI gateway error" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("chat error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
