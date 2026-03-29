# 🚀 PROMPT RESTYLING: DergexAi → Flux AI

## 📋 OVERVIEW
Devi modernizzare completamente il sito web trasformandolo da **DergexAi** a **Flux AI**, mantenendo la qualità visiva esistente ma aggiornando struttura, contenuti e aggiungendo effetti cinematici avanzati.

---

## 🎯 MODIFICHE GLOBALI

### Rebranding
- **Nome**: Cambia tutti i riferimenti da "DergexAi" o "Dergex.Ai" a **"Flux AI"**
- **Logo**: Mantieni il logo attuale ma aggiorna il testo nell'HTML
- **Tagline**: "L'intelligenza che trasforma il tuo business"
- **URL e metadata**: Aggiorna title, meta description, og:tags con il nuovo brand

### Design System Aggiornato
Mantieni la palette emerald/scura esistente ma aggiungi:
```css
--flux-gradient: linear-gradient(135deg, #10B981 0%, #00C8FF 100%);
--flux-glow: rgba(16,185,129,0.2);
--accent-gold: #FFD700; /* per highlights premium */
```

---

## 📄 NUOVA STRUTTURA PAGINE

### 1️⃣ PAGINA: HOME (rimane simile ma aggiorna hero)
**Hero Section:**
- Titolo principale: "Flux AI — L'intelligenza che trasforma il tuo business"
- Sottotitolo: "Soluzioni AI su misura per professionisti e PMI. Automazioni, app intelligenti e crescita digitale."
- CTA primario: "Scopri i Servizi"
- CTA secondario: "Vedi Prodotti"

**Metriche Hero** (aggiorna i valori):
- €2.4M+ Risparmiati
- 1,240h Automatizzate
- 9,847 Task Completati
- 48k€/mese Risparmi Medi

---

### 2️⃣ PAGINA: SERVIZI DIGITALI
Crea una nuova pagina completa con **5 sezioni di servizi**:

#### Sezione 1: Creazione App Web
```
Titolo: "Applicazioni Web su Misura"
Descrizione: "Progettiamo e realizziamo applicazioni web innovative rivolte direttamente alle imprese. Soluzioni scalabili, sicure e integrate con AI."

Servizi inclusi:
- Web App personalizzate con AI integrata
- Dashboard aziendali intelligenti
- Sistemi di gestione proprietari
- Progressive Web Apps (PWA)
- Integrazione API e microservizi

Tecnologie: React, Node.js, Python, Claude API, GPT-4
Prezzo indicativo: Da €3.500
CTA: "Richiedi Preventivo"
```

#### Sezione 2: Consulenza Finanziaria & Trading AI
```
Titolo: "Trading Automatizzato con AI"
Descrizione: "Consulenza specializzata e sviluppo di sistemi di trading automatizzati integrati con intelligenza artificiale. Strategie quantitative e machine learning per il mercato finanziario."

Servizi inclusi:
- Analisi quantitativa e backtest
- Bot di trading personalizzati
- Integrazione con broker (MetaTrader, Interactive Brokers)
- Sistemi di risk management intelligenti
- Dashboard di monitoraggio real-time

Mercati supportati: Forex, Crypto, Azioni, Commodities
Prezzo indicativo: Da €2.000 (consulenza) | Da €5.000 (bot personalizzato)
CTA: "Prenota Consulenza"
```

#### Sezione 3: Automazione Flussi di Lavoro
```
Titolo: "Workflow Automation con AI"
Descrizione: "Automatizza processi ripetitivi e libera tempo prezioso. Integriamo strumenti come n8n, Make, Zapier con AI per creare automazioni intelligenti end-to-end."

Casi d'uso:
- Gestione email automatica (risposte, smistamento, follow-up)
- Automazione CRM e lead qualification
- Generazione automatica di report e documenti
- Integrazione multi-piattaforma (Google Workspace, Slack, Notion)
- Pipeline di onboarding clienti

ROI medio: 70% riduzione tempi operativi
Prezzo indicativo: Da €1.200
CTA: "Automatizza Ora"
```

