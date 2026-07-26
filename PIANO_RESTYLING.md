# Piano di restyling — Flux AI

> Documento di riferimento del rifacimento completo del sito.
> Redatto durante il lavoro, non a posteriori: contiene le decisioni prese,
> il *perché*, e ciò che resta da fare con chi deve farlo.

---

## 0. In una pagina

| | Prima | Dopo |
|---|---|---|
| Architettura | SPA a 5 tab con `display:none` | Long-scroll a 13 sezioni con ancore |
| URL indicizzabili | 1 | 1 pagina + 13 ancore condivisibili (fase 2: pagine separate) |
| Modo di contattare | 2 `mailto:` nel footer | Form completo + endpoint serverless + email |
| Peso librerie esterne | ~600 KB (Three.js + Vanta) | **0 KB** |
| Richieste a terze parti | 4 domini (2 CDN + 2 Google Fonts) | **0** |
| Logo | PNG 1,8 MB | SVG 4,7 KB |
| Font | 9 file da Google Fonts | 7 file auto-ospitati e sottoinsiemizzati, 128 KB |
| Peso pagina | 57 KB + 600 KB di CDN | 176 KB totali, **46 KB gzip** |
| Palette | Emerald Tailwind (assente nel logo) | Blu/ciano/lime, estratti dal logo |
| Metriche in home | 4 numeri dichiarati "demo" | 4 impegni verificabili |
| Cursore custom | Sì (`cursor:none`, rompe il touch) | Rimosso |
| `prefers-reduced-motion` | Non gestito | Gestito su 3 livelli |
| Avvertenza rischio trading | Assente | Presente e collegata da ogni prodotto |

---

## 1. Metodo di lavoro

Il restyling è stato pianificato da **quattro agenti specializzati in parallelo** —
direzione artistica, ingegneria del movimento e WebGL, media generativi, contenuti e
backend — e poi sottoposto a **tre giri di revisione** con agenti dedicati a design,
correttezza del codice, accessibilità e prestazioni.

Dove i piani si contraddicevano ha deciso il criterio più forte:

| Conflitto | Decisione | Motivo |
|---|---|---|
| Canvas 2D vs fragment shader WebGL per la hero | **Shader WebGL2** | Stesso peso (zero), risultato molto superiore, e il fallback CSS copre chi non lo supporta |
| GSAP + ScrollTrigger + Lenis vs zero dipendenze | **Zero dipendenze** | Verificato: cdnjs e unpkg sono irraggiungibili da questo ambiente (403). Una libreria che non posso né scaricare né testare è un rischio, non un aiuto. E i veti della direzione artistica (niente scroll-jacking, niente pin, niente split-char, niente cursore custom) toglievano a GSAP quasi tutto il lavoro |
| Satoshi (Fontshare) come font display | **Geist** | Fontshare è bloccato. Geist è su Google Fonts, è una superfamiglia disegnata insieme al suo mono, ed è più adatta al registro "ingegnerizzato" del brand |
| Griglia di card per i servizi | **Lista comparabile** | Cinque servizi con prezzo sono un elenco da confrontare in colonna; la griglia distruggeva il confronto |

---

## 2. Le sette decisioni che contano

### 2.1 Via la navigazione a tab

Le cinque sezioni erano nascoste da `showSection()` con `display:none`. Conseguenze reali:
non si poteva mandare a un cliente il link ai Prodotti, Google vedeva una pagina sola con
un solo `<title>`, e ogni click rifaceva `querySelectorAll` su tutto il documento
riscrivendo stili inline su ogni card.

Ora: long-scroll con ancore vere (`#servizi`, `#prodotti`, …), scroll-spy in navbar,
`content-visibility: auto` sulle sezioni sotto la piega per non pagare il rendering di
ciò che non si vede.

**Fase 2, quando ci saranno 3-4 mesi di dati in Search Console:** spaccare in pagine reali
(`/servizi/workflow-automation`, `/prodotti/pouff-adaptive`, …), una per intento di ricerca.
La sitemap ha già i segnaposto commentati.

### 2.2 La palette viene dal logo, non da Tailwind

Il sito era costruito su `#10B981 / #059669 / #34D399` — Emerald 500/600/400 di Tailwind,
copiati verbatim. Un verde che nel logo non esiste, e che il mercato ha imparato a
riconoscere come "sito generato".

Il logo è blu → ciano → lime. La palette ora è quella, con regole d'uso rigide:

