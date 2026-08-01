# Flux AI — Stato del Sito Web

> **Documento di stato tecnico e funzionale.**
> Fotografia completa del sito `index.html` così com'è oggi, verificata riga per riga sul codice.
> Complementare a `contesto.md` (che è il *log storico dei prompt*): qui c'è **ciò che il codice fa davvero**, non ciò che era stato pianificato.

**Data analisi:** 1 agosto 2026
**Ultimo commit del progetto:** 29 marzo 2026 (`dee3724`)
**Inattività:** ~4 mesi

---

## 1. Verdetto in una riga

Il sito è **completo nei contenuti e nel design, ma non funzionale come strumento commerciale**: è una vetrina statica in cui **nessuna call-to-action porta da qualche parte** e non esiste alcun modo per un visitatore di lasciare i propri dati.

| Dimensione | Stato | Note |
|---|---|---|
| Contenuti editoriali | 🟢 Completi | 5 sezioni, testi definitivi, prezzi presenti |
| Design / identità visiva | 🟢 Completo | Palette, font, animazioni implementati |
| Conversione (CTA, form, contatti) | 🔴 Assente | 13 pulsanti morti, 0 form |
| SEO tecnica | 🟡 Parziale | Meta base sì, OG image / canonical / structured data no |
| Accessibilità | 🔴 Carente | 0 `aria-label` con 14 link icon-only |
| Responsive | 🟡 Minimo | 1 sola media query su 4 breakpoint previsti |
| Validità markup | 🟡 Un difetto | 1 `</div>` di troppo (riga 1070) |
| Deploy | ⚪ Non verificabile | Documentato su GitHub Pages, non confermato |

---

## 2. Struttura del repository

```
Flux-AI/
├── index.html                      57 KB   1.634 righe — TUTTO il sito
├── contesto.md                     17 KB   397 righe — log storico dei prompt #1-#5
├── context.md                              questo documento
├── PROMPT_RESTYLING_FLUX_AI.md     24 KB   specifica di restyling DergexAi → Flux AI
├── README_DEPLOYMENT.md           2,6 KB   procedura deploy + gestione credenziali
├── immagine logo.png              1,79 MB  logo brand — NON usato dalla pagina
├── Esempio stile sito web .jpeg    328 KB   riferimento visivo
├── .gitignore                              esclude .env, .env.local, node_modules, dist
└── .claude/launch.json                     config live-server su porta 8080
```

**Nessun `package.json`, nessun build step, nessuna pipeline CI.** Il sito è un singolo file HTML autoconsistente: si apre con doppio clic o si serve staticamente.

### Stato Git

| | |
|---|---|
| Branch attivi | `main`, `claude/flux-ai-page-status-q4zt8k` (**identici**, 0 differenze) |
| Working tree | Pulito |
| Commit totali | 2 |
| `57e0dc4` | Initial commit — restyling completo da DergexAi a Flux AI con Vanta.js Net |
| `dee3724` | Deployment configuration and credentials management system |
| Autore | ergesttroplini97-ops |

---

## 3. Architettura tecnica

**Stack:** HTML5 + CSS3 + Vanilla JS, tutto inline in un unico file. Zero framework, zero dipendenze npm.

**Ripartizione di `index.html`:**

| Blocco | Righe | Contenuto |
|---|---|---|
| `<head>` + `<style>` | 1 – 987 | Meta tag, Google Fonts, ~970 righe di CSS inline |
| Navbar | 988 – 1021 | Logo SVG inline + 5 tab + CTA + hamburger |
| Sezione Home | 1023 – 1071 | Hero, Vanta.js canvas, 4 metriche |
| Sezione Servizi | 1073 – 1139 | 5 service card |
| Sezione Chi Siamo | 1140 – 1240 | 2 founder card + missione/visione/valori |
| Sezione Prodotti | 1242 – 1369 | 5 product card |
| Sezione Corsi | 1371 – 1449 | 3 course card |
| Footer | 1451 – 1496 | Brand, social, link, contatti founder |
| `<script>` | 1497 – 1634 | Navigazione, cursor, observer, hamburger, Vanta init |

