/// <reference lib="dom" />
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SERVICE_ROLE = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(SUPABASE_URL, SERVICE_ROLE, { auth: { persistSession: false } });

function cors(res: Response) {
  const h = new Headers(res.headers);
  h.set('Access-Control-Allow-Origin', '*'); // tighten later to your domain
  h.set('Access-Control-Allow-Methods', 'POST,OPTIONS');
  h.set('Access-Control-Allow-Headers', 'authorization, content-type');
  h.set('content-type', 'application/json');
  return new Response(res.body, { status: res.status, headers: h });
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return cors(new Response(null, { status: 204 }));
  if (req.method !== 'POST')    return cors(new Response(JSON.stringify({ message: 'Method Not Allowed' }), { status: 405 }));

  try {
    const payload = await req.json().catch(() => null) as {
      name?: string; email?: string; subject?: string; message?: string;
    } | null;

    const name = payload?.name?.trim();
    const email = payload?.email?.trim();
    const subject = payload?.subject?.trim() ?? null;
    const message = payload?.message?.trim();

    if (!name || !email || !message) {
      return cors(new Response(JSON.stringify({ message: 'name, email, and message are required' }), { status: 400 }));
    }

    // Basic anti-abuse (server-side) – you can extend with per-IP limits at CDN/WAF level
    if (name.length > 120 || email.length > 160 || (subject?.length ?? 0) > 200 || message.length > 4000) {
      return cors(new Response(JSON.stringify({ message: 'Payload too large or invalid' }), { status: 413 }));
    }

    const { data, error } = await supabase
      .from('contact_messages')
      .insert([{ name, email, subject, message }])
      .select();

    if (error) {
      return cors(new Response(JSON.stringify({ message: 'Insert failed', detail: error.message }), { status: 500 }));
    }

    return cors(new Response(JSON.stringify({ ok: true, id: data?.[0]?.id ?? null }), { status: 201 }));
  } catch (e) {
    return cors(new Response(JSON.stringify({ message: 'Invalid JSON or unhandled error', detail: String(e) }), { status: 400 }));
  }
});
