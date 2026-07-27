#version 300 es
precision highp float;

/* ============================================================================
   IRIS — il diaframma di Flux AI
   Ricostruisce il logo: occhio vesica low-poly + wormhole poligonale, freddo
   al bordo e incandescente al centro. Lo scroll non fa scorrere la pagina:
   APRE l'occhio. Triangolo fullscreen, nessun buffer, nessuna dipendenza.
   ========================================================================= */

uniform vec2  uRes;
uniform vec2  uMouse;      /* -1..1, gia smussato lato JS */
uniform float uTime;
uniform float uScroll;     /* 0..1 progresso hero */
uniform float uIntensity;  /* master fade */
uniform float uShift;      /* spostamento orizzontale dell'occhio (unita uv) */

out vec4 fragColor;

#define PI 3.14159265359
const float SEG = 14.0;

/* Palette Flux AI. Il gradiente del logo vive SOLO qui: una istanza per pagina. */
const vec3 C_DEEP = vec3(0.043, 0.247, 0.659);  /* #0B3FA8 */
const vec3 C_BLUE = vec3(0.184, 0.420, 1.000);  /* #2F6BFF */
const vec3 C_CYAN = vec3(0.098, 0.839, 0.816);  /* #19D6D0 */
const vec3 C_LIME = vec3(0.784, 0.941, 0.290);  /* #C8F04A */
const vec3 C_BG   = vec3(0.039, 0.047, 0.071);  /* #0A0C12 */

float hash21(vec2 p){
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

/* linea antialiasata su coordinata ripetuta */
float gridLine(float x, float w){
  float d  = abs(fract(x + 0.5) - 0.5);
  float aa = fwidth(x) * 0.5 + 1e-5;
  return 1.0 - smoothstep(w * aa, (w + 1.2) * aa, d);
}

/* SDF vesica (Inigo Quilez) */
float sdVesica(vec2 p, float r, float d){
  p = abs(p);
  float b = sqrt(r * r - d * d);
  return ((p.y - b) * d > p.x * b)
       ? length(p - vec2(0.0, b)) * sign(d)
       : length(p - vec2(-d, 0.0)) - r;
}

/* cerchi -> N-goni regolari: e questo che da il look low-poly del logo */
float polyR(float r, float a, float n){
  float seg = 2.0 * PI / n;
  float k   = mod(a, seg) - seg * 0.5;
  return r * cos(k) / cos(seg * 0.5);
}

void main(){
  /* Normalizzo sul minore fra altezza e 0.72*larghezza: su una hero molto
     alta l'occhio resterebbe altrimenti fuori scala. */
  float unit = min(uRes.y * 0.80, uRes.x * 0.52);
  vec2 uv = (gl_FragCoord.xy - 0.5 * uRes) / unit;

  float t   = uTime;
  float scr = uScroll;

  vec2 p = uv - uMouse * 0.045;
  p.x -= uShift;

  /* lo scroll apre l'occhio */
  float open = mix(1.0, 2.9, smoothstep(0.0, 0.9, scr));

  /* ---------- FORMA OCCHIO ---------- */
  vec2  ep     = vec2(p.x, p.y / open);
  float eye    = sdVesica(ep.yx, 0.80, 0.56);
  float inside = 1.0 - smoothstep(-0.004, 0.004, eye);

  /* ---------- WORMHOLE ---------- */
  float r  = max(length(p), 1e-4);
  float a  = atan(p.y, p.x);
  float aS = a + t * 0.035 + scr * 0.5;
  float rp = polyR(r, aS, SEG);

  float travel = t * 0.16 + scr * 2.2;
  float z      = 0.32 / max(rp, 1e-3) - travel;

  float rings  = gridLine(z * 2.2, 1.05);
  float spokes = gridLine(aS / (2.0 * PI) * SEG, 0.85);
  spokes *= smoothstep(0.03, 0.30, rp);

  float wire = max(rings, spokes * 0.6);
  wire *= smoothstep(0.015, 0.10, rp);
  wire *= 1.0 - smoothstep(0.34, 0.92, rp);

  /* ---------- ANELLI CONCENTRICI DEL LOGO ---------- */
  float layers = 0.0;
  for (int i = 0; i < 4; i++){
    float k   = float(i);
    float off = 0.045 + k * 0.052;
    float dd  = abs(eye + off);
    layers += (1.0 - smoothstep(0.0, 0.006 + k * 0.002, dd)) * (1.0 - k * 0.2);
  }

  /* ---------- PUPILLA ---------- */
  float md    = length(uMouse);
  float pupil = 0.050 + 0.005 * sin(t * 1.4)
              + 0.016 * (1.0 - clamp(md, 0.0, 1.0))
              - 0.018 * scr;
  pupil = max(pupil, 0.012);
  float core = 1.0 - smoothstep(pupil * 0.55, pupil, r);
  float halo = exp(-r * (9.0 + 13.0 * scr));

  /* ---------- GRADIENTE DEL LOGO: blu -> ciano -> lime ---------- */
  float g = clamp(p.x * 0.85 + 0.5 + 0.10 * sin(z * 0.5), 0.0, 1.0);
  vec3 grad = mix(C_DEEP, C_BLUE, smoothstep(0.00, 0.30, g));
  grad = mix(grad, C_CYAN, smoothstep(0.28, 0.66, g));
  grad = mix(grad, C_LIME, smoothstep(0.72, 1.00, g));

  vec3 col = C_BG;
  col += grad * wire * inside * 1.25;
  col += grad * layers * (0.50 + 0.42 * inside);
  col += mix(C_CYAN, C_LIME, 0.30) * core * 1.05;
  col += C_CYAN * halo * 0.18 * inside;

  float rim = 1.0 - smoothstep(0.0, 0.0035, abs(eye));
  col += grad * rim * 0.85;
  col += grad * exp(-abs(eye) * 26.0) * 0.09;

  /* stella a 4 punte, firma del logo — astroide */
  vec2  sp = (p - vec2(0.455, -0.145)) * (1.0 + 0.4 * scr);
  float sd = pow(abs(sp.x), 0.5) + pow(abs(sp.y), 0.5);
  float star = 1.0 - smoothstep(0.155, 0.195, sd);
  col += vec3(0.93, 0.97, 1.0) * star * (0.45 + 0.35 * sin(t * 1.8));

  /* grana + vignettatura: gratis qui dentro, niente overlay fixed sulla pagina */
  float grain = hash21(gl_FragCoord.xy + fract(t) * 91.7) - 0.5;
  col += grain * 0.030;
  col *= 1.0 - 0.34 * smoothstep(0.38, 1.15, length(p));

  col = mix(C_BG, col, uIntensity);
  fragColor = vec4(col, 1.0);
}
