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
