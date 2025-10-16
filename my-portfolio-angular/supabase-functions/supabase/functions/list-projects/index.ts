/// <reference lib="dom" />
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SERVICE_ROLE = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(SUPABASE_URL, SERVICE_ROLE, { auth: { persistSession: false } });

function cors(res: Response) {
  const h = new Headers(res.headers);
  h.set('Access-Control-Allow-Origin', '*'); // tighten later to your domain
  h.set('Access-Control-Allow-Methods', 'GET,OPTIONS');
  h.set('Access-Control-Allow-Headers', 'authorization, content-type');
  h.set('content-type', 'application/json');
  return new Response(res.body, { status: res.status, headers: h });
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return cors(new Response(null, { status: 204 }));
  if (req.method !== 'GET')     return cors(new Response(JSON.stringify({ message: 'Method Not Allowed' }), { status: 405 }));

  try {
    const url = new URL(req.url);
    const featuredParam = url.searchParams.get('featured');
    const limitParam = url.searchParams.get('limit');

    const featured = featuredParam === 'true' ? true
                   : featuredParam === 'false' ? false
                   : undefined;
    const limit = limitParam ? Math.max(0, Number(limitParam)) : undefined;

    // Since your site has one profile row, we can resolve that single profile first
    const { data: profile, error: pErr } = await supabase
      .from('profiles')
      .select('id')
      .order('created_at', { ascending: true })
      .limit(1)
      .single();

    if (pErr || !profile) {
      return cors(new Response(JSON.stringify({ message: 'Profile not found', detail: pErr?.message }), { status: 404 }));
    }

    let query = supabase
      .from('projects')
      .select('*')
      .eq('profile_id', profile.id)
      .order('created_at', { ascending: false });

    if (typeof featured === 'boolean') query = query.eq('featured', featured);
    if (typeof limit === 'number' && limit > 0) query = query.limit(limit);

    const { data, error } = await query;
    if (error) {
      return cors(new Response(JSON.stringify({ message: 'Failed to load projects', detail: error.message }), { status: 500 }));
    }
    return cors(new Response(JSON.stringify(data ?? []), { status: 200 }));
  } catch (e) {
    return cors(new Response(JSON.stringify({ message: 'Unhandled error', detail: String(e) }), { status: 500 }));
  }
});
