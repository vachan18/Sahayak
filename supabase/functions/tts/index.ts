// Supabase Edge Function — neural text-to-speech proxy for Sahayak.
// Deploy:  supabase functions deploy tts
// Secret:  supabase secrets set SARVAM_API_KEY=...
// Client:  VITE_TTS_URL=https://<project>.supabase.co/functions/v1/tts
//
// Uses Sarvam AI "Bulbul" — neural voices trained on Indian languages, which sound far
// more natural than generic OS voices. Swap the provider block to use Google Cloud TTS,
// Azure Neural or Bhashini; the browser contract ({ text, lang } → { audio, mime }) stays the same.

const LANG: Record<string, string> = {
  en: 'en-IN', hi: 'hi-IN', bn: 'bn-IN', kn: 'kn-IN', ml: 'ml-IN', mr: 'mr-IN',
  or: 'od-IN', pa: 'pa-IN', ta: 'ta-IN', te: 'te-IN', gu: 'gu-IN',
};

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });
  try {
    const { text, lang } = await req.json();
    const target = LANG[lang];
    if (!text || typeof text !== 'string' || text.length > 1500 || !target) {
      return new Response(JSON.stringify({ error: 'unsupported' }), { status: 400, headers: { ...cors, 'Content-Type': 'application/json' } });
    }
    const r = await fetch('https://api.sarvam.ai/text-to-speech', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'api-subscription-key': Deno.env.get('SARVAM_API_KEY') ?? '' },
      body: JSON.stringify({
        inputs: [text],
        target_language_code: target,
        speaker: Deno.env.get('SARVAM_SPEAKER') ?? 'anushka',
        model: Deno.env.get('SARVAM_MODEL') ?? 'bulbul:v2',
        pace: 0.95,
        enable_preprocessing: true,
      }),
    });
    if (!r.ok) return new Response(JSON.stringify({ error: 'provider', status: r.status }), { status: 502, headers: { ...cors, 'Content-Type': 'application/json' } });
    const data = await r.json();
    return new Response(JSON.stringify({ audio: data.audios?.[0], mime: 'audio/wav' }), { headers: { ...cors, 'Content-Type': 'application/json' } });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), { status: 500, headers: { ...cors, 'Content-Type': 'application/json' } });
  }
});
