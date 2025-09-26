# Supabase Functions

This project contains Supabase Edge Functions for portfolio AI chat and Gemini proxy.

## Prerequisites

- [Deno](https://deno.com/manual/getting_started/installation) (v1.0+)
- [Supabase CLI](https://supabase.com/docs/guides/cli) (v1.0+)
- Node.js (for some workflows)
- Supabase account (for deployment)

## Setup

1. **Clone the repository** and navigate to the project directory.

2. **Install Supabase CLI** (if not already installed):

   ```sh
   npm install -g supabase
   ```

3. **Start Supabase locally** (from the root directory):

   ```sh
   supabase start
   ```

4. **Set environment variables** required by your functions.  
   Create a `.env` file in the `supabase` directory (do not commit this file):

   ```
   GEMINI_API_KEY=your_gemini_api_key
   TOGETHER_API_KEY=your_together_api_key
   ```

5. **Deploy or run functions locally:**

   - To run a function locally (example for `ai-chat`):

     ```sh
     cd supabase/functions/ai-chat
     deno run -A index.ts
     ```

   - To deploy to Supabase Edge Functions:

     ```sh
     supabase functions deploy ai-chat
     supabase functions deploy proxy-gemini
     ```

## Usage

- **Local testing:**  
  Send a POST request to your function endpoint (see Supabase CLI output for the URL), with a JSON body:

  ```json
  {
    "text": "What projects has Rohit worked on?"
  }
  ```

- **Production:**  
  After deployment, use the Supabase Edge Function URL provided in your Supabase dashboard.

## Directory Structure

- `supabase/functions/ai-chat/` - AI chat function (Llama/Groq API)
- `supabase/functions/proxy-gemini/` - Gemini API proxy function

## References

- [Supabase Edge Functions Docs](https://supabase.com/docs/guides/functions)
- [Deno Manual](https://deno.com/manual)

---

**Note:**  
Remember to keep your API keys secure and do not commit them to version control.