/**
 * POST /api/lead — endpoint unico di lead capture per Flux AI
 * Runtime: Node.js (Vercel Function). Nessuna dipendenza npm.
 *
 * ENV richieste (Vercel → Settings → Environment Variables):
 *   ALLOWED_ORIGINS      https://www.flux-ai.it,https://flux-ai.it
 *   RESEND_API_KEY       re_xxx                      (obbligatoria: notifica email)
 *   LEAD_TO_EMAIL        ergest@flux-ai.it,daniel@flux-ai.it
 *   LEAD_FROM_EMAIL      "Flux AI <no-reply@flux-ai.it>"   (dominio verificato su Resend)
 *   SUPABASE_URL         https://xxxx.supabase.co    (opzionale: se assente, salta il DB)
 *   SUPABASE_SERVICE_KEY eyJ...                      (service_role — MAI lato client)
 *   IP_HASH_SALT         stringa random lunga        (pseudonimizzazione IP, GDPR)
 */

'use strict';

const crypto = require('node:crypto');

/* ------------------------------------------------------------------ */
/* CONFIG                                                              */
/* ------------------------------------------------------------------ */

const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS || 'https://www.flux-ai.it,https://flux-ai.it')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);

const INTERESSI = [
  'app-web',
  'trading',
  'workflow',
  'agenti-ai',
  'startup-ecommerce',
  'prodotti',
  'corsi',
  'altro',
];

const BUDGET = ['<2k', '2k-5k', '5k-15k', '>15k', 'da-definire'];

// Rate limit: finestra scorrevole in memoria (per-istanza) + controllo autoritativo su DB.
const WINDOW_MS = 15 * 60 * 1000;
const MAX_PER_IP = 3;
const MAX_GLOBAL = 60;
const hits = new Map(); // ipHash -> number[] (timestamps)
let globalHits = [];

/* ------------------------------------------------------------------ */
/* HELPERS                                                             */
/* ------------------------------------------------------------------ */

// Rimuove i caratteri di controllo (conserva \n e \t), poi taglia alla lunghezza massima.
const CTRL = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g;
const clean = (v, max) => (typeof v === 'string' ? v.replace(CTRL, '').trim().slice(0, max) : '');

// Volutamente permissiva: la validazione "vera" è il fatto che l'email riceva.
const EMAIL_RE = /^[^\s@,;<>()[\]\\]+@([^\s@.,;<>()[\]\\]+\.)+[A-Za-z]{2,63}$/;
const TEL_RE = /^[+0-9][0-9\s.\-/()]{5,24}$/;

function clientIp(req) {
  const fwd = req.headers['x-forwarded-for'];
  return (Array.isArray(fwd) ? fwd[0] : (fwd || '')).split(',')[0].trim() || '0.0.0.0';
}

function hashIp(ip) {
  return crypto
    .createHmac('sha256', process.env.IP_HASH_SALT || 'flux-ai-dev-salt')
    .update(ip)
    .digest('hex')
    .slice(0, 32);
}

// Il controllo e la registrazione sono separati: si contano solo gli invii
// che superano honeypot e validazione. Altrimenti tre errori di battitura
// chiudono il form per 15 minuti, e 60 POST spazzatura lo chiudono a tutti.
function isRateLimited(ipHash) {
  const now = Date.now();
  globalHits = globalHits.filter((t) => now - t < WINDOW_MS);
  if (globalHits.length >= MAX_GLOBAL) return true;
  const list = (hits.get(ipHash) || []).filter((t) => now - t < WINDOW_MS);
  hits.set(ipHash, list);
  return list.length >= MAX_PER_IP;
}

function recordHit(ipHash) {
  const now = Date.now();
  const list = (hits.get(ipHash) || []).filter((t) => now - t < WINDOW_MS);
  list.push(now);
  hits.set(ipHash, list);
  globalHits.push(now);
  if (hits.size > 5000) hits.clear(); // guard-rail memoria
}

// Accetta sia application/json (fetch) sia x-www-form-urlencoded (submit
// nativo del form senza JavaScript). Vercel puo pre-parsare il body in
// entrambi i casi, oppure lasciarlo come stringa o come stream.
async function readBody(req) {
  const ctype = String(req.headers['content-type'] || '');
  const isForm = ctype.includes('application/x-www-form-urlencoded');

  if (req.body && typeof req.body === 'object' && !Buffer.isBuffer(req.body)) return req.body;

  let raw = '';
  if (typeof req.body === 'string') raw = req.body;
  else if (Buffer.isBuffer(req.body)) raw = req.body.toString('utf8');
  else {
    const chunks = [];
    let size = 0;
    for await (const c of req) {
      size += c.length;
      if (size > 32 * 1024) throw new Error('payload_too_large');
      chunks.push(c);
    }
    raw = Buffer.concat(chunks).toString('utf8');
  }
  if (!raw) return {};
  if (isForm) return Object.fromEntries(new URLSearchParams(raw));
  return JSON.parse(raw);
}

