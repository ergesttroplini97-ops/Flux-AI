# Flux AI — Contesto Progetto Sito Web

> Questo file viene aggiornato progressivamente ad ogni nuovo prompt ricevuto.
> Serve come memoria condivisa tra sessioni per costruire un sito web coerente e unico.

---

## 🏢 Identità del Brand

- **Nome agenzia:** Flux AI *(precedentemente Dergex.Ai)*
- **Tagline:** L'intelligenza che trasforma il tuo business
- **Fondatori:** Ergest Troplini & Daniel Bottini
- **Posizionamento:** Agenzia di soluzioni AI avanzate e personalizzate per professionisti e PMI
- **Focus:** Soluzioni concrete, misurabili, adottabilità immediata, ROI tangibile

---

## 🎨 Linee Guida di Design

### Analisi Logo (`immagine logo.png`)
Il logo è un **occhio geometrico wireframe** con effetto di profondità tunnel:
- **Forma:** Eye/mandorla con struttura poligonale a strati concentrici (effetto wormhole/profondità)
- **Gradiente colore:** Blu profondo (sinistra) → Ciano/Turchese (centro) → Verde-Giallo luminoso (punta destra)
- **Stile:** Low-poly / wireframe mesh 3D — evoca visione, intelligenza, percezione AI, dati
- **Sfondo logo:** Blu-grigio scuro (#1a2035 circa)
- **Dettaglio:** Piccola stella a 4 punte bianca in basso a destra (firma stilistica)
- **Messaggio:** "Vediamo ciò che gli altri non vedono" — perfetto per un'agenzia AI
- **Colori dominanti logo:** `#0066FF` (blu), `#00CCCC` (ciano), `#66FF00` (verde-lime), `#CCFF00` (giallo-lime)

### Analisi Stile Sito Riferimento (`Esempio stile sito web .jpeg`)
Il sito di riferimento mostra un'estetica **SaaS premium moderna**:

**Navbar:**
- Sfondo quasi nero/dark (#0D0D0D)
- Logo piccolo a sinistra + nome brand
- Tab di navigazione centrate: Workflow | Statistics | Articles
- CTA "Get started" in alto a destra — bottone con bordo arrotondato (outline style)

**Hero Section:**
- Sfondo: gradiente da bianco puro → lavanda/viola chiaro (#E8E0FF circa) verso il basso
- Pill/badge "Our workflow" centrato in alto (bordo sottile, testo piccolo)
- Headline enorme e bold: *"How our platform makes your workflow easier"*
- Font: Sans-serif molto large, peso 700-800, colore quasi nero
- Dashboard mockup visibile nella parte bassa (dark card con "Welcome back, Anan!", "Total balance", "Monthly income")

**Sidebar/Card destra:**
- Card dark con titolo "Link Your Accounts" + testo descrittivo
- Stile glassmorphism o card solida scura

**Palette colori definitiva per Dergex.Ai:**
| Elemento | Colore |
|----------|--------|
| Navbar background | `#0A0A0E` |
| Hero bg (top) | `#FFFFFF` |
| Hero bg (bottom) | `#D6F5E3` (verde smeraldo chiaro) |
| Accent primario | `#10B981` (verde smeraldo — Emerald 500) |
| Accent profondo | `#059669` (verde smeraldo scuro — Emerald 600) |
| Glow / highlight | `#34D399` (verde smeraldo luminoso — Emerald 400) |
| Accent secondario | `#00C8FF` (ciano — dal logo) |
| Accent terziario | `#7FFF00` (lime — dal logo) |
| Testo scuro | `#0A0A14` |
| Testo chiaro | `#FFFFFF` |
| Card background | `#0D1F17` (dark con tonalità verde) |
| Border sottile | `#1A3A2A` (verde scurissimo) |

**Font definitivi:**
- Headings: `'Sora'` o `'Space Grotesk'` (bold, moderno, tech)
- Body: `'Inter'` (leggibilità massima)

**Stile definitivo:** Navbar dark + Hero bianco/verde smeraldo chiaro + gradiente verso dark nelle sezioni successive. Il verde smeraldo come colore primario evoca crescita, tecnologia, affidabilità. I colori ciano/lime del logo si integrano naturalmente nella palette green-tech.

- **Responsive:** Ottimizzato desktop + mobile

---

## 🗂️ Struttura del Sito (Tab di navigazione)

### 1. Visuo (Home)
- Panoramica del valore di Dergex.Ai
- Headline: *"Come la nostra piattaforma rende il tuo flusso di lavoro più facile"*
- Metriche chiave: Totale risparmiato, Risparmio mensile (dati demo)
- Hero section accattivante con CTA principale

### 2. Workflow
- Integrazione nei flussi di lavoro aziendali
- Servizi principali:
  - Sviluppo app web e mobile con AI
  - Siti web ottimizzati SEO con GPT
  - Automazione RPA dei processi ripetitivi
  - Chatbot e assistenti virtuali intelligenti
- Emphasis su: risparmio di tempo, aumento produttività, facilità di adozione

### 3. Statistics
- Statistiche risultati clienti (aumento fatturato, ore risparmiate, soddisfazione clienti)
- Grafici, icone e visualizzazioni dati
- Dati impattanti e facilmente leggibili

### 4. Articles
- Sezione blog con articoli AI applicata al business
- Anteprime: titolo, immagine, riassunto
- Link al blog completo

---

## 📌 Sidebar Destra (Call-to-Action)

| CTA | Scopo |
|-----|-------|
| 🔗 "Collega i tuoi account" | Sincronizzare dati e strumenti aziendali |
| 💬 "Ottieni assistenza" | Contatto per consulenza |
| ⭐ "Guarda le testimonianze" | Feedback e case study clienti |

---

## 🧠 Direttive per il Programmatore (Prompt Tecnico)

> Questo è il prompt da usare per implementare il sito come se fosse **unico e firmato da uno sviluppatore esperto**:

```
You are a senior full-stack developer and UI/UX designer specializing in modern AI-focused brand websites.

Build a complete, production-ready single-page website for **Dergex.Ai**, an AI solutions agency founded by Daniel Bottini and Ergest Troplini.

### Technical Stack:
- Pure HTML5 + CSS3 + Vanilla JS (no frameworks, no dependencies)
- Self-contained single file (all CSS and JS inline)
- Fully responsive (mobile-first approach)
- Dark theme as default, with smooth micro-animations

### Visual Identity (AGGIORNATA da analisi immagini):
- Navbar background: #0A0A0E (nero quasi puro)
- Hero section: gradiente bianco (#FFFFFF) → verde smeraldo chiaro (#D6F5E3)
- Sezioni corpo: transizione verso dark (#0A0A0E) con tonalità verdi
- Accent primario: #10B981 (verde smeraldo — Emerald 500)
- Accent profondo: #059669 (verde smeraldo scuro — Emerald 600)
- Glow / highlight: #34D399 (verde smeraldo luminoso — Emerald 400)
- Accent ciano: #00C8FF (dal logo — unico differenziatore)
- Accent lime: #7FFF00 (dal logo — per highlights tecnici)
- Testo su dark: #FFFFFF primario, #8888A0 secondario
- Testo su light: #0A0A14 primario
- Cards: #111118 con border #2A2A3A
- Logo file: `immagine logo.png` — occhio wireframe gradiente blu→ciano→lime
- Typography: 'Space Grotesk' (headings, bold), 'Inter' (body, UI)

### Unique Design Signatures (make it stand out):
1. Navbar dark con logo occhio wireframe — transizione fluida al white hero
2. Hero bianco/verde smeraldo con headline gigante bold, pill badge "I nostri servizi"
3. Il gradiente del logo (blu→ciano→lime) riutilizzato come accent sui bordi di card e CTA, con glow smeraldo sui bottoni principali
4. Animated wireframe eye SVG come background decorativo della hero (CSS animation)
5. Glassmorphism cards nelle sezioni dark
6. Metric counters animati con colori ciano e lime alternati
7. Navigation tabs con underline indicator animato in viola
8. Custom cursor: piccolo occhio che segue il mouse (riferimento al logo)
9. Smooth scroll + Intersection Observer fade-in
10. Effetto "matrix rain" in verde-lime dietro le statistics (sottile, non invasivo)

### Structure (navigation tabs):
1. **Visuo** (Home) — Hero, value proposition, animated metrics dashboard
2. **Workflow** — Service cards with icons, step-by-step process flow
3. **Statistics** — Animated counters, bar/line charts (pure CSS or canvas)
4. **Articles** — Blog preview grid with hover effects

### Sidebar (right side on desktop, bottom on mobile):
- "Collega i tuoi account" CTA button
- "Ottieni assistenza" CTA button
- "Guarda le testimonianze" CTA button
- Each with unique icon and subtle hover animation

### Code Quality:
- Semantic HTML5 elements throughout
- BEM-like CSS class naming
- Modular JS functions
- Performance optimized (lazy loading, no blocking resources)
- Leave clearly labeled /* SECTION: */ comments for each major block
- Add a subtle Easter egg (e.g., Konami code triggers a fun animation)

Deliver a single .html file that feels like a premium $10,000 agency website, not a template.
Make every pixel intentional. The design should whisper "we built AI before it was cool."
```

---

## 📁 Asset Disponibili

| File | Utilizzo |
|------|----------|
| `immagine logo.png` | Logo principale del brand |
| `Esempio stile sito web .jpeg` | Riferimento visivo per stile e layout |

---

## 📝 Log dei Prompt Ricevuti

### Prompt #1 — 25 Marzo 2026
**Contenuto:** Definizione della struttura generale del sito, sezioni (Visuo, Workflow, Statistics, Articles), linee guida design (nero/bianco/viola), sidebar con CTA, brand identity (fondatori, nome, posizionamento), direttiva su file `contesto.md` da aggiornare progressivamente.

**Azioni intraprese:**
- Creazione del file `contesto.md` con tutto il contesto strutturato
- Generazione del prompt tecnico per sviluppatore esperto

---

### Prompt #2 — 25 Marzo 2026
**Contenuto:** Analisi delle immagini fornite nella cartella — logo (`immagine logo.png`) e stile sito (`Esempio stile sito web .jpeg`).

**Analisi Logo:**
- Occhio geometrico wireframe low-poly con gradiente blu→ciano→lime
- Piccola stella a 4 punte bianca in basso a destra
- Evoca: visione artificiale, intelligenza, percezione AI
- I colori del logo (ciano #00C8FF e lime #7FFF00) diventano accent distintivi del sito

**Analisi Stile Sito:**
- Navbar dark (#0A0A0E) + Hero bianco/lavanda (gradient down)
- Headline gigante bold centrata
- Pill badge per le sezioni
- Dashboard mockup dark card nella hero
- Sidebar card "Link Your Accounts" in stile dark
- Font: sans-serif pesante per headings
- CTA "Get started" in navbar — outline rounded button

**Aggiornamenti apportati:**
- Palette colori completamente ridefinita con i valori esatti da entrambe le immagini
- Prompt tecnico aggiornato con identità visiva precisa
- Design signatures riviste per includere il logo occhio animato e i colori ciano/lime

---

### Prompt #3 — 25 Marzo 2026
**Contenuto:** Cambio colore principale del sito da lavanda/viola a verde smeraldo.

**Aggiornamenti apportati:**
- Hero bg (bottom): da `#EDE8FF` (lavanda) → `#D6F5E3` (verde smeraldo chiaro)
- Accent primario: da `#6B46FF` (viola) → `#10B981` (Emerald 500)
- Aggiunti Emerald 600 (#059669) come tono profondo ed Emerald 400 (#34D399) come glow
- Card background aggiornato con tonalità verde (#0D1F17)
- Border aggiornato a verde scurissimo (#1A3A2A)
- Prompt tecnico aggiornato con nuova palette
- Tutti i riferimenti "lavanda" → "verde smeraldo"

---

*Ultimo aggiornamento: 25 Marzo 2026 — Prompt #3*
### Prompt #4 — 25 Marzo 2026
**Contenuto:** Generazione del sito web completo (`index.html`) leggendo il file `contesto.md`.

**File generato:** `index.html` (7.2 MB — logo embedded in base64)

**Caratteristiche implementate:**
- Navbar dark con logo embedded + tab navigazione (Visuo, Workflow, Statistics, Articles) + CTA "Inizia ora"
- Sezione Visuo: hero con gradiente bianco→verde smeraldo, headline bold, pill badge, dashboard mockup animato, metriche con counter animati (€2.4M risparmiati, €48K mensili, 1240h, 9847 task)
- Sezione Workflow: 6 service card con glassmorphism, process flow step 01→05
- Sezione Statistics: 6 stat card con counter animati, grafico a barre orizzontali per settore, matrix rain background in verde-lime
- Sezione Articles: 4 article card con hover effects, gradient image placeholder
- Fixed sidebar: 3 CTA button con expand-on-hover (Collega account / Ottieni assistenza / Guarda testimonianze)
- Footer: brand + link + fondatori Daniel Bottini & Ergest Troplini
- Custom cursor con glow smeraldo
- Canvas animazione particle/network hero section
- Konami code easter egg (↑↑↓↓←→←→BA)
- Responsive mobile con hamburger menu
- Palette completa verde smeraldo (#10B981, #059669, #34D399) + ciano e lime dal logo

---

*Ultimo aggiornamento: 29 Marzo 2026 — Prompt #5*

### Prompt #5 — 29 Marzo 2026
**Contenuto:** Restyling completo da DergexAi a Flux AI + integrazione Vanta.js Net animato.

**REBRANDING COMPLETO:**
- Nome: DergexAi → **Flux AI**
- Tagline: "L'intelligenza che trasforma il tuo business"
- Meta title: "Flux AI — L'intelligenza che trasforma il tuo business"
- Meta description: "Soluzioni AI su misura per professionisti e PMI..."
- Logo: mantenuto occhio wireframe, testo aggiornato a "Flux AI"
- Navbar: 5 tab (Home, Servizi, Chi Siamo, Prodotti, Corsi)

**STRUTTURA PAGINE (4 sezioni → 5 sezioni):**

1. **Home** (ex-Visuo)
   - Hero title: "Flux AI — L'intelligenza che trasforma il tuo business"
   - Sottotitolo: "Soluzioni AI su misura per professionisti e PMI. Automazioni intelligenti, app web, bot di trading..."
   - CTA primaria: "Scopri i Servizi" | CTA secondaria: "Vedi Prodotti"
   - 4 metriche: €2.4M Risparmiati | 1,240h Automatizzate | 9,847 Task Completati | €48k/mese Risparmi Medi
   - **EFFETTO VANTA.JS NET**: Rete verde neon (#42ff3f) interattiva su sfondo nero
     - CDN Three.js + Vanta Net
     - Parametri: points=8, maxDistance=25, spacing=16
     - Interattività: mouseControls=true, touchControls=true
     - z-index: contenuto hero con z-index=10 per leggibilità

2. **Servizi Digitali** (ex-Workflow → 5 servizi)
   - Creazione App Web (€3.500) — React, Node.js, Python, Claude API
   - Trading Automatizzato (€2.000-€5.000) — MetaTrader, Interactive Brokers, DeepSeek
   - Workflow Automation (€1.200) — n8n, Make, Zapier, Gmail, Slack
   - Agenti AI Personalizzati (€1.800) — Claude, GPT-4, Knowledge Base
   - Start-up & E-commerce (€4.500) — Shopify, Dropshipping AI, Email Marketing
   - Layout: card espandibili con hover glow emerald
   - Icone emoji, descrizioni, tecnologie, prezzi, CTA

3. **Chi Siamo** (ex-Statistics → Team + Mission/Vision)
   - Header: "Il Team di Flux AI"
   - 2 Founder Cards (side-by-side, stack mobile):
     - **Ergest Troplini**: AI Engineer & Progettista Digitale
       - Bio: 5 anni esperienza AI enterprise
       - Expertise: AI Integration, Web Dev, Workflow Automation, Trading Systems
       - Progetti: Studio Legale Abbiati, Costruzioni Troplini, PMI Manifatturiere
       - Social: LinkedIn, GitHub, Email
     - **Daniel Bottini**: Design Strategist & Innovation Lead
       - Bio: Master Progettazione Interni, design computazionale
       - Expertise: Design Thinking, Computational Design, Business Development, Product Management
       - Progetti: Piattaforme SaaS, Agenzie Marketing, Start-up, E-commerce
       - Social: LinkedIn, Behance, Email
   - Foto placeholder SVG con animazione hover (zoom + glow)
   - Mission/Vision/Valori section con background card

4. **Prodotti** (NUOVO)
   - 5 prodotti totali:
     - POUFF Adaptive (€1.499/anno | €149/mese) ✅ Disponibile
       - Bot di trading con DeepSeek, adattamento dinamico
     - POUFF Continuous (€2.499/anno | €249/mese) ✅ Early Bird
       - Machine learning con reinforcement learning
     - Pips.AI (€49/mese | €490/anno) 🚧 Beta Pubblica
       - Analisi di mercato con sentiment analysis
     - Nexa (€79/mese | €199/mese) 🚧 In Sviluppo
       - Chief of staff digitale, automazione workflow
     - ProntoClip (Gratis utenti | €29/mese professionisti) 🚧 MVP
       - Video-preventivo, matching AI professionisti
   - Badge status (Disponibile/Beta/In Sviluppo)
   - Layout: card prodotto con pricing prominente

5. **Corsi** (NUOVO)
   - AI Foundations - Smart Workflow (€450 professionista | €250 aziende)
     - 12 ore, 4 sessioni, 5 moduli, include tutoring 1-to-1
   - Content & Vision Masterclass (€750 professionista | €400 aziende)
     - 20 ore, 5 sessioni, workshop creativi
   - Automation Architect (€1.200 professionista | €650 aziende)
     - 40 ore, percorso mensile intensivo, 1-to-1 mentoring
   - Badge livello (Principiante/Intermedio/Avanzato)
   - Tabella comparativa Professionista vs Azienda

**PALETTE COLORI (Mantenuta):**
- Emerald 500: #10B981 (primario)
- Emerald 600: #059669 (profondo)
- Emerald 400: #34D399 (glow)
- Cyan: #00C8FF (da logo)
- Lime: #7FFF00 (da logo)
- **Aggiunto**: Flux Gradient (135deg, #10B981 → #00C8FF)
- **Aggiunto**: Accent Gold (#FFD700)

**EFFETTI CINEMATICI:**
- ✅ Vanta.js Net: Rete verde neon interattiva nella Hero
- ✅ Parallax Scroll: Foto founder e sezioni
- ✅ Reveal on Scroll: Fade-in staggered con IntersectionObserver
- ✅ Hover Glow: Box-shadow emerald su card (services, products, courses)
- ✅ Hover Zoom: translateY(-8px) scale(1.02)
- ✅ Custom Cursor: Glow emerald, hovering effect
- ✅ Smooth Transitions: Fade out/in su cambio sezione
- ✅ Breathing Animation: Foto founder idle state

**FOOTER AGGIORNATO:**
- Brand info con tagline "L'intelligenza che trasforma il tuo business"
- 4 social link: YouTube, Instagram, Telegram, TikTok
- Info founder con email
- Link a sezioni del sito
- Copyright © 2026 Flux AI

**FILE GENERATI/MODIFICATI:**
- ✅ Cartella: "Dergex.Ai Srl" → "Flux AI"
- ✅ index.html: Completamente riscritto
  - ~1.600 righe di codice
  - HTML5 + CSS3 (inline) + JS (inline)
  - No external frameworks, only CDN libraries
- ✅ Librerie CDN:
  - Google Fonts (Space Grotesk, Inter)
  - Three.js r134 (Vanta.js dependency)
  - Vanta Net (background animation)
- ✅ contesto.md: Aggiornato (questo log)

**RESPONSIVE & PERFORMANCE:**
- Mobile-first approach
- Breakpoints: 768px (tablet), default (desktop)
- Hamburger menu per mobile
- Lazy loading immagini
- Canvas ottimizzato (Vanta.js)
- SEO-friendly: Meta tag completi

**VERIFICA:**
- ✅ Navigazione tra 5 tab funzionante
- ✅ Vanta.js caricato e animato (verde neon interattivo)
- ✅ Custom cursor funzionante
- ✅ Hover effects visibili su tutte le card
- ✅ Contenuto leggibile sopra Vanta.js (z-index=10)
- ✅ Responsività testata (mobile/tablet/desktop)
- ✅ SEO meta tag aggiornati

---

*Ultimo aggiornamento: 29 Marzo 2026 — Prompt #5*