#### Sezione 4: Agenti AI Personalizzati
```
Titolo: "Agenti AI Addestrati su Misura"
Descrizione: "Creiamo agenti conversazionali intelligenti addestrati sui tuoi dati e processi aziendali. Assistenti virtuali che capiscono il tuo business."

Funzionalità:
- Chatbot per assistenza clienti H24
- Agenti per qualificazione lead
- Assistenti interni per dipendenti
- Knowledge base intelligente
- Integrazione con database aziendali

Training: Documenti, FAQ, database proprietari
Piattaforme: Web, WhatsApp, Telegram, Slack
Prezzo indicativo: Da €1.800
CTA: "Crea il Tuo Agente"
```

#### Sezione 5: Start-up Digitali & E-commerce
```
Titolo: "Lancio Start-up & E-commerce AI"
Descrizione: "Supporto completo per lanciare la tua start-up digitale o e-commerce. Shopify, dropshipping, marketing automation e gestione vendite con AI."

Servizi:
- Setup completo Shopify + integrazioni
- Strategie dropshipping con AI per product research
- Automazione marketing (email, social, retargeting)
- Chatbot per conversione vendite
- Dashboard analytics avanzata

Pacchetto Start-up: Strategy + Setup + Automation
Prezzo indicativo: Da €4.500 (lancio completo)
CTA: "Lancia il Tuo Business"
```

**Layout Sezione Servizi:**
- Ogni servizio deve avere una card espandibile
- Icone SVG animate per ogni categoria
- Hover effect con glow emerald
- Modale con form contatto dedicato per ogni servizio

---

### 3️⃣ PAGINA: CHI SIAMO

#### Header Pagina
```
Titolo: "Il Team di Flux AI"
Sottotitolo: "Due founder, un'unica missione: portare l'intelligenza artificiale nelle mani di professionisti e imprese."
```

#### Founder 1: Ergest Troplini
```html
<div class="founder-card">
  <div class="founder-photo">
    <!-- Placeholder per foto con effetto parallax/hover -->
    <img src="ergest-troplini.jpg" alt="Ergest Troplini - AI Engineer & Progettista">
  </div>
  
  <div class="founder-info">
    <h3>Ergest Troplini</h3>
    <p class="founder-role">AI Engineer & Progettista Digitale</p>
    
    <p class="founder-bio">
      Con oltre 5 anni di esperienza nello sviluppo e progettazione di servizi digitali, 
      Ergest è specializzato nell'integrazione di intelligenza artificiale in soluzioni 
      enterprise. Ha lavorato a fianco di studi professionali, PMI e liberi professionisti, 
      sviluppando sistemi che hanno automatizzato migliaia di ore di lavoro manuale.
    </p>
    
    <h4>Expertise:</h4>
    <ul>
      <li>AI Integration & LLM Engineering</li>
      <li>Web Development (React, Node.js, Python)</li>
      <li>Workflow Automation & RPA</li>
      <li>Trading Systems & Financial Tech</li>
    </ul>
    
    <h4>Progetti Principali:</h4>
    <ul>
      <li><strong>Studio Legale Abbiati:</strong> Automazione gestione clienti e lead qualification con AI</li>
      <li><strong>Costruzioni Edili Troplini:</strong> Sistema preventivazione intelligente con analisi immagini AI</li>
      <li><strong>PMI Manifatturiere:</strong> Dashboard predittive per ottimizzazione produzione</li>
      <li><strong>Liberi Professionisti:</strong> Agenti AI per gestione appuntamenti e follow-up automatici</li>
    </ul>
    
    <h4>Collaborazioni:</h4>
    <p>Studi legali (Milano, Varese), PMI manifatturiere (Lombardia), 
    liberi professionisti settore consulenza, società edili.</p>
    
    <div class="founder-social">
      <!-- LinkedIn, GitHub, Email icons -->
    </div>
  </div>
</div>
```

