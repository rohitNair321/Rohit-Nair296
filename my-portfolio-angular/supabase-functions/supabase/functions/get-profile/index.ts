import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SERVICE_ROLE = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(SUPABASE_URL, SERVICE_ROLE, { auth: { persistSession: false } });

function cors(res: Response) {
  const h = new Headers(res.headers);
  h.set('Access-Control-Allow-Origin', '*');                 // tighten to your domain later
  h.set('Access-Control-Allow-Methods', 'GET,OPTIONS');
  h.set('Access-Control-Allow-Headers', 'authorization, content-type');
  h.set('content-type', 'application/json');
  return new Response(res.body, { status: res.status, headers: h });
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return cors(new Response(null, { status: 204 }));
  if (req.method !== 'GET')     return cors(new Response(JSON.stringify({ message: 'Method Not Allowed' }), { status: 405 }));

  try {
    // Call the Postgres composer function -> returns { home, aboutMe }
    const { data, error } = await supabase.rpc('get_portfolio_json');
    if (error) {
      return cors(new Response(JSON.stringify({ message: 'Failed to compose portfolio JSON', detail: error.message }), { status: 500 }));
    }
    return cors(new Response(JSON.stringify(data ?? {}), { status: 200 }));
  } catch (e) {
    return cors(new Response(JSON.stringify({ message: 'Unhandled error', detail: String(e) }), { status: 500 }));
  }
});


function ok(body: any, init?: ResponseInit) {
    return cors(new Response(JSON.stringify(body), {
        status: init?.status ?? 200,
        headers: { 'content-type': 'application/json' }
    }));
}

function bad(status: number, message: string, detail?: any) {
    return cors(new Response(JSON.stringify({ message, detail }), {
        status,
        headers: { 'content-type': 'application/json' }
    }));
}
