# Media generativi e video AI — Flux AI

Due binari. Il **Binario A** è già nel sito e funziona oggi. Il **Binario B** è la pipeline
per sostituire (o affiancare) le scene generative con veri video AI, quando li avrete.

---

## Binario A — cosa c'è già nel sito

Tre media generati dal browser a runtime. Nessun file video, zero byte di rete.

| # | Dove | Cosa | Costo |
|---|---|---|---|
| 1 | Hero | **Iris** — fragment shader WebGL2: occhio wireframe del logo, wormhole poligonale, lo scroll apre l'occhio | 4,7 KB GLSL |
| 2 | Metodo | **Console viva** — pipeline fatture che lavora da sola: contatori, grafico, log con timestamp reali | ~2 KB JS |
| 3 | Showreel | **Player reale** con 4 clip generate via canvas, scrubber, capitoli, tastiera | ~9 KB JS |

Tutti e tre si fermano fuori viewport e a tab nascosta, e rispettano
`prefers-reduced-motion` mostrando un frame statico.

**Onestà obbligatoria.** Queste non sono clip: sono scene renderizzate. Non possono fare
fotorealismo — niente volti, luoghi o materiali reali. Il badge dice *"Generato in tempo
reale"* e la didascalia sotto il player dichiara che nessun modello text-to-video è
coinvolto. Non toglieteli: sono ciò che rende la cosa una dimostrazione di competenza
invece di un bluff.

---

## Binario B — veri video AI

### 1. Quali modelli

> ⚠️ Verificate prima di comprare crediti: prezzi, versioni e termini di uso commerciale
> di questi servizi cambiano in fretta e non sono stati verificati in fase di scrittura.

**Non usate text-to-video puro per un brand.** La strada giusta è **image-to-video**:
generate prima un fotogramma fisso perfettamente on-brand, approvatelo, e solo dopo
animatelo. Costa meno, itera più veloce, e soprattutto garantisce coerenza cromatica fra le
clip — che è l'unica cosa che fa sembrare cinque clip parte dello stesso showreel.

| Passo | Strumenti | Note |
|---|---|---|
| Fotogramma chiave | FLUX 1.1 Pro, Midjourney, Ideogram, Imagen | Centesimi a immagine |
| Animazione | **Kling** (qualità/prezzo su i2v), **Veo** (resa più cinematografica), **Runway** (controllo camera preciso), **Luma** (keyframe inizio/fine → loop davvero invisibile) | |
| Iterazione gratis | LTX-Video, Wan, HunyuanVideo in locale | Iterate qui, rifinite sul servizio a pagamento |

**Consiglio operativo:** iterate gratis in locale finché la composizione non convince, poi
rigenerate le 3-5 clip finali in alta qualità. Budget realistico per un pacchetto finito:
**50-200 €** più mezza giornata di lavoro.

La funzione **keyframe start/end di Luma** è la più preziosa per questo progetto: dando lo
stesso frame come inizio e fine ottenete un loop perfetto senza trucchi di montaggio.

### 2. Cinque prompt pronti

In inglese: tutti i modelli rendono nettamente meglio in inglese. Il glossario cromatico è
ripetuto in ogni prompt di proposito — è quello che tiene insieme il set.

**1 — Loop di sfondo (latent space)**
```
Abstract macro cinematography of a volumetric neural network suspended in absolute darkness.
Thousands of luminous filaments flow slowly through empty space, converging into soft glowing
nodes, then dispersing. Color palette strictly: electric blue #2F6BFF, cyan #19D6D0, and
bright lime #C8F04A accents, on a near-black #05060A background. Extremely slow lateral
camera drift, shallow depth of field, volumetric light, subtle bokeh, film grain.
Seamless loop, first and last frame identical. No text, no logos, no people.
Style: premium tech brand film, dark, elegant, understated. 8 seconds, 24fps.
Negative: text, watermark, faces, hands, saturated rainbow colors, purple, orange, red, warm
tones, fast motion, camera shake, lens flare, low resolution, jpeg artifacts, distorted geometry.
```

**2 — Occhio wireframe (il marchio)**
```
A geometric low-poly wireframe eye — almond/lens shaped, built from concentric polygonal rings
receding into a tunnel of infinite depth. The mesh glows with a gradient running left to right:
deep blue #2F6BFF into cyan #19D6D0 into lime #C8F04A. Background: near-black #05060A with
slow drifting particles. Camera very slowly pushes forward into the pupil while the rings
rotate gently in opposite directions. Volumetric glow, thin luminous edges, digital holographic
feel, subtle chromatic aberration. Seamless loop.
Negative: realistic human eye, eyelashes, skin, iris texture, blood vessels, text, watermark,
horror, uncanny, warm colors, red, orange.
```