**Modello di navigazione:** SPA a tab. La funzione `showSection(name)` toglie la classe `.active` da tutte le `<section>` e la assegna a quella scelta; il CSS fa `display:none` / `display:block`. Tutte e 5 le sezioni sono presenti nel DOM contemporaneamente.

**Librerie esterne (CDN):**
- Google Fonts — Space Grotesk (400-800) + Inter (300-600)
- Three.js `r134` — da cdnjs
- Vanta.js Net `@latest` — da jsdelivr, **versione non pinnata**

---

## 4. Design system implementato

Variabili CSS effettivamente definite in `:root`:

| Token | Valore | Uso |
|---|---|---|
| `--bg-dark` | `#0A0A0E` | Sfondo globale |
| `--bg-card` | `#0D1F17` | Card (dark con tonalità verde) |
| `--bg-card-2` | `#111820` | Card alternative |
| `--border` | `#1A3A2A` | Bordi sottili |
| `--emerald-400` | `#34D399` | Glow / highlight |
| `--emerald-500` | `#10B981` | **Accent primario** |
| `--emerald-600` | `#059669` | Accent profondo |
| `--cyan` | `#00C8FF` | Accent secondario (dal logo) |
| `--lime` | `#7FFF00` | Accent terziario (dal logo) |
| `--text-primary` | `#FFFFFF` | Testo principale |
| `--text-secondary` | `#8A9E94` | Testo secondario |
| `--font-heading` | Space Grotesk | Titoli |
| `--font-body` | Inter | Corpo |
| `--radius` | `14px` / `8px` | Raggi |
| `--transition` | `0.3s cubic-bezier(0.4,0,0.2,1)` | Transizioni |

Presenti anche `--hero-top` / `--hero-bottom` (bianco → `#D6F5E3`), eredità della palette originaria, oggi **non più visibili**: l'hero è coperto dal canvas Vanta nero.

**Logo:** SVG inline nella navbar — ellisse con gradiente blu `#0066FF` → ciano `#00CCCC` → lime `#66FF00` e pupilla bianca, con `drop-shadow` smeraldo. Non è il logo del file PNG.

---

## 5. Inventario dei contenuti

### 5.1 Home
- Pill "Soluzioni AI su Misura"
- Headline: *"Flux AI — L'intelligenza che trasforma il tuo business"*
- Sottotitolo su soluzioni per professionisti e PMI
- 2 CTA funzionanti: `Scopri i Servizi` → Servizi, `Vedi Prodotti` → Prodotti
- 4 metriche **statiche e hardcoded** (nessun counter animato, nessuna fonte dati):
  €2.4M risparmiati · 1.240h automatizzate · 9.847 task completati · €48k risparmi medi/mese
- Sfondo Vanta.js Net: verde neon `#42ff3f` su nero, `points=8`, `maxDistance=25`, `spacing=16`, mouse e touch controls attivi
- Contenuto hero in `z-index:10` su pannello glassmorphism (`backdrop-filter: blur(8px)`)

### 5.2 Servizi Digitali — 5 servizi

| # | Servizio | Tecnologie | Prezzo | CTA |
|---|---|---|---|---|
| 1 | Creazione App Web | React, Node.js, Python, Claude API | Da €3.500 | Richiedi Preventivo ❌ |
| 2 | Trading Automatizzato | MetaTrader, Interactive Brokers, DeepSeek | Da €2.000 / €5.000 | Prenota Consulenza ❌ |
| 3 | Workflow Automation | n8n, Make, Zapier, Gmail, Slack | Da €1.200 | Automatizza Ora ❌ |
| 4 | Agenti AI Personalizzati | Claude, GPT-4, Knowledge Base, DB | Da €1.800 | Crea il Tuo Agente ❌ |
| 5 | Start-up & E-commerce | Shopify, Dropshipping AI, Email Marketing | Da €4.500 | Lancia il Tuo Business ❌ |

❌ = pulsante senza alcun handler.

### 5.3 Chi Siamo

**Ergest Troplini** — AI Engineer & Progettista Digitale
Bio: 5+ anni in sviluppo e progettazione di servizi digitali, specializzato in integrazione AI enterprise.
Expertise: AI Integration & LLM Engineering · Web Development (React, Node.js, Python) · Workflow Automation & RPA · Trading Systems & Financial Tech
Progetti citati: Studio Legale Abbiati · Costruzioni Troplini · PMI Manifatturiere · Liberi Professionisti
Social: LinkedIn, GitHub, Email — **tutti `href="#"`**