- **Blu `#2F6BFF`** — strutturale: bordi, tratti, dati. Mai fill di bottone (con testo scuro
  fa 4,50:1, con testo chiaro 3,98:1: non funziona in nessuna delle due direzioni).
- **Ciano `#19D6D0`** — l'unico colore interattivo. Link, hover, bordi attivi, focus.
- **Lime `#C8F04A`** — il fuoco. Tre usi ammessi: lo stato attivo corrente, la CTA primaria
  della schermata, il valore su cui è puntato il cursore. **Mai più di un elemento lime
  visibile alla volta.** È il vincolo che più di ogni altro fa sembrare il sito costoso:
  la scarsità produce valore percepito.
- Il gradiente del logo esiste in **una sola istanza in tutta la pagina**: l'occhio della hero.
  Riusarlo su bordi, testi e bottoni è ciò che rende un gradiente economico.

I neutri hanno tutti un bias blu (hue OKLCH ≈ 270), non sono grigi puri: è quello che fa
leggere il fondo come *scelto* invece che *ereditato*.

### 2.3 La hero è il logo

Un fragment shader WebGL2 su **un singolo triangolo fullscreen** (nessun buffer, nessun
attributo: i vertici nascono da `gl_VertexID`) ricostruisce l'occhio del marchio: vesica
low-poly, wormhole poligonale a 14 segmenti che scorre verso lo spettatore, gradiente
blu→ciano→lime mappato sull'asse orizzontale, pupilla che si dilata quando il puntatore si
avvicina, e la stellina a quattro punte del logo disegnata come astroide.

**Lo scroll non fa scorrere la pagina: apre l'occhio.** L'uniform `uScroll` allarga la
vesica, accelera il viaggio nel tunnel e contrae la pupilla.

Costa 4,7 KB di GLSL e zero richieste di rete. Sostituisce Three.js r134 + Vanta NET:
~600 KB per l'effetto di sfondo più abusato del settore, per giunta di un verde
(`#42ff3f`) che non era in nessuna palette del progetto.

Protezioni: qualità adattiva che misura gli fps reali e scala la risoluzione fra 0,55× e 1×,
stop del loop fuori viewport e a tab nascosta, gestione di `webglcontextlost`, e fallback a
gradienti CSS se WebGL2 manca o è emulato via software.

### 2.4 I numeri dovevano essere veri

`contesto.md` dichiarava che *€2,4 M risparmiati / 1.240 h / 9.847 task / €48k al mese*
erano **dati demo**. Pubblicarli come risultati reali è una pratica commerciale ingannevole
(art. 21 Cod. Consumo) e, con quei numeri, il primo cliente che chiede il caso studio vi
mette in difficoltà.

Sostituiti con impegni che potete difendere in call: **3 settimane** al primo processo in
produzione, **~4 ore** richieste a voi, **fino al 70%** di riduzione sul processo
automatizzato, **30 giorni** di correzioni incluse.

Un numero con un nome accanto vale più di quattro numeri senza.

### 2.5 Il rischio trading va dichiarato

Flux AI vende software di trading ma non è un intermediario finanziario. Serviva
un'avvertenza esplicita ai sensi del D.Lgs. 58/1998 (TUF) e della direttiva 2014/65/UE
(MiFID II): è ora in fondo alla pagina, in una sezione dedicata (`#rischio`), ed è
collegata da ogni card e da ogni pannello prodotto che tocca il trading.

### 2.6 Zero terze parti, quindi zero banner cookie

Il sito non caricava cookie, ma chiamava `fonts.googleapis.com`, `fonts.gstatic.com`,
`cdnjs.cloudflare.com` e `cdn.jsdelivr.net`: quelle richieste trasmettono l'IP dell'utente
a soggetti terzi extra-SEE, ed è esattamente lo scenario delle condanne sui Google Fonts.

I font sono ora auto-ospitati e sottoinsiemizzati ai caratteri realmente usati (latino +
accenti italiani + simboli tipografici e valuta): da 287 KB a **128 KB**, sette file.
Le librerie non ci sono più. Risultato: nessuna richiesta a terze parti, CSP `default-src
'self'` che regge davvero, e **nessun banner cookie dovuto** — serve comunque una cookie
policy che dichiari "solo cookie tecnici, nessuna profilazione".