**3 — B-roll di prodotto**
```
Cinematic b-roll of a futuristic dark-mode software interface floating in 3D space. Translucent
glass panels showing line charts drawing themselves, counters incrementing, log rows streaming.
Accent colors cyan #19D6D0 and lime #C8F04A on charcoal #0A0C12 surfaces. Slow parallax dolly
from left to right, shallow depth of field, panels drifting at different depths, soft reflections.
Clean, minimal, keynote aesthetic. No readable text, glyphs only. 8 seconds, 24fps.
Negative: real text, lorem ipsum, readable words, logos of real companies, cluttered UI, bright
white background, stock-photo people, hands typing, keyboards, mouse.
```

**4 — Stinger di transizione (2 secondi)**
```
A single pulse of energy travels across frame from left to right: a thin horizontal line of
cyan #19D6D0 light expands, fractures into a lattice of blue #2F6BFF triangles, then collapses
back into darkness. Pure black background #05060A. High contrast, motion blur on the leading
edge, particles trailing behind. 2 seconds, very fast, snappy easing. Loopable.
Negative: text, logo, slow motion, warm colors, explosion, fire, smoke, debris.
```

**5 — Image-to-video dal logo** (input: `logo-flux.svg` rasterizzato, o `immagine logo.png`)
```
Animate this wireframe eye logo: the concentric polygonal layers rotate slowly around the
central axis at different speeds, creating a hypnotic tunnel-of-depth effect. The blue-to-cyan-
to-lime gradient shimmers and flows along the mesh edges like current through a circuit. The
small white four-pointed star pulses gently once every 3 seconds. Camera locked, absolutely
static. Preserve the exact shape, proportions and colors of the source image — no redesign,
no reinterpretation. 6 seconds, seamless loop.
Negative: redesign, different logo, added elements, text, morphing into another object, color
shift, warping the outline, background change, camera movement.
```

### 3. Specifiche di consegna

| Parametro | Loop di sfondo | Showreel / b-roll |
|---|---|---|
| Durata | 8-12 s (sotto gli 8 s il loop si nota) | 15-30 s |
| Risoluzione | 1600×900 basta: è sfocato e sotto un velo scuro | 1920×1080 |
| fps | 24 o 25 — a 30 sembra un video di sorveglianza | 24 |
| Audio | **rimosso** (`-an`) | traccia separata, opzionale |
| Codec | AV1 → VP9 → H.264, in quest'ordine nei `<source>` | idem |
| Budget file | **≤ 2,5 MB** per 10 s. Se sfora, riducete la risoluzione, non il bitrate | ≤ 8 MB |

**Su AV1:** comprime il 30-50% meglio di H.264, ma la decodifica hardware manca su molti
dispositivi ancora in circolazione, e in software brucia batteria. Mettetelo per primo, ma
tenete **sempre** H.264 come ultima scelta: è l'unica garanzia universale.

### 4. ffmpeg

```bash
# --- LOOP INVISIBILE — metodo A: boomerang (il più affidabile sul materiale astratto)
ffmpeg -i clip.mp4 -filter_complex \
  "[0:v]split[a][b];[b]reverse[r];[a][r]concat=n=2:v=1[v]" \
  -map "[v]" -an loop_src.mp4

# --- LOOP INVISIBILE — metodo B: crossfade coda su testa (clip 8s, fade 0.8s)
ffmpeg -i clip.mp4 -filter_complex \
  "[0:v]trim=0:0.8,setpts=PTS-STARTPTS[head]; \
   [0:v]trim=start=7.2,setpts=PTS-STARTPTS[tail]; \
   [tail][head]xfade=transition=fade:duration=0.8:offset=0[mix]; \
   [0:v]trim=0.8:7.2,setpts=PTS-STARTPTS[body]; \
   [body][mix]concat=n=2:v=1[v]" \
  -map "[v]" -an loop_src.mp4

# --- AV1
ffmpeg -i loop_src.mp4 -an -c:v libsvtav1 -crf 34 -preset 6 -g 120 \
  -pix_fmt yuv420p -movflags +faststart hero-v1.av1.mp4

# --- VP9 / WebM
ffmpeg -i loop_src.mp4 -an -c:v libvpx-vp9 -crf 34 -b:v 0 -row-mt 1 -g 120 \
  -pix_fmt yuv420p -deadline good -cpu-used 2 hero-v1.vp9.webm

# --- H.264 (rete di sicurezza universale)
ffmpeg -i loop_src.mp4 -an -c:v libx264 -profile:v high -crf 24 -preset slow -g 120 \
  -pix_fmt yuv420p -movflags +faststart hero-v1.h264.mp4

# --- POSTER (deve corrispondere ESATTAMENTE al frame 0)
ffmpeg -i loop_src.mp4 -vf "select=eq(n\,0),scale=1280:-2" -frames:v 1 \
  -c:v libwebp -quality 72 hero-v1.webp
```