**Daniel Bottini** — Design Strategist & Innovation Lead
Bio: fusione di design computazionale e strategia digitale, Master in Progettazione di Interni.
Expertise: Design Thinking & UX Strategy · Computational Design (Rhino, Grasshopper) · Business Development & Go-to-Market · Product Management & Innovation
Progetti citati: Piattaforme SaaS · Agenzie Marketing · Start-up Digitali · Retail & E-commerce
Social: LinkedIn, Behance, Email — **tutti `href="#"`**

**Foto:** entrambe placeholder SVG con emoji (🔧 su fondo smeraldo, 🎨 su fondo ciano). Nessuna foto reale.

**Blocco missione / visione / valori:** presente e completo. Valori: Innovazione Pragmatica · Trasparenza Totale · ROI Misurabile · Partnership a Lungo Termine.

### 5.4 Prodotti — 5 prodotti

| Prodotto | Stato | Prezzo | CTA |
|---|---|---|---|
| POUFF Adaptive | ✅ Disponibile | €1.499/anno (o €149/mese) | Acquista Ora ❌ |
| POUFF Continuous | ✅ Early Bird | €2.499/anno (o €249/mese) | Acquista Ora ❌ |
| Pips.AI | 🚧 Beta Pubblica | €49/mese | Iscriviti alla Beta ❌ |
| Nexa | ⚙️ In Sviluppo | €79/mese (o €199/mese per team) | Unisciti alla Waitlist ❌ |
| ProntoClip | 🎥 MVP | Gratis per utenti (€29/mese professionisti) | Pre-registrati Ora ❌ |

### 5.5 Corsi — 3 percorsi

| Corso | Livello | Durata | Prezzo | CTA |
|---|---|---|---|---|
| AI Foundations | Principiante | 12h (4×3h) — 5 moduli | €450 + tutoring 1-to-1 | Iscriviti Ora ❌ |
| Content & Vision | Intermedio | 20h (5×4h) — 5 moduli | €750 + revisione progetti | Iscriviti Ora ❌ |
| Automation Architect | Avanzato | 40h (percorso mensile) | €1.200 + mentor diretto | Richiedi Colloquio ❌ |

**Solo tariffa "Libero Professionista".** La fascia Azienda (€250 / €400 / €650) e la tabella comparativa previste nelle specifiche **non sono in pagina**.

### 5.6 Footer
Brand + tagline · 4 social (YouTube, Instagram, Telegram, TikTok — tutti `href="#"`) · link rapidi a Servizi e Prodotti (funzionanti) · contatti founder:
- `ergest@flux-ai.it` (mailto attivo)
- `daniel@flux-ai.it` (mailto attivo)

**Sono gli unici due canali di contatto realmente funzionanti dell'intero sito.**

---

## 6. JavaScript: cosa è implementato

| Funzione | Stato | Note |
|---|---|---|
| `showSection()` — navigazione a tab | 🟢 Funziona | Toggle classe + `scrollTo` smooth |
| Custom cursor | 🟢 Funziona | Segue il mouse, stato `hovering` su elementi interattivi |
| IntersectionObserver reveal-on-scroll | 🟢 Funziona | Riapplicato a ogni cambio sezione |
| Hamburger menu mobile | 🟡 Fragile | Toggle inline `display` flex/none; non si resetta al resize |
| Init Vanta.js Net | 🟢 Funziona | Sotto guardia `if (window.VANTA)` |
| Form / validazione | 🔴 Assente | Nessun `<form>` nel documento |
| Routing / hash URL | 🔴 Assente | Nessuna sezione è linkabile né condivisibile |

Due listener `window load` separati (uno per `showSection('home')`, uno per Vanta). Funziona, ma è codice ridondante.

---

## 7. Problemi rilevati, in ordine di impatto

### 🔴 Critici — bloccano la conversione

**1. 13 call-to-action su 13 sono morte.**
Nessun `onclick`, nessun `href`, nessun event listener su: 5 CTA Servizi, 5 CTA Prodotti, 3 CTA Corsi. Un visitatore che vuole comprare POUFF Adaptive o iscriversi a un corso clicca e **non succede assolutamente nulla**. È il singolo problema più grave del sito.

