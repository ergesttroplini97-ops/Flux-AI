/* ============================================================================
   BUILD — assembla src/* in un unico index.html statico.
   Nessuna dipendenza npm. Si esegue con:  node build.mjs
   L'output e committato nel repo, quindi il deploy resta statico: chi mette
   online il sito non deve eseguire nulla.
   ========================================================================= */
import { readFileSync, writeFileSync } from 'node:fs';
import { execSync } from 'node:child_process';

const read = (p) => readFileSync(new URL(p, import.meta.url), 'utf8');

const CSS = [
  '01-tokens.css', '00-fonts.css', '02-base.css',
  '03-components.css', '04-sections.css', '05-form.css'
].map((f) => read(`./src/${f}`)).join('\n');

/* Il logo compare piu volte (navbar, footer). L'id del suo linearGradient va
   reso unico a ogni inserimento, altrimenti il documento ha id duplicati e
   il secondo gradiente non risolve. */
const logoSrc = read('./logo-flux.svg')
  .replace(/ role="img"| aria-label="[^"]*"/g, '');
let logoN = 0;
const logo = () => {
  const id = 'fluxEye' + (logoN++ || '');
  return logoSrc.replaceAll('fluxEye', id);
};

let body = read('./src/page.html')
  .replace(/__LOGO_SVG__/g, () => logo())
  .replace('__CONTACT_FORM__', read('./src/form.html'));

const icons = read('./src/icons.svg');
const frag  = read('./src/iris.frag');
const js    = read('./src/app.js');
const seo   = read('./src/head.html');

const html = `<!doctype html>
<html lang="it">
<head>
${seo.trim()}
<style>
${CSS}
</style>
</head>
<body>
${icons.trim()}
${body.trim()}

<script type="x-shader/x-fragment" id="iris-frag">
${frag.trim()}
</script>
<script>
${js}
</script>
</body>
</html>
`;

writeFileSync(new URL('./index.html', import.meta.url), html);

/* ---------------------------------------------------------------- PAGINE
   Documenti legali e ringraziamento. Stesso design system, chrome minimo:
   la checkbox di consenso del form puntava a /privacy, che restituiva 404 —
   far accettare un'informativa inesistente e un problema, non un link rotto. */
const PAGES = [
  ['privacy',       'Informativa privacy'],
  ['cookie-policy', 'Cookie policy'],
  ['termini',       'Termini e avvertenze'],
  ['grazie',        'Richiesta ricevuta'],
];
const navLogo = logo();
for (const [slug, title] of PAGES) {
  const body = read(`./src/pages/${slug}.html`);
  const noindex = slug === 'grazie' ? '<meta name="robots" content="noindex, follow">' : '';
  const page = `<!doctype html>
<html lang="it">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="theme-color" content="#0A0C12">
<meta name="color-scheme" content="dark">
<title>${title} — Flux AI</title>
<meta name="description" content="${title} di Flux AI.">
<link rel="canonical" href="https://www.flux-ai.it/${slug}">
${noindex}
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="/icons/apple-touch-icon.png">
<link rel="preload" href="fonts/geist.woff2" as="font" type="font/woff2" crossorigin>
<style>
${CSS}
${read('./src/06-doc.css')}
</style>
</head>
<body class="doc">
<a class="skip-link" href="#doc">Vai al contenuto</a>
<header class="nav">
  <div class="nav__inner wrap-wide">
    <a class="nav__brand" href="/" aria-label="Flux AI — torna alla home">
      <span class="nav__mark" aria-hidden="true">${navLogo}</span>
      <span class="nav__name">Flux<span class="nav__name-ai">AI</span></span>
    </a>
    <div class="nav__actions"><a class="btn btn--secondary" href="/">Torna al sito</a></div>
  </div>
</header>
<main class="doc__main wrap" id="doc">
${body.trim()}
</main>
<footer class="foot">
  <div class="wrap-wide foot__bottom">
    <p class="meta">© ${new Date().getFullYear()} Flux AI. Tutti i diritti riservati.</p>
    <nav class="foot__legal" aria-label="Note legali">
      <a href="/privacy">Privacy</a><a href="/cookie-policy">Cookie</a><a href="/termini">Termini</a>
    </nav>
  </div>
</footer>
</body>
</html>
`;
  writeFileSync(new URL(`./${slug}.html`, import.meta.url), page);
}
console.log('pagine: ' + PAGES.map(p => p[0] + '.html').join(', '));

const kb = (s) => (Buffer.byteLength(s, 'utf8') / 1024).toFixed(1).padStart(7) + ' KB';
let gz = '';
try {
  const { gzipSync } = await import('node:zlib');
  gz = `  (gzip ${(gzipSync(Buffer.from(html)).length / 1024).toFixed(1)} KB)`;
} catch { /* zlib sempre presente, ma non e critico */ }

console.log('index.html generato');
console.log('  CSS  ' + kb(CSS));
console.log('  HTML ' + kb(body));
console.log('  JS   ' + kb(js));
console.log('  GLSL ' + kb(frag));
console.log('  ---------------------');
console.log('  TOT  ' + kb(html) + gz);
