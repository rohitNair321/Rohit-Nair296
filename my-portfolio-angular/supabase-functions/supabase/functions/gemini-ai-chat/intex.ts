// functions/chat/index.ts
import { serve } from "https://deno.land/std@0.203.0/http/server.ts";

const GEMINI_KEY = Deno.env.get("GEMINI_API_KEY")!;

serve(async (req) => {
  // Log incoming request metadata
  console.log("[Chat Function] Received request:", {
    method: req.method,
    url: req.url
  });

  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    console.log("[Chat Function] Handling CORS preflight");
    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",            // restrict to your domain in prod
        "Access-Control-Allow-Methods": "POST,OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type,Authorization"
      }
    });
  }

  // Only allow POST
  if (req.method !== "POST") {
    console.warn("[Chat Function] Method not allowed:", req.method);
    return new Response("Method Not Allowed", { status: 405 });
  }

  // Parse JSON payload
  let payload;
  try {
    payload = await req.json();
  } catch (err) {
    console.error("[Chat Function] Error parsing JSON:", err);
    return new Response(JSON.stringify({ error: "Invalid JSON" }), { status: 400 });
  }

  const text = payload.text;
  console.log("[Chat Function] User text:", text);

  if (!text) {
    console.warn("[Chat Function] Missing text in request payload");
    return new Response(JSON.stringify({ error: "Missing text" }), { status: 400 });
  }

  // System prompt to anchor to your portfolio
  const systemPrompt = `
You are the portfolio assistant for Rohit Nair.
Only answer questions about Rohit’s skills, experience, and projects.
If asked anything else, politely decline.
`;

  // Prepare Gemini request body
  const requestBody = {
    model: "gemini-2.5-flash",
    prompt: `${systemPrompt}\nUser: ${text}\nAssistant:`,
    temperature: 0.2,
    max_output_tokens: 512
  };

  console.log("[Chat Function] Sending request to Gemini:", requestBody);

  // Call Gemini API
  let geminiResponse;
  try {
    const resp = await fetch(
      "https://generativelanguage.googleapis.com/v1beta2/models/gemini-2.5-flash:generateText",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${GEMINI_KEY}`
        },
        body: JSON.stringify(requestBody)
      }
    );

    if (!resp.ok) {
      const errText = await resp.text();
      console.error("[Chat Function] Gemini API error:", resp.status, errText);
      return new Response(JSON.stringify({ error: "Gemini request failed" }), { status: 502 });
    }

    geminiResponse = await resp.json();
    console.log("[Chat Function] Gemini response:", geminiResponse);
  } catch (err) {
    console.error("[Chat Function] Error calling Gemini API:", err);
    return new Response(JSON.stringify({ error: "Server error calling Gemini" }), { status: 502 });
  }

  // Extract answer
  const answer = geminiResponse.candidates?.[0]?.output?.trim() || "";
  console.log("[Chat Function] Final answer:", answer);

  // Return the answer with CORS header
  return new Response(JSON.stringify({ answer }), {
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*"  // lock to your domain in prod
    }
  });
});