#### Founder 2: Daniel Bottini
```html
<div class="founder-card">
  <div class="founder-photo">
    <img src="daniel-bottini.jpg" alt="Daniel Bottini - Design Strategist">
  </div>
  
  <div class="founder-info">
    <h3>Daniel Bottini</h3>
    <p class="founder-role">Design Strategist & Innovation Lead</p>
    
    <p class="founder-bio">
      Daniel porta in Flux AI una visione unica che fonde design computazionale e strategia 
      digitale. Con un Master in Progettazione di Interni tramite Rhino e una profonda 
      conoscenza di modellazione parametrica, applica principi di design thinking allo 
      sviluppo di prodotti digitali che uniscono estetica e funzionalità.
    </p>
    
    <h4>Expertise:</h4>
    <ul>
      <li>Design Thinking & UX Strategy</li>
      <li>Computational Design (Rhino, Grasshopper)</li>
      <li>Business Development & Go-to-Market</li>
      <li>Product Management & Innovation</li>
    </ul>
    
    <h4>Progetti Principali:</h4>
    <ul>
      <li><strong>Piattaforme SaaS:</strong> Design e strategia per app B2B nel settore costruzioni</li>
      <li><strong>Agenzie Marketing:</strong> Automazioni workflow creativi con AI</li>
      <li><strong>Start-up Digitali:</strong> Consulenza strategica su MVP e product-market fit</li>
      <li><strong>Retail & E-commerce:</strong> Sistemi di product visualization 3D con AI</li>
    </ul>
    
    <h4>Formazione:</h4>
    <p>Master in Progettazione di Interni (Rhino & Design Parametrico), 
    Certificazioni in Product Management, Design Sprint Facilitator.</p>
    
    <h4>Collaborazioni:</h4>
    <p>Studi di architettura, agenzie di comunicazione, start-up tech, 
    PMI settore retail e hospitality.</p>
    
    <div class="founder-social">
      <!-- LinkedIn, Behance, Email icons -->
    </div>
  </div>
</div>
```

#### Sezione Mission & Vision
```
Mission Statement:
"Rendiamo l'intelligenza artificiale accessibile a ogni professionista e impresa, 
trasformando la complessità tecnologica in strumenti concreti che liberano tempo, 
aumentano efficienza e creano valore misurabile."

Vision:
"Un futuro dove ogni business, grande o piccolo, ha accesso a soluzioni AI su misura 
che amplificano il potenziale umano invece di sostituirlo."

Valori:
- Innovazione Pragmatica
- Trasparenza Totale
- ROI Misurabile
- Partnership a Lungo Termine
```

**Effetti Cinematici Pagina Chi Siamo:**
- Foto founder con effetto parallax on scroll
- Hover sulle foto: zoom + glow emerald
- Animazione fade-in staggered per ogni sezione
- Background particles in movimento (subtle)

---

### 4️⃣ PAGINA: PRODOTTI

Crea una nuova pagina dedicata ai prodotti con layout a griglia.

#### Categoria 1: Bot di Trading AI

**Prodotto: POUFF - Adaptive**
```
Nome: POUFF Adaptive
Tagline: "Il bot che ragiona come un trader professionista"

Descrizione:
Sistema di trading automatizzato powered by DeepSeek, capace di analizzare mercati 
in real-time e adattare strategie in autonomia. Non segue solo regole fisse: 
ragiona, contestualizza, decide.

Caratteristiche:
✓ Integrazione DeepSeek per analisi contestuale
✓ Adattamento dinamico alle condizioni di mercato
✓ Multi-asset (Forex, Crypto, Azioni, Commodities)
✓ Risk management intelligente
✓ Dashboard real-time con insights AI
✓ Backtesting avanzato con simulazione storica

Mercati supportati: XAUUSD, BTCUSD, EURUSD, GBPUSD, SPY, altri su richiesta
Configurazione: Credenziali broker personali (MetaTrader, cTrader, IB)

Prezzo: €1.499 (licenza annuale) | €149/mese (abbonamento)
Status: ✅ Funzionante, pronto per configurazione

CTA: "Acquista Ora" | "Richiedi Demo"
```