// Un submit nativo si aspetta una pagina, non JSON.
function wantsJson(req) {
  return String(req.headers['accept'] || '').includes('application/json') ||
         String(req.headers['content-type'] || '').includes('application/json');
}

function esc(s) {
  return String(s).replace(/[&<>"']/g, (c) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])
  );
}

/* ------------------------------------------------------------------ */
/* VALIDAZIONE                                                         */
/* ------------------------------------------------------------------ */

function validate(body) {
  const errors = {};
  const d = {
    nome: clean(body.nome, 80),
    azienda: clean(body.azienda, 120) || null,
    email: clean(body.email, 160).toLowerCase(),
    telefono: clean(body.telefono, 25) || null,
    interesse: clean(body.interesse, 32),
    budget: clean(body.budget, 16) || null,
    messaggio: clean(body.messaggio, 2000),
    consenso_privacy: body.consenso_privacy === true || body.consenso_privacy === 'on',
    consenso_marketing: body.consenso_marketing === true || body.consenso_marketing === 'on',
  };

  if (d.nome.length < 2) errors.nome = 'Inserisci nome e cognome.';
  if (!EMAIL_RE.test(d.email)) errors.email = 'Inserisci un indirizzo email valido.';
  if (d.telefono !== null && !TEL_RE.test(d.telefono)) errors.telefono = 'Numero di telefono non valido.';
  if (!INTERESSI.includes(d.interesse)) errors.interesse = 'Seleziona di cosa hai bisogno.';
  if (d.budget !== null && !BUDGET.includes(d.budget)) errors.budget = 'Valore non valido.';
  if (d.messaggio.length < 20) errors.messaggio = 'Descrivi la richiesta in almeno 20 caratteri.';
  if (!d.consenso_privacy) errors.consenso_privacy = 'Devi accettare l’informativa privacy per inviare.';

  return { data: d, errors };
}

/* ------------------------------------------------------------------ */
/* SUPABASE (REST, nessun SDK)                                         */
/* ------------------------------------------------------------------ */

async function recentFromIp(ipHash) {
  if (!process.env.SUPABASE_URL) return 0;
  const since = new Date(Date.now() - WINDOW_MS).toISOString();
  const url =
    `${process.env.SUPABASE_URL}/rest/v1/leads` +
    `?select=id&ip_hash=eq.${encodeURIComponent(ipHash)}&created_at=gte.${encodeURIComponent(since)}`;
  const r = await fetch(url, {
    headers: {
      apikey: process.env.SUPABASE_SERVICE_KEY,
      Authorization: `Bearer ${process.env.SUPABASE_SERVICE_KEY}`,
      Prefer: 'count=exact',
      Range: '0-0',
    },
  });
  if (!r.ok) return 0; // il DB non deve mai bloccare un lead legittimo
  const cr = r.headers.get('content-range') || '*/0';
  return parseInt(cr.split('/')[1], 10) || 0;
}

async function insertLead(d, meta) {
  if (!process.env.SUPABASE_URL) return null;
  const r = await fetch(`${process.env.SUPABASE_URL}/rest/v1/leads`, {
    method: 'POST',
    headers: {
      apikey: process.env.SUPABASE_SERVICE_KEY,
      Authorization: `Bearer ${process.env.SUPABASE_SERVICE_KEY}`,
      'Content-Type': 'application/json',
      Prefer: 'return=representation',
    },
    body: JSON.stringify([{ ...d, ...meta }]),
  });
  if (!r.ok) throw new Error(`supabase_${r.status}: ${await r.text()}`);
  const [row] = await r.json();
  return row?.id ?? null;
}

/* ------------------------------------------------------------------ */
/* EMAIL (Resend REST)                                                 */
/* ------------------------------------------------------------------ */

async function notify(d, id) {
  if (!process.env.RESEND_API_KEY) {
    console.warn('[lead] RESEND_API_KEY non impostata: nessuna notifica inviata per', id);
    return;
  }
  const to = (process.env.LEAD_TO_EMAIL || 'ergest@flux-ai.it').split(',').map((s) => s.trim());
  const html = `
    <h2 style="font-family:system-ui">Nuovo lead — ${esc(d.interesse)}</h2>
    <table style="font-family:system-ui;border-collapse:collapse" cellpadding="6">
      <tr><td><b>Nome</b></td><td>${esc(d.nome)}</td></tr>
      <tr><td><b>Azienda</b></td><td>${esc(d.azienda || '—')}</td></tr>
      <tr><td><b>Email</b></td><td><a href="mailto:${esc(d.email)}">${esc(d.email)}</a></td></tr>
      <tr><td><b>Telefono</b></td><td>${esc(d.telefono || '—')}</td></tr>
      <tr><td><b>Interesse</b></td><td>${esc(d.interesse)}</td></tr>
      <tr><td><b>Budget</b></td><td>${esc(d.budget || '—')}</td></tr>
      <tr><td><b>Marketing</b></td><td>${d.consenso_marketing ? 'SI' : 'NO'}</td></tr>
      <tr><td valign="top"><b>Messaggio</b></td><td>${esc(d.messaggio).replace(/\n/g, '<br>')}</td></tr>
      <tr><td><b>ID</b></td><td>${esc(id || 'n/d')}</td></tr>
    </table>`;

  const r = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: process.env.LEAD_FROM_EMAIL || 'Flux AI <no-reply@flux-ai.it>',
      to,
      reply_to: d.email,
      subject: `[Lead] ${d.nome}${d.azienda ? ' — ' + d.azienda : ''} · ${d.interesse}`,
      html,
    }),
  });
  if (!r.ok) throw new Error(`resend_${r.status}: ${await r.text()}`);
}

