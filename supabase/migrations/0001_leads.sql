-- Flux AI — tabella lead
-- Applicare con: supabase db push  (oppure incollare nell'SQL Editor del progetto)

create extension if not exists pgcrypto;

create table if not exists public.leads (
  id                  uuid primary key default gen_random_uuid(),
  created_at          timestamptz not null default now(),

  nome                text not null check (char_length(nome) between 2 and 80),
  azienda             text check (char_length(azienda) <= 120),
  email               text not null check (email ~* '^[^@\s]+@[^@\s]+\.[a-z]{2,63}$'),
  telefono            text check (char_length(telefono) <= 25),
  interesse           text not null check (interesse in
                        ('app-web','trading','workflow','agenti-ai',
                         'startup-ecommerce','prodotti','corsi','altro')),
  budget              text check (budget in ('<2k','2k-5k','5k-15k','>15k','da-definire')),
  messaggio           text not null check (char_length(messaggio) between 20 and 2000),

  -- GDPR: prova del consenso (art. 7.1)
  consenso_privacy    boolean not null default false check (consenso_privacy),
  consenso_marketing  boolean not null default false,
  consenso_versione   text not null default 'privacy-2026-07',

  -- metadati tecnici (IP pseudonimizzato via HMAC, mai in chiaro)
  ip_hash             text,
  user_agent          text,
  source_page         text,
  utm                 jsonb,

  -- pipeline commerciale
  stato               text not null default 'nuovo'
                        check (stato in ('nuovo','contattato','qualificato','vinto','perso','spam')),
  note                text
);

create index if not exists leads_created_at_idx on public.leads (created_at desc);
create index if not exists leads_ip_window_idx  on public.leads (ip_hash, created_at desc);
create index if not exists leads_stato_idx      on public.leads (stato);

-- RLS ON senza policy = nessun accesso con anon/publishable key.
-- Scrive solo la Vercel Function con service_role (che bypassa RLS).
alter table public.leads enable row level security;
revoke all on public.leads from anon, authenticated;

-- Retention GDPR: cancella i lead non convertiti dopo 24 mesi.
-- Schedulare con pg_cron: select cron.schedule('purge-leads','0 3 * * 0','select public.purge_old_leads()');
create or replace function public.purge_old_leads()
returns integer language plpgsql security definer set search_path = public as $$
declare n integer;
begin
  delete from public.leads
   where created_at < now() - interval '24 months'
     and stato in ('nuovo','contattato','perso','spam');
  get diagnostics n = row_count;
  return n;
end $$;