Geist e Instrument Serif sono sotto SIL OFL 1.1, che consente esplicitamente subset e
ridistribuzione (`fonts/OFL.txt`).

### 2.7 I "video AI", con onestà

La richiesta era "video generati da AI". Non è stato possibile generare veri file video in
questa lavorazione. La risposta è a due binari, e il primo è dichiarato per quello che è:

**Binario A — realizzato.** Tre media generativi, renderizzati dal browser a runtime,
zero byte di rete:
1. **L'occhio della hero** — lo shader descritto sopra.
2. **La console viva** (sezione Metodo) — una pipeline di elaborazione fatture che lavora
   da sola: contatori, grafico che si disegna, log con timestamp reali. È il pezzo che
   *vende*: "€ risparmiati" scritto in un box è un'affermazione, visto scorrere in una
   console che lavora diventa una dimostrazione.
3. **Lo showreel** — un player vero (play/pausa, scrubber trascinabile, capitoli,
   timecode, tastiera) in cui ogni clip è una scena generata via canvas. In pausa il rAF è
   completamente fermo: 0% CPU.

Il badge dice **"Generato in tempo reale"** e sotto c'è scritto che nessun modello
text-to-video è coinvolto. Per un'agenzia AI questo è più forte di un mp4 scaricato — ma
solo se è dichiarato.

**Binario B — pronto, da alimentare.** Quando genererete le clip vere, il componente
`<flux-media>` (documentato in `docs/media-ai.md`) accetta `src-av1` / `src-vp9` /
`src-h264` e usa il video se c'è, il generativo se manca, senza toccare il layout.
Nel documento trovate anche i 5 prompt pronti per i modelli, le specifiche di consegna
(durata, codec, bitrate, loop invisibile, poster) e i comandi ffmpeg.

⚠️ **AI Act, art. 50:** i contenuti sintetici ricadono negli obblighi di trasparenza. Se
pubblicherete veri video generati da AI, vanno etichettati come tali.

---

## 3. Il sistema di design

Tutto in `src/01-tokens.css`, niente valori sparsi nel codice.

**Tipografia** — Geist (400/500/700/900) per display, UI e corpo; Geist Mono per numeri,
prezzi ed etichette tecniche; Instrument Serif italic come **unico accento editoriale, una
sola parola per sezione**, quella umana dentro un titolo tecnico. Scala fluida a 8 step con
`clamp()`, in cui il tracking decresce al crescere del corpo, da `+0.14em` (micro) a
`-0.045em` (display): è una curva continua, non tre valori a caso.

**Movimento** — la firma non è *slide-and-fade*, è **la messa a fuoco**: gli elementi
arrivano sfocati e appena più grandi (`blur(6px) scale(1.012)`) e si risolvono in 640ms con
`cubic-bezier(.16,1,.30,1)`. Nessun `translateY` sul testo, mai. Stagger di 60ms
raggruppato per riga visiva, con tetto a 6 gruppi.

**Divieti espliciti**, scritti nei commenti del codice perché sopravvivano alla prossima
modifica: mai `transition: all`; mai `overflow-x: hidden` sul body per nascondere un bug di
layout; mai `<button onclick>` al posto di un link; niente emoji come iconografia (c'è uno
sprite di 24 icone SVG a tratto 1,5px); niente raggi oltre 12px; niente glassmorphism
dietro il testo della hero.

---

## 4. Accessibilità

Non è una voce di coda: sono correzioni di bug.

- **Rimosso il cursore custom.** `cursor: none` sul `body` senza guardia `@media (pointer: fine)`
  faceva sparire il cursore nativo su touch lasciando due pallini fermi a 0,0. In più
  scriveva `style.left/top` su ogni `mousemove`: due layout invalidati per evento.
- `prefers-reduced-motion` gestito su tre livelli: blocco CSS globale, WebGL a frame singolo,
  loop canvas che non parte.
- Skip link, `:focus-visible` su ogni elemento interattivo (con l'anello di focus trattato
  come momento di brand, non come ripiego del browser), navigazione da tastiera completa
  su rail prodotti e showreel, `aria-live` sugli stati del form.
- Contrasti verificati: testo primario 17,3:1, secondario 7,6:1. Il terziario (3,3:1) è
  ammesso solo su meta e disabilitati, **mai** su testo corrente.
- Gerarchia dei titoli corretta, landmark, tabella corsi con `<th scope>` e `<caption>`.

---

## 5. Lead capture e infrastruttura