/* ------------------------------------------------------------------ */
/* HANDLER                                                             */
/* ------------------------------------------------------------------ */

module.exports = async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-Content-Type-Options', 'nosniff');

  const json = wantsJson(req);
  // Il submit nativo (senza JS) si aspetta una navigazione, non un JSON.
  const reply = (status, payload) => {
    if (json) return res.status(status).json(payload);
    if (status >= 200 && status < 300) {
      res.setHeader('Location', '/grazie.html');
      return res.status(303).end();
    }
    res.setHeader('Location', '/grazie.html?errore=' + encodeURIComponent(payload.error || 'errore'));
    return res.status(303).end();
  };

  const origin = req.headers.origin || '';
  const originOk = ALLOWED_ORIGINS.includes(origin);
  if (originOk) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
  }

  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Max-Age', '86400');
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST, OPTIONS');
    return reply(405, { ok: false, error: 'method_not_allowed' });
  }

  // Same-origin: il browser invia Origin sui POST. Se c'è ed è estraneo → stop.
  if (origin && !originOk) {
    return reply(403, { ok: false, error: 'origin_not_allowed' });
  }

  const ipHash = hashIp(clientIp(req));

  if (isRateLimited(ipHash)) {
    res.setHeader('Retry-After', '900');
    return reply(429, {
      ok: false,
      error: 'rate_limited',
      message: 'Avete già inviato una richiesta di recente. Riprovate fra qualche minuto, oppure scriveteci a ergest@flux-ai.it.',
    });
  }

  let body;
  try {
    body = await readBody(req);
  } catch {
    return reply(400, { ok: false, error: 'bad_request' });
  }

  // --- Antispam silenzioso: honeypot + time-trap ---------------------
  // Rispondiamo 200 al bot così non capisce di essere stato scartato.
  // `elapsed` e un delta monotono misurato dal client con performance.now():
  // niente confronto fra orologi diversi, quindi niente lead persi per skew
  // o per una scheda lasciata aperta a lungo.
  const hasElapsed = body.elapsed !== undefined && body.elapsed !== '';
  const elapsed = Number(body.elapsed);
  const trapped =
    clean(body.website, 200) !== '' ||                        // honeypot
    (hasElapsed && (!Number.isFinite(elapsed) || elapsed < 2500));
  // Senza JS `elapsed` non esiste: restano honeypot e rate limit. Meglio un
  // lead in piu da filtrare a mano che un lead vero scartato in silenzio.
  if (trapped) return reply(200, { ok: true, id: null });

  const { data, errors } = validate(body);
  if (Object.keys(errors).length) {
    return reply(422, { ok: false, error: 'validation_failed', fields: errors });
  }

  recordHit(ipHash);   // solo ora: l'invio e legittimo

  try {
    if ((await recentFromIp(ipHash)) >= MAX_PER_IP) {
      res.setHeader('Retry-After', '900');
      return reply(429, {
        ok: false,
        error: 'rate_limited',
        message: 'Avete già inviato una richiesta di recente. Riprovate fra qualche minuto.',
      });
    }

    const id = await insertLead(data, {
      ip_hash: ipHash,
      user_agent: clean(req.headers['user-agent'], 300),
      source_page: clean(body.source_page, 200),
      utm: typeof body.utm === 'object' && body.utm ? body.utm : null,
    });

    // Il lead e salvato: da qui in poi la richiesta e riuscita comunque.
    // Un fallimento dell'email non deve far credere all'utente che sia andata
    // persa, altrimenti reinvia e finiamo con dei duplicati.
    try {
      await notify(data, id);
    } catch (mailErr) {
      console.error('[lead] notifica email fallita, lead salvato:', id, mailErr && mailErr.message);
    }
    return reply(201, { ok: true, id });
  } catch (err) {
    console.error('[lead] ', err && err.message);
    // Ultima spiaggia: il lead non deve andare perso in silenzio.
    return reply(502, {
      ok: false,
      error: 'delivery_failed',
      message: 'Non siamo riusciti a registrare la richiesta. Scriveteci a ergest@flux-ai.it — rispondiamo subito.',
    });
  }
};