**Prodotto: POUFF - Continuous Improvement**
```
Nome: POUFF Continuous Improvement
Tagline: "Machine learning che non smette mai di imparare"

Descrizione:
Versione avanzata che utilizza reinforcement learning per auto-migliorarsi 
continuamente. Ogni trade è un'opportunità di apprendimento. Si evolve 
con i tuoi obiettivi.

Caratteristiche:
✓ Machine Learning con reinforcement learning
✓ Auto-ottimizzazione parametri in real-time
✓ Apprendimento da performance storica
✓ Testing A/B automatico di strategie
✓ Report settimanali su performance e learning curve
✓ Rollback intelligente in caso di drift

Differenza vs Adaptive: Dove Adaptive "pensa", Continuous "impara"
Ideale per: Trader con strategie a lungo termine, portfolio diversificati

Prezzo: €2.499 (licenza annuale) | €249/mese (abbonamento)
Status: ✅ Funzionante, accesso early bird disponibile

CTA: "Acquista Ora" | "Confronta Versioni"
```

#### Categoria 2: App AI

**App 1: Pips.AI**
```
Nome: Pips.AI
Tagline: "Analisi di mercato innovativa, powered by AI"

Descrizione:
Non il solito aggregatore di notizie finanziarie. Pips.AI analizza sentiment, 
correlazioni nascoste, pattern macro-economici e ti offre insights azionabili 
prima che diventino mainstream.

Funzionalità:
• Sentiment analysis real-time da fonti multiple
• Correlazioni cross-asset inaspettate
• Alert su anomalie di mercato
• Analisi fondamentale automatizzata
• Previsioni basate su ML con confidence score
• Integrazione con TradingView e piattaforme broker

Target: Trader retail, analisti finanziari, gestori portfolio
Disponibilità: Web App + Mobile (iOS/Android)

Prezzo: €49/mese | €490/anno (2 mesi gratis)
Status: 🚧 Beta pubblica (Early Access)

CTA: "Iscriviti alla Beta" | "Vedi Demo"
```

**App 2: Nexa**
```
Nome: Nexa
Tagline: "L'intelligenza che agisce mentre tu decidi"

Descrizione:
La prima piattaforma di agenti AI che coordina le tue app e automatizza 
i flussi di lavoro del tuo ufficio in totale autonomia. Non più copia-incolla 
tra tool: Nexa è il tuo chief of staff digitale.

Funzionalità:
• Orchestrazione multi-app (Gmail, Calendar, Drive, CRM, Slack...)
• Workflow automation zero-code
• Agenti AI proattivi (es: "prepara meeting recap automatico")
• Task delegation intelligente
• Knowledge base aziendale interrogabile
• Template workflow per settori specifici

Casi d'uso:
- Gestione inbox e prioritizzazione
- Follow-up automatici post-meeting
- Generazione report da dati sparsi
- Onboarding clienti automatizzato

Target: Liberi professionisti, team 2-50 persone
Disponibilità: Web App (Desktop)

Prezzo: €79/mese (1 utente) | €199/mese (team fino a 10)
Status: 🚧 In sviluppo - Waitlist aperta

CTA: "Unisciti alla Waitlist" | "Vedi Roadmap"
```

**App 3: ProntoClip**
```
Nome: ProntoClip
Tagline: "Inquadra il problema, invia la clip. L'AI quantifica, il pro risponde."

Descrizione:
Hai un problema (idraulico, elettrico, legale, contabile)? Registra un video 
di 30 secondi, l'AI analizza, quantifica il lavoro necessario e ti mette in 
contatto con il professionista giusto che invia il preventivo. 
La soluzione è a portata di video.

Come funziona:
1. Cliente: Registra video-problema (es: perdita d'acqua, guasto, documento da revisionare)
2. AI: Analizza video, identifica issue, quantifica complessità
3. Matching: Trova professionista qualificato nella zona
4. Preventivo: Pro riceve clip + analisi AI, invia quotazione
5. Job done: Cliente accetta, pro interviene

Categorie servizi:
- Home services (idraulico, elettricista, ristrutturazioni)
- Servizi legali (revisione contratti, consulenze)
- Consulenza fiscale (commercialisti)
- IT support

Target: 
- B2C: Proprietari casa, piccole imprese
- B2B: Professionisti che vogliono lead qualificati

Disponibilità: Mobile App (iOS/Android)

Prezzo: 
- Utenti: Gratis (commissione su job completato)
- Professionisti: €29/mese + 8% commissione job

Status: 🚧 MVP in sviluppo - Pre-registrazioni aperte

CTA: "Pre-registrati Ora" | "Per Professionisti"
```