Il buco più costoso del sito precedente: il pulsante "Contattaci" in navbar cambiava tab.
Non esisteva alcun modo di contattare Flux AI a parte due `mailto:` nel footer.

Ora: form a 7 campi (4 obbligatori) con validazione progressiva — il campo si valida
all'uscita, e solo dopo essere stato segnalato passa alla validazione live: chi sta ancora
scrivendo l'email non vede errori rossi. Le CTA di servizio, prodotto e corso preselezionano
il campo *interesse*.

Backend: **una Vercel Function `/api/lead`** (stessa origine del sito, quindi niente CORS e
nessuna chiave esposta), che scrive su Supabase in UE e notifica via Resend con `reply_to`
sull'email del lead. Zero dipendenze npm. Honeypot fuori schermo (non `display:none`, che i
bot moderni riconoscono) più time-trap; rate limiting a due livelli; IP mai in chiaro, solo
`HMAC-SHA256`. Se Supabase non è configurato, l'endpoint salta il database e manda solo
l'email: si può andare online oggi e aggiungere il database domani.

Costo a regime: **0 €/mese** fino a ~100 lead al mese.

---

## 6. Cosa resta da fare — con chi lo deve fare

### Bloccanti prima di pubblicare — Ergest

1. **Dati societari.** Ragione sociale, P.IVA e sede mancano nel footer e nel form: non è
   GDPR, è art. 2250 c.c. e D.Lgs. 70/2003. Cercate `data-fill` nel sorgente.
2. **Spostare il dominio da GitHub Pages a Vercel.** GitHub Pages non esegue funzioni
   serverless: finché il sito sta lì, il form non può funzionare.
3. **Creare il progetto Supabase in `eu-central-1`** e applicare
   `supabase/migrations/0001_leads.sql`. Fuori dall'UE i dati escono dallo SEE.
4. **Le tre pagine legali**: `/privacy`, `/cookie-policy`, `/termini`. Il testo
   dell'avvertenza sul rischio è già in pagina e va replicato in `/termini`.
5. **Verificare i due casi studio.** Studio Legale Abbiati e Costruzioni Troplini sono
   citati con numeri: serve l'autorizzazione scritta di entrambi.

### Alta priorità — Daniel

6. **Le foto dei fondatori.** Al loro posto c'è un segnaposto generativo dichiarato.
   Trattamento previsto: duotone con ombre blu e alte luci ciano, che si dissolve sul
   colore pieno all'hover. Meglio un segnaposto onesto che una foto stock, ma le facce
   servono: su un professionista di provincia quella sezione pesa più dello stack tecnologico.
7. **L'immagine Open Graph** (1200×630). Senza, ogni condivisione su LinkedIn è un
   rettangolo grigio.
8. **Le icone PWA** — `favicon.ico`, `apple-touch-icon` 180, `icon-192`, `icon-512`,
   `maskable-512`. Generatele dall'**SVG**, non dal PNG da 1,8 MB.

### Quando ci sarà tempo

9. Veri video AI secondo il Binario B (`docs/media-ai.md`).
10. Analytics senza cookie (Vercel Web Analytics o Plausible EU) per misurare la profondità
    di scroll e capire dove si fermano.
11. Split in pagine reali per intento di ricerca (§2.1).
12. Un secondo caso studio raccontato per intero: converte più di dieci loghi.

---

## 7. Come si lavora su questo sito

```bash
node build.mjs          # assembla src/* in index.html
npx http-server -p 8099 # serve in locale (i font via file:// sono bloccati da CORS)
```

`index.html` è **generato**: modificatelo e la prossima build cancella tutto. Si tocca solo
`src/`. L'output è committato nel repo, quindi il deploy resta statico e chi pubblica non
deve eseguire nulla.

```
src/
  00-fonts.css      @font-face dei font auto-ospitati
  01-tokens.css     palette, tipografia, spaziatura, movimento — la fonte di verità
  02-base.css       reset, tipografia, focus, reveal, reduced-motion
  03-components.css bottoni, chip, card, form, contatore
  04-sections.css   una sezione per blocco, nell'ordine della pagina
  05-form.css       form lead
  page.html         markup del corpo
  form.html         markup del form
  head.html         meta, Open Graph, JSON-LD
  icons.svg         sprite di 24 icone
  iris.frag         il fragment shader della hero
  app.js            tutto il comportamento, zero dipendenze
```