**2. Nessun form di contatto.**
`<form>` = 0 nel documento. Il pulsante "Contattaci" della navbar rimanda alla sezione Servizi, che a sua volta non ha modo di raccogliere un contatto. Nessuna lead generation possibile.

**3. 10 link social non collegati.**
Tutti `href="#"`: 4 nel footer (YouTube, Instagram, Telegram, TikTok), 3 per Ergest (LinkedIn, GitHub, Email), 3 per Daniel (LinkedIn, Behance, Email).

### 🟡 Importanti — qualità e credibilità

**4. Bug HTML: `</div>` di troppo alla riga 1070** (sezione hero). Il body ha 107 `<div>` aperti e 108 chiusi. I browser lo tollerano, ma il markup non è valido.

**5. Foto founder mancanti.** Placeholder SVG con emoji al posto delle foto reali. Su una pagina "Chi Siamo" che vende fiducia, è la cosa che si nota per prima.

**6. Logo PNG inutilizzato.** `immagine logo.png` (1,79 MB) è versionato nel repo ma la pagina usa un SVG inline diverso. O si usa, o si toglie dal repo.

**7. Metriche hero non verificabili.** €2.4M risparmiati, 9.847 task completati, 1.240h automatizzate: numeri hardcoded senza fonte. Se un cliente li contesta non c'è modo di sostanziarli. Da sostituire con dati reali o rimuovere.

**8. Responsive minimo.** Una sola `@media (max-width: 768px)` contro i 4 breakpoint previsti (640 / 768 / 1024 / 1280). Le griglie tra 768px e 1280px non sono mai state calibrate.

**9. Custom cursor attivo anche su touch.** Nessun `@media (hover: hover)`: su mobile gli elementi del cursore restano nel DOM inutilmente.

### 🟢 Minori — igiene tecnica

**10. Accessibilità.** Zero `aria-label` a fronte di 14 link icon-only fatti solo di emoji: uno screen reader legge "🔗", "💻", "📺". Nessun focus state definito esplicitamente.

**11. SEO incompleta.** Presenti `title`, `description`, `og:title`, `og:description`, `og:type`. Mancano `og:image`, `twitter:card`, `canonical`, `meta keywords`, dati strutturati JSON-LD. Inoltre, essendo una SPA a tab senza routing, **Google indicizza di fatto solo la Home**: i contenuti di Prodotti e Corsi non hanno un URL proprio.

**12. Dipendenza CDN non pinnata.** `vanta@latest`: un aggiornamento upstream può rompere l'hero senza preavviso e senza modifiche da parte nostra. Da fissare a una versione esatta.

**13. Performance.** Zero `loading="lazy"` sulle immagini; nessuna minificazione; il PNG da 1,79 MB nel repo appesantisce ogni clone.

---

## 8. Discrepanze tra documentazione e codice

