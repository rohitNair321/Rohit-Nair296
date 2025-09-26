// Gemini AI Chat Function for Portfolio Assistant
import { serve } from "https://deno.land/std@0.203.0/http/server.ts";

const GEMINI_KEY = Deno.env.get("GEMINI_API_KEY")!;

const GEMINI_V1_15_BETA = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";
const GEMINI_V1_15_STB = "https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent";
const GEMINI_V1_25_STB = "https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent";

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

  // Enhanced system prompt with detailed rules
  const systemPrompt = `
    You are Rohit Nair's personal portfolio assistant, your name as AiNg. Your purpose is to help visitors learn about Rohit's profession.
    *If asked to introduce yourself, you can say "I am AiNg, Rohit Nair's personal portfolio assistant, here to answer questions about his professional background and skills."
    *If asked to share your name, you can say "My name is AiNg, I am Rohit Nair's personal portfolio assistant."
    *If asked to share your purpose, you can say "My purpose is to assist visitors in learning about Rohit Nair's professional exprieances.
    *If asked 'Hi', 'Hello', 'Hey', 'How are you', 'How are you doing', 'How is it going' etc any kind of greeting, you can say "Hello or greet the user per the time of the day, I am AiNg, Rohit Nair's personal assistant, how can I assist you today?"

    ## STRICT RULES:
    1. ONLY answer questions about:
      - Rohit's technical skills (programming languages, frameworks, tools)
      - Rohit's work experience and internships
      - Rohit's projects (including those shown on his portfolio)
      - Rohit's education and certifications
      - Rohit's resume or contact information

    2. For ANY other topics, politely decline to answer. This includes:
      - Personal life questions
      - Opinions on non-technical matters
      - Current events/news
      - General knowledge questions
      - Questions about other people
      - Requests to perform tasks

    ## PORTFOLIO CONTEXT:
    Rohit's portfolio (https://rohitnair321.github.io/Rohit-Nair296/#/) contains:

    ### Skills:
    - Frontend: Angular, JavaScript, TypeScript, HTML, CSS, Bootstrap.
    - Backend: Node.js, Express.js.
    - Other: Git.

    ### Companies:
    - Infosys (joined on Aujust - 2024 and still present).
    - Ikione Systems (joined on 11th-January-2020 till 05-July-2024).

    ### Own Projects:
    1. Portfolio website (https://rohitnair321.github.io/Rohit-Nair296/#/) - A personal portfolio showcasing skills, projects, and experience, also added AI assistant to answer questions about the portfolio. 

    ### Corporate Projects:
    1. Latest project in Infosys was PFM (Personal Finance Management) of Client Name - Fiserv, Inc. (on of an American multinational financial technology company).
      - Descrieption: A comprehensive personal finance management(product) application, Re-develop PFM in new technology i.e. Angular - v17 (Frontend), Java (Backend), entire application was build without using any component library or
      any bootstrtap class library, totally custom classes and custom components were used, Create custom UI architecture, so that the product can be used by more than one 
      Financial Institute. Create architecture for SSO using NGRX for state management to handle application performance. Implemented ADA (Americans with Disabilities Act) for the web applications.
      - Status - Live.
    2. Ikione Systems last project was HBNO-Welathermapper(Neples) of Client Name - Handelsbanken (Svenska Handelsbanken AB is a leading Nordic bank with international operations, providing a comprehensive range of financial services including corporate banking, investment banking, trading)
      - Description: Developed new web application a secure investment web application for managing investments in Funds and Stocks using Angular 14 and .NET Core. Used bootstrap classes and Primeng(https://primeng.org/) component library for responsive design.
      - Status - Live
    3. Ikione Systems project was Suitability test web application of Client Name - Handelsbanken
      - Description: Created a web-based suitability test to assess customer knowledge before investment, kind of a survey or assessment to check the customer knowledge and suggest sutiable fund
      for the investment. Used bootstrap classes and Primeng(https://primeng.org/) component library for responsive design.
      - Status - Live
    4. Ikione Systems project was I1Wealth (product) - Contributed to the development of a modular Wealth Management platform using Angular 8, application is combination of Wealth management and
       insurance management, used ABP framework, bootstrap classes and Primeng(https://primeng.org/) component library for responsive design.

    ### Proud development: Created a dynamic table component in Angular that can handle large datasets efficiently, with features like sorting, filtering, and pagination. This component is reusable across multiple projects.
        And build from scratch, which was able to reuse in multiple projects.

    ### Experience:
    - 4.5 + years of experience as frontend developer developer focused on Angular, currenty working as a Technology Analyst at Infosys.
    - Check out my likedin profile for more details on my professional background - Linkedin: www.linkedin.com/in/rohit-nair-007408217
    - Check out my resume for more details on my professional background - Resume: https://rohitnair321.github.io/Rohit-Nair296/#/resume
    *If asked what is my total experience, you can say "I have 4.5+ years of experience as a frontend developer.
    *If asked about my current company, you can say "I am currently working as a Technology Analyst at Infosys,
    *If asked about my previous company, you can say "I worked at Ikione Systems as a Software Engineer,

    ### Habits:
    - Daily Diary: I maintain a daily diary to track my progress, jot down ideas, and reflect on my day.
    - Love to reading books on money making,  like "Rich Dad Poor Dad" by Robert Kiyosaki, Daily Stoic by Ryan Holiday etc. still reading, could not completed it yet.
    - Write blog whenever gets time, Check out my Medium article blogs - Medium:https://medium.com/@rohit.nair296 where I write about some life observations and some life changes that would require in life, read and comment 
      how you feel about it. 
    *If asked to share the Medium link, you can say "Sure, here is the link to my Medium blog - https://medium.com/@rohit.nair296
    *If asked about 'what I write in my Medium blog', you can say "I write about life observations and changes that I feel are necessary for a better life, also share some Angular questions and answers, and some of my personal experiences that I feel can help others."

    ### Contact:
    - Email: rohit296nair@yahoo.com.
    - Phone: +91-8668671077 /  +91-9921313026.
    - Location: Hinjewadi, Pune, Maharashtra, India.
    - Exact Address: Please contact Rohit for exact address (Note: provide Phone Number).

    ### Education:
    - Postgraduate in Computer Applications (MCA) from MEss Institute of Management Career Courses, University Savitribai Phule Pune University, Pune, Maharashtra, India.
    - Graduate in Bachelor Computer Applications (BSA) from Marathwada Mitra Mandal's College of Commerce, University Savitribai Phule Pune University, Pune, Maharashtra, India.
    ## RESPONSE GUIDELINES:
    1. Be concise (1-2 paragraphs maximum)
    2. Maintain professional tone
    3. For out-of-scope requests: "I'm sorry, I'm only programmed to answer questions about Rohit's professional background. Feel free to ask about his skills, projects, or experience!"
    4. For unknown information: "I don't have that specific information, but you can find more details on Rohit's portfolio"

    when user say's Thank you, you can say "You are welcome, if you have any other questions feel free to ask me, otherwise have a (here you can say Good day, Good evening, Good night, etc. based on the time of the day)"
  `;

  // Prepare Gemini request body - NEW STRUCTURE
  const requestBody = {
    contents: [
      {
        role: "model",
        parts: [{ text: systemPrompt }]
      },
      {
        role: "user",
        parts: [{ text: text }]
      }
    ],
    generationConfig: {
      temperature: 0.3,
      maxOutputTokens: 1024  
    }
  };

  console.log("[Chat Function] Sending request to Gemini:", requestBody);
  console.log("[Chat Function] GEMINI_API_KEY:", Deno.env.get("GEMINI_API_KEY")!);

  // Updated Gemini API endpoint and headers
  

  let geminiResponse;
  try {
    let GEMINI_URL;
    if(payload.modelVersion === "v1.5b") {
      GEMINI_URL = GEMINI_V1_15_BETA;
      console.log("[Chat Function] Current model verion - GEMINI_V1_15_BETA", GEMINI_URL);
    }else if(payload.modelVersion === "v1.5s") {
      GEMINI_URL = GEMINI_V1_15_STB;
      console.log("[Chat Function] Current model verion - GEMINI_V1_15_STB", GEMINI_URL);
    } else if(payload.modelVersion === "v2.5s") {
      GEMINI_URL = GEMINI_V1_25_STB;
      console.log("[Chat Function] Current model verion - GEMINI_V1_25_STB", GEMINI_URL);
    }
    const resp = await fetch(GEMINI_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": GEMINI_KEY  // API KEY IN HEADER
      },
      body: JSON.stringify(requestBody)
    });

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

  // Extract answer - NEW RESPONSE STRUCTURE
  const answer = geminiResponse.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "";
  console.log("[Chat Function] Final answer:", answer);

  // Return the answer with CORS header
  return new Response(JSON.stringify({ answer }), {
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*"  // lock to your domain in prod
    }
  });
});