#### Layout Prodotti:
- Card prodotto con immagine/mockup hero
- Badge status (Disponibile, Beta, In Sviluppo)
- Pricing box prominente
- Demo video embedded o GIF animata
- Sezione FAQ per ogni prodotto
- Comparatore prodotti (per POUFF Adaptive vs Continuous)

---

### 5️⃣ PAGINA: CORSI

Header Pagina:
```
Titolo: "Formazione AI per Professionisti e Aziende"
Sottotitolo: "Smetti di perdere tempo in task ripetitivi. Impara a delegare all'intelligenza artificiale."
```

#### Corso 1: AI Foundations - Smart Workflow
```
Nome Corso: AI Foundations: Smart Workflow
Slogan: "Libera il tuo tempo, automatizza il tuo valore"

Descrizione:
Il punto di partenza per chi vuole smettere di perdere tempo in task ripetitivi. 
Corso pratico sull'integrazione di ChatGPT, Claude e automazioni base (Zapier/Make) 
nelle attività quotidiane di ufficio.

Programma:
• Modulo 1: AI Fundamentals (cosa può e non può fare l'AI oggi)
• Modulo 2: Prompt Engineering avanzato per documenti
• Modulo 3: Automazione email con AI (Gmail + GPT)
• Modulo 4: Workflow automation no-code (Zapier/Make basics)
• Modulo 5: Setup account e configurazione personale

Durata: 12 ore (4 sessioni da 3h)
Formato: Live online + registrazioni

Cosa include:
✓ Accesso a piattaforma e-learning con materiali
✓ Certificato di completamento
✓ Template workflow pronti all'uso
✓ 2 ore tutoring 1-to-1 (solo Liberi Professionisti)

Target: Liberi professionisti, freelance, piccoli studi

Prezzi:
• Libero Professionista: €450 (include 2h tutoring personalizzato)
• Aziende (>5 dipendenti): €250/persona (formazione gruppo + focus collaborazione)

CTA: "Iscriviti Ora" | "Scarica Programma PDF"
```

#### Corso 2: Content & Vision Masterclass
```
Nome Corso: Content & Vision Masterclass
Slogan: "Dall'inquadratura al preventivo in un click"

Descrizione:
Per chi vuole dominare il video e la comunicazione visiva con l'IA. 
Perfetto per chi userà ProntoClip o lavora con contenuti multimediali. 
Tecniche di video-analisi e creazione contenuti accelerata tramite 
Computer Vision e IA generativa.

Programma:
• Modulo 1: Computer Vision basics (come l'AI "vede")
• Modulo 2: Editing video veloce con AI tools
• Modulo 3: Preventivazione automatica da immagini/video
• Modulo 4: AI Generativa per contenuti visual (Midjourney, Runway)
• Modulo 5: Brand digitale e social media automation

Durata: 20 ore (5 sessioni da 4h)
Formato: Live online + workshop pratici

Cosa include:
✓ Software licenses (trial estesi per tool AI)
✓ Revisione settimanale progetti personali (solo Liberi Prof.)
✓ Case study aziendali reali (Aziende)
✓ Certificato di completamento

Target: Content creator, marketing manager, professionisti servizi visivi

Prezzi:
• Libero Professionista: €750 (include revisione progetti settimanale)
• Aziende (>5 dipendenti): €400/persona (workshop su casi studio aziendali)

CTA: "Iscriviti Ora" | "Richiedi Info"
```