`contesto.md` (log del Prompt #5) elenca come completate alcune funzionalità che **nel codice non esistono**. Vanno considerate da fare, non fatte:

| Dichiarato in `contesto.md` | Realtà nel codice |
|---|---|
| ✅ "Parallax Scroll: foto founder e sezioni" | Nessun listener di scroll, nessun parallax |
| ✅ "Smooth transitions: fade out/in su cambio sezione" | Solo `display:none` / `block`, nessuna transizione |
| ✅ "Breathing animation foto founder idle" | Non presente |
| ✅ "Lazy loading immagini" | 0 occorrenze di `loading="lazy"` |
| ✅ "Responsività testata mobile/tablet/desktop" | 1 sola media query |
| "Tabella comparativa Professionista vs Azienda" (Corsi) | Non presente |
| "Prezzi Azienda €250 / €400 / €650" | Non presenti in pagina |
| "Konami code easter egg" (Prompt #4) | Rimosso nella riscrittura |
| "Matrix rain in verde-lime" (Prompt #4) | Rimosso nella riscrittura |
| "Sidebar destra con 3 CTA" (spec iniziale) | Mai implementata |
| "Accent Gold `#FFD700`" e "Flux Gradient" | Definiti come token, di fatto inutilizzati |

Nota: gli ultimi quattro punti riguardano scelte di design superate dal restyling — non sono regressioni, ma la documentazione non è stata allineata.

---

## 9. Deploy

Da `README_DEPLOYMENT.md`:

- **Repo:** https://github.com/ergesttroplini97-ops/Flux-AI
- **URL dichiarato:** https://ergesttroplini97-ops.github.io/Flux-AI
- **Source:** branch `main`, root `/` — auto-deploy a ogni push
- **Credenziali:** in `.env.local` locale, correttamente escluso da `.gitignore`. Nel README ci sono solo placeholder — **nessun token reale è finito nel repo**.

⚠️ **Non ho potuto confermare che il sito sia effettivamente online.** La rete in uscita dell'ambiente di analisi è filtrata e restituisce 403 sul tunnel proxy sia per `github.io` sia per `flux-ai.it`: è un limite dell'ambiente, non un segnale sullo stato del sito. **Da verificare aprendo l'URL dal browser.**

Due osservazioni sul README:
- I comandi usano il path Windows locale `C:/Users/erges/Desktop/Flux AI`, valido solo sulla macchina di Ergest.
- Il pattern `git push https://${GITHUB_TOKEN}@github.com/...` inserisce il token nella cronologia dei comandi della shell. Preferibile un credential helper o `gh auth`.

Il dominio `flux-ai.it` compare nelle email dei founder ma **non risulta configurato come custom domain** (nessun file `CNAME` nel repo).

---

## 10. Cosa fare, in ordine

### Priorità 1 — rendere il sito capace di convertire (~2-3 ore)
1. Collegare le 13 CTA. Soluzione più rapida: `mailto:` precompilate con oggetto specifico per prodotto/corso. Soluzione migliore: un form (Formspree / Netlify Forms) o un link Cal.com per le consulenze.
2. Aggiungere una sezione o modale **Contatti** con form nome / email / messaggio.
3. Sistemare il `</div>` di troppo alla riga 1070.

### Priorità 2 — credibilità (~1-2 ore)
4. Foto reali dei due founder al posto dei placeholder emoji.
5. Compilare i 10 link social o rimuovere quelli che non esistono ancora.
6. Sostituire le metriche hero con dati reali, oppure toglierle.

### Priorità 3 — qualità tecnica (~2-4 ore)
7. Aggiungere i breakpoint 640 / 1024 / 1280 e testare davvero su tablet.
8. `aria-label` su tutti i link icon-only + focus state visibili.
9. Pinnare Vanta a una versione esatta; aggiungere `og:image` e `canonical`.
10. Routing via hash (`#servizi`, `#prodotti`) per rendere le sezioni linkabili e indicizzabili.
11. Decidere se usare `immagine logo.png` o rimuoverlo dal repo.

### Priorità 4 — evoluzione
12. Fascia prezzi "Azienda" per i corsi + tabella comparativa.
13. Sezione case study / testimonianze (i progetti citati nelle bio meritano una pagina).
14. Custom domain `flux-ai.it` con file `CNAME`.
15. Valutare lo split in più file (`style.css`, `script.js`) se il progetto continua a crescere: 1.634 righe in un file singolo iniziano a pesare in manutenzione.

---

## 11. Note per chi riprende il lavoro

- **Il sito non ha build:** si modifica `index.html` e basta. Per l'anteprima locale c'è `.claude/launch.json` (live-server su :8080), oppure si apre direttamente il file.
- **Il CSS è tutto inline** tra le righe 14 e 987, organizzato con commenti `/* SECTION: ... */`. Usarli per orientarsi.
- **Aggiungere una sezione** richiede tre passi: un `<button class="nav-tab" data-section="X">` nella navbar, una `<section id="section-X" data-section="X">`, e il resto lo gestisce `showSection()`.
- **Attenzione al Vanta:** l'init è legato a `window load` e richiede che `#vanta-canvas` abbia dimensioni non nulle. Se si tocca il layout dell'hero, verificare che lo sfondo si carichi ancora.
- **`contesto.md` è la storia, `context.md` è lo stato.** Aggiornare questo file quando cambia il codice, quello quando arriva un nuovo prompt di direzione.

---

*Documento generato il 1 agosto 2026 — analisi condotta su `index.html` @ commit `dee3724`.*
