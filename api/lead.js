'use strict';

const WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUESTS = 5;
const buckets = new Map();
const allowedServices = new Set([
  'Automazioni',
  'Sito o applicazione web',
  'Formazione AI',
  'Consulenza',
  'Altro'
]);

function text(value, max) {
  return String(value ?? '').trim().slice(0, max);
}

function json(res, status, body) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.end(JSON.stringify(body));
}

function limited(req) {
  const forwarded = text(req.headers['x-forwarded-for'], 200);
  const ip = forwarded.split(',')[0].trim() || 'unknown';
  const now = Date.now();
  const current = buckets.get(ip);

  if (!current || now - current.startedAt > WINDOW_MS) {
    buckets.set(ip, { startedAt: now, count: 1 });
    return false;
  }

  current.count += 1;
  if (buckets.size > 1000) {
    for (const [key, value] of buckets) {
      if (now - value.startedAt > WINDOW_MS) buckets.delete(key);
    }
  }
  return current.count > MAX_REQUESTS;
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return json(res, 405, { ok: false, message: 'Metodo non consentito.' });
  }

  const length = Number(req.headers['content-length'] || 0);
  if (length > 12_000) {
    return json(res, 413, { ok: false, message: 'Richiesta troppo grande.' });
  }

  if (limited(req)) {
    res.setHeader('Retry-After', '600');
    return json(res, 429, { ok: false, message: 'Troppi tentativi. Riprova più tardi.' });
  }

  let body;
  try {
    body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
  } catch {
    return json(res, 400, { ok: false, message: 'Richiesta non valida.' });
  }

  if (text(body.website, 200)) {
    return json(res, 200, { ok: true });
  }

  const payload = {
    nome: text(body.nome, 120),
    azienda: text(body.azienda, 160),
    email: text(body.email, 254).toLowerCase(),
    telefono: text(body.telefono, 40),
    servizio: text(body.servizio, 80),
    messaggio: text(body.messaggio, 1800),
    consenso: body.consenso === true,
    data_consenso: new Date().toISOString(),
    origine_tecnica: 'flux-ai-vercel'
  };

  const errors = [];
  if (!payload.nome) errors.push('Inserisci il nome.');
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(payload.email)) errors.push('Inserisci un’email valida.');
  if (!allowedServices.has(payload.servizio)) errors.push('Seleziona un servizio.');
  if (!payload.messaggio) errors.push('Descrivi brevemente la richiesta.');
  if (!payload.consenso) errors.push('Accetta l’informativa privacy.');

  if (errors.length) {
    return json(res, 400, { ok: false, message: errors[0] });
  }

  const endpoint = process.env.N8N_A1_WEBHOOK_URL;
  const webhookKey = process.env.N8N_A1_WEBHOOK_KEY;
  const privacyVersion = process.env.PRIVACY_NOTICE_VERSION;

  if (!endpoint || !webhookKey || !privacyVersion) {
    return json(res, 503, {
      ok: false,
      message: 'Il modulo è in configurazione. Scrivi a ergest@flux-ai.it.'
    });
  }

  let target;
  try {
    target = new URL(endpoint);
  } catch {
    return json(res, 503, { ok: false, message: 'Il modulo è temporaneamente non disponibile.' });
  }

  if (target.protocol !== 'https:' || target.hostname !== 'n8n.lab-guess.it') {
    return json(res, 503, { ok: false, message: 'Il modulo è temporaneamente non disponibile.' });
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 9000);

  try {
    const upstream = await fetch(target, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Flux-Webhook-Key': webhookKey
      },
      body: JSON.stringify({ ...payload, privacy_version: privacyVersion }),
      signal: controller.signal
    });

    const result = await upstream.json().catch(() => ({}));
    if (!upstream.ok || result.ok !== true) {
      return json(res, 502, {
        ok: false,
        message: 'Non siamo riusciti a registrare la richiesta. Scrivi a ergest@flux-ai.it.'
      });
    }

    return json(res, 200, { ok: true });
  } catch (error) {
    console.error('Lead proxy error:', error?.name || 'unknown');
    return json(res, 502, {
      ok: false,
      message: 'Servizio momentaneamente non disponibile. Scrivi a ergest@flux-ai.it.'
    });
  } finally {
    clearTimeout(timeout);
  }
};
