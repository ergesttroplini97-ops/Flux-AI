# Flux AI — build e deploy

## Struttura

```
src/            i sorgenti: si modifica SOLO qui
  00-fonts.css  @font-face dei font auto-ospitati
  01-tokens.css palette, tipografia, spaziatura, movimento — la fonte di verita
  02-base.css   reset, tipografia, focus, reveal, reduced-motion
  03-components.css  bottoni, chip, card, form, contatore
  04-sections.css    una sezione per blocco, nell'ordine della pagina
  05-form.css   form lead
  06-doc.css    pagine legali
  page.html     markup del corpo
  form.html     markup del form
  head.html     meta, Open Graph, JSON-LD
  icons.svg     sprite di 24 icone
  iris.frag     fragment shader della hero
  app.js        tutto il comportamento, zero dipendenze
  pages/        privacy, cookie-policy, termini, grazie

index.html      GENERATO — non modificare a mano
privacy.html    GENERATO
cookie-policy.html · termini.html · grazie.html   GENERATI

fonts/          woff2 auto-ospitati (SIL OFL 1.1, vedi fonts/OFL.txt)
icons/          icone PWA generate da logo-flux.svg
api/lead.js     Vercel Function per la raccolta contatti
supabase/       migration della tabella leads
```

## Build

```bash
node build.mjs
```

Nessuna dipendenza npm. Rigenera `index.html` e le quattro pagine, e stampa i pesi.
**L'output e committato nel repo**, quindi chi pubblica il sito non deve eseguire nulla.

## Sviluppo in locale

```bash
npx http-server -p 8099
```

Serve via HTTP, non aprire `index.html` con `file://`: i font auto-ospitati vengono
bloccati da CORS con quel protocollo.

## Deploy

Il sito e statico, ma **il modulo di contatto richiede Vercel**: `/api/lead` e una
funzione serverless, e GitHub Pages non ne esegue. Finche il dominio resta su Pages,
il form non puo funzionare.

1. Collegare il repository a Vercel (build command: nessuno, output: la radice).
2. Impostare le variabili d'ambiente elencate in `.env.example`.
3. Creare il progetto Supabase in regione **`eu-central-1`** e applicare
   `supabase/migrations/0001_leads.sql`. Fuori dall'UE i dati escono dallo SEE.
4. Puntare il DNS di `flux-ai.it` su Vercel.

`vercel.json` contiene gia header di sicurezza (HSTS, CSP `default-src 'self'`,
Permissions-Policy), regole di cache e la configurazione della funzione.

## Credenziali

Stanno in `.env.local`, che **non e tracciato da git** (vedi `.gitignore`).
Il modello dei nomi e in `.env.example`. Non inserire mai token, chiavi o password
nei file tracciati, nei commenti o nei messaggi di commit.

## Prima di pubblicare

Vedi la sezione "Cosa resta da fare" di `PIANO_RESTYLING.md`. In sintesi:
dati societari (cercare `data-fill` e `###` nei sorgenti), le tre pagine legali da
far validare, le foto dei fondatori, l'immagine Open Graph, e le autorizzazioni
scritte per i due casi studio citati con numeri.