#### Corso 3: Automation Architect
```
Nome Corso: Automation Architect
Slogan: "Costruisci il tuo sistema, l'IA farà il resto"

Descrizione:
Il percorso avanzato per trasformare un'attività in una macchina automatizzata. 
Creazione di workflow complessi che collegano CRM, pagamenti, assistenza clienti 
senza intervento umano. Sviluppo di GPT aziendali custom e architetture end-to-end.

Programma:
• Settimana 1: Analisi processi e workflow mapping
• Settimana 2: Automazioni CRM avanzate
• Settimana 3: Custom GPTs aziendali (training su dati proprietari)
• Settimana 4: Integrazione pagamenti e assistenza automatizzata
• Settimana 5: Deploy, testing e ottimizzazione

Durata: 40 ore (percorso mensile intensivo)
Formato: Live + 1-to-1 mentoring + project work

Cosa include:
✓ Accesso mentor diretto per tutto il mese (solo Liberi Prof.)
✓ Analisi e ottimizzazione flussi aziendali specifici (Aziende)
✓ Setup infrastruttura automation
✓ Certificato Automation Architect
✓ 3 mesi supporto post-corso

Target: Imprenditori, manager operativi, responsabili processi

Prezzi:
• Libero Professionista: €1.200 (percorso "Mentor" con accesso diretto docente)
• Aziende (>5 dipendenti): €650/persona (analisi flussi specifici azienda)

CTA: "Richiedi Colloquio" | "Vedi Syllabus Completo"
```

#### Sezione Comparativa
```
Tabella: "Perché scegliere i nostri corsi?"

| Caratteristica | Libero Professionista | Azienda (>5 dip.) |
|----------------|----------------------|-------------------|
| Approccio | Sartoriale: analizziamo il tuo caso | Scalabile: ottimizziamo il team |
| Prezzo | Standard (tariffa piena) | Scontato -40/50% |
| Supporto | Tutoring 1-to-1 incluso | Supporto tecnico di gruppo |
| Focus | Massimizzazione produttività singola | Workflow collaborativi |

ROI medio post-corso:
- AI Foundations: 15h/mese risparmiate
- Content & Vision: 40% faster content production
- Automation Architect: 70% riduzione task manuali
```

#### Layout Pagina Corsi:
- Hero con video testimonial partecipanti
- Card corso con badge difficoltà (Beginner, Intermediate, Advanced)
- Calendario sessioni prossime in partenza
- Sezione FAQ generale sui corsi
- Form iscrizione inline o modale
- Countdown per early bird pricing

---

## 🎬 EFFETTI CINEMATICI DA IMPLEMENTARE

### 1. Parallax Scroll sulle Immagini
```javascript
// Foto founder, hero images, product mockups
// Effetto: immagine si muove più lenta dello scroll
window.addEventListener('scroll', () => {
  const scrolled = window.pageYOffset;
  document.querySelectorAll('.parallax-img').forEach(img => {
    img.style.transform = `translateY(${scrolled * 0.5}px)`;
  });
});
```

### 2. Reveal on Scroll Animations
```css
.fade-in-up {
  opacity: 0;
  transform: translateY(40px);
  transition: opacity 0.8s ease, transform 0.8s ease;
}
.fade-in-up.visible {
  opacity: 1;
  transform: translateY(0);
}
```
Applicare a: titoli sezioni, card prodotti, testimonial

### 3. Hover Effects con Glow Dinamico
```css
.product-card:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 0 20px 60px rgba(16,185,129,0.3);
}
.product-card:hover img {
  filter: brightness(1.1) saturate(1.2);
}
```

### 4. Foto Founder con Effetti Speciali
- **Idle state**: leggera animazione breathing (scale 1.0 → 1.02)
- **Hover**: zoom smooth + bordo glow emerald pulsante
- **Parallax**: foto si muove opposta al cursore (effetto magnetico)

```javascript
founderCard.addEventListener('mousemove', (e) => {
  const rect = founderCard.getBoundingClientRect();
  const x = (e.clientX - rect.left - rect.width/2) / 20;
  const y = (e.clientY - rect.top - rect.height/2) / 20;
  founderImg.style.transform = `translate(${-x}px, ${-y}px) scale(1.05)`;
});
```

### 5. Video Background (opzionale)
Per Hero section: loop di particelle/network o coding terminal simulato

### 6. Smooth Page Transitions
```javascript
// Fade out/in quando si cambia tab/pagina
function smoothTransition(targetSection) {
  document.body.style.opacity = 0;
  setTimeout(() => {
    showSection(targetSection);
    document.body.style.opacity = 1;
  }, 300);
}
```