Tre regole non negoziabili:
- `-movflags +faststart` — senza, il video non parte finché non è scaricato tutto.
- `-pix_fmt yuv420p` — senza, Safari mostra nero.
- **Nomi versionati** (`hero-v1`, `hero-v2`) — così potete mettere `Cache-Control: immutable`
  per un anno.

### 5. Dove ospitarli — mai nel repo

Ogni push di un binario resta **per sempre** nella storia git: cinque video da 2 MB
rigenerati quattro volte fanno 40 MB permanenti. Vietato.

| Opzione | Verdetto |
|---|---|
| **Cloudflare R2** + dominio custom | ✅ **Raccomandato.** Egress gratuito: nessuna sorpresa in fattura se un video diventa virale. CDN globale inclusa |
| Bunny.net (Storage + Pull Zone) | ✅ Ottima alternativa, pannello semplice, forte in Europa |
| Backblaze B2 + Cloudflare | ✅ Valido, ma due servizi invece di uno |
| Cloudflare Stream / Mux | ❌ Sovradimensionati per 5 loop da 10 s |
| YouTube / Vimeo embed | ❌ Iframe pesantissimo, branding altrui, tracker di terze parti, CLS — e vi riporta il banner cookie |
| jsDelivr / GitHub Releases | ❌ Fuori dai termini d'uso per media in produzione |

**Setup R2:** bucket → dominio `cdn.flux-ai.it` →
`Cache-Control: public, max-age=31536000, immutable` (sicuro grazie ai nomi versionati).
CORS non serve: un `<video>` senza attributo `crossorigin` non è soggetto a CORS.

⚠️ Ricordate di aggiungere il dominio del CDN a `media-src` nella CSP di `vercel.json`:
oggi è `default-src 'self'` e bloccherebbe il video.

### 6. Il componente `<flux-media>`

Stessa API per il video reale e per il fallback generativo. Togliendo gli attributi `src-*`
lo stesso identico markup usa la scena procedurale: potete spedire oggi e aggiungere i video
quando ci sono, senza toccare il layout.

```html
<flux-media scene="iris" ratio="16/9"
    poster="https://cdn.flux-ai.it/m/hero-v1.webp"
    src-av1="https://cdn.flux-ai.it/m/hero-v1.av1.mp4"
    src-vp9="https://cdn.flux-ai.it/m/hero-v1.vp9.webm"
    src-h264="https://cdn.flux-ai.it/m/hero-v1.h264.mp4"></flux-media>
```

Cascata decisionale:

1. `prefers-reduced-motion` → solo poster statico, nessun byte scaricato
2. `saveData` o connessione 2g/3g → scena generativa (0 byte invece di 2,5 MB)
3. Nessun `src-*` → scena generativa
4. Altrimenti: `<video>` creato **solo** quando entra a 250px dal viewport
5. `error`, `stalled`, o `readyState < 3` dopo 6 secondi → distrugge il video, monta la scena
6. Fuori viewport → `pause()`: la decodifica video è la cosa più costosa in una pagina

L'implementazione è in `src/flux-media.js` (non inclusa nella build finché non servono i
video: si aggiunge alla lista in `build.mjs`).

---

## Dove mettere i media — e dove no

La regola che tiene su tutto: **un solo media in movimento continuo visibile alla volta**.

| Sezione | Cosa | Perché |
|---|---|---|
| Hero | Iris (shader) | Il primo respiro del sito: ipnotico ma silenzioso |
| Metodo | Console viva | Il pezzo che vende: trasforma un'affermazione in una dimostrazione |
| Showreel | Player, **non in autoplay** | L'utente decide di guardarlo; finché non clicca il costo è zero |
| Servizi | **Niente** | Qui si legge e si valuta un prezzo: qualunque movimento sottrae attenzione |
| Prodotti, Corsi | **Niente** | Chi guarda un listino da 1.200 € vuole chiarezza, non spettacolo |
| Studio | **Niente** | Le persone si presentano con le facce. Un'astrazione AI accanto a due fondatori reali suona finta |
| Footer | **Niente** | È in fondo a tutto: girerebbe sempre |

Tre media in tredici sezioni, di cui **uno solo** parte da solo. È la soglia sotto cui un
sito sembra costoso invece che pacchiano.

---

## Obblighi di legge

**AI Act, art. 50** — i contenuti sintetici ricadono negli obblighi di trasparenza. Se
pubblicherete veri video generati da AI, vanno **etichettati come tali**. Il badge
"Generato in tempo reale" del player non è decorazione: è il pattern giusto, mantenetelo e
adattatelo ("Generato con AI") quando i video saranno veri.

Verificate inoltre i **termini di uso commerciale** del fornitore che sceglierete: cambiano
spesso e non sono tutti uguali. Alcuni impongono watermark o vietano l'uso pubblicitario nei
piani più economici.