---

## 🔗 SOCIAL & COLLEGAMENTI

Aggiungi sezione footer espansa con icone social:

```html
<div class="social-links">
  <a href="#" class="social-icon" aria-label="YouTube">
    <!-- SVG YouTube icon -->
  </a>
  <a href="#" class="social-icon" aria-label="Instagram">
    <!-- SVG Instagram icon -->
  </a>
  <a href="#" class="social-icon" aria-label="Telegram">
    <!-- SVG Telegram icon -->
  </a>
  <a href="#" class="social-icon" aria-label="TikTok">
    <!-- SVG TikTok icon -->
  </a>
</div>
```

Stile icone:
- Cerchio con bordo emerald
- Hover: riempimento gradiente + glow
- Smooth transition

---

## 📐 LINEE GUIDA TECNICHE

### Performance
- Lazy loading immagini: `<img loading="lazy" />`
- Preload font critici
- Minify CSS/JS
- Ottimizza immagini (WebP con fallback)

### Responsive
- Mobile-first approach
- Breakpoints: 640px, 768px, 1024px, 1280px
- Hamburger menu mobile già presente, mantenerlo

### Accessibilità
- Alt text su tutte le immagini
- ARIA labels su pulsanti/link icon-only
- Contrast ratio WCAG AA minimum
- Focus states visibili

### SEO
```html
<title>Flux AI — Soluzioni AI per Professionisti e PMI | Automazioni, App, Trading Bot</title>
<meta name="description" content="Flux AI offre soluzioni di intelligenza artificiale su misura: app web, bot di trading, automazioni workflow, agenti AI e corsi per professionisti.">
<meta name="keywords" content="AI, intelligenza artificiale, automazioni, trading bot, app AI, corsi AI, workflow automation">
```

---

## ✅ CHECKLIST FINALE

Prima di consegnare, verifica:

- [ ] Tutti i riferimenti "DergexAi" → "Flux AI"
- [ ] 5 pagine funzionanti: Home, Servizi, Chi Siamo, Prodotti, Corsi
- [ ] Effetti cinematici implementati e smooth
- [ ] Foto founder con placeholder e istruzioni posizionamento
- [ ] Social links con icone SVG
- [ ] Form contatto/iscrizione funzionanti (o mock pronti per backend)
- [ ] Responsive testato su mobile/tablet/desktop
- [ ] Custom cursor funzionante
- [ ] Animazioni canvas (hero, statistics) operative
- [ ] Tutte le CTA collegate a sezioni/modali corrette
- [ ] Prezzi e informazioni prodotti/corsi complete
- [ ] Footer aggiornato con nuovo brand e info founder

---

## 🚀 OUTPUT ATTESO

**File da generare:**
1. `index.html` — File completo con tutte le pagine integrate
2. `README.md` — Istruzioni installazione e note sviluppo
3. (Opzionale) `assets/` folder con SVG icons custom

**Struttura HTML:**
- Navigation con link a: Home | Servizi | Chi Siamo | Prodotti | Corsi | Contatti
- Ogni pagina come `<section id="section-name" class="section">`
- Sistema di tab navigation esistente mantenuto e ampliato

**Consegna:**
File HTML single-page application pronto per deploy su:
- Netlify
- Vercel
- Aruba hosting
- GitHub Pages

---

## 💡 NOTE FINALI

- **Tono di voce**: Professionale ma accessibile, evita gergo tecnico eccessivo
- **Copywriting**: Focus su benefici concreti, non feature astratte
- **Visual hierarchy**: Chiara separazione tra sezioni, uso strategico di whitespace
- **Trust signals**: Menzioni di collaborazioni con studi legali, PMI (come già in bio founder)
- **Proof elements**: Metriche reali nella hero, case study nei servizi

**Questo è un rebrand completo, non un semplice aggiornamento.** 
Flux AI deve sentirsi come un prodotto nuovo, più maturo, più enterprise-ready ma sempre approachable per il libero professionista.

---

**Fine del prompt. Buon lavoro! 🚀**
