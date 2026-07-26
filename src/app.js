/* ============================================================================
   FLUX AI — app.js
   Zero dipendenze. Niente GSAP, niente Lenis, niente Three.js: ogni effetto
   qui dentro e scritto a mano, quindi testabile e senza punti di rottura
   esterni (nessuna CDN da cui dipendere, nessun SRI da tenere allineato).
   ========================================================================= */
(function () {
  'use strict';

  var $  = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  /* ==========================================================  CAPABILITIES */
  var mqReduce = matchMedia('(prefers-reduced-motion: reduce)');
  var CAP = (function () {
    var coarse = matchMedia('(pointer: coarse)').matches;
    var cores  = navigator.hardwareConcurrency || 4;
    var mem    = navigator.deviceMemory || 4;
    var weak   = coarse || cores <= 4 || mem < 4;
    var gl2 = false;
    try {
      gl2 = !!document.createElement('canvas')
        .getContext('webgl2', { failIfMajorPerformanceCaveat: true });
    } catch (e) { /* nessun contesto: resta false */ }
    return {
      get reduce() { return mqReduce.matches; },
      coarse: coarse, weak: weak, gl2: gl2,
      fine: !coarse,
      dprCap: weak ? 1.5 : 2
    };
  })();
  document.documentElement.classList.toggle('no-webgl', !CAP.gl2);

  /* ==================================================  FORMATTAZIONE NUMERI */
  /* it-IT ha minimumGroupingDigits=2: senza useGrouping esplicito
     Intl restituisce "1240" invece di "1.240". */
  function formatIT(value, o) {
    o = o || {};
    var n = value, unit = '';
    if (o.compact) {
      var abs = Math.abs(n);
      if (abs >= 1e9)      { n /= 1e9; unit = 'Mld'; }
      else if (abs >= 1e6) { n /= 1e6; unit = 'M';   }
      else if (abs >= 1e3) { n /= 1e3; unit = 'k';   }
    }
    var d = (o.decimals != null) ? o.decimals : (unit && Math.abs(n) < 10 ? 1 : 0);
    if (o.decimals == null && d === 1 && Math.abs(n % 1) < 0.05) d = 0;
    var s = new Intl.NumberFormat('it-IT', {
      minimumFractionDigits: d, maximumFractionDigits: d, useGrouping: true
    }).format(n);
    return (o.prefix || '') + s + unit + (o.suffix || '');
  }

  /* Tween rAF condiviso: una sola implementazione per tutta la pagina. */
  function tween(dur, onUpdate, ease) {
    var t0 = 0;
    ease = ease || function (x) { return 1 - Math.pow(1 - x, 3); };
    function step(now) {
      if (!t0) t0 = now;
      var u = Math.min(1, (now - t0) / dur);
      onUpdate(ease(u), u);
      if (u < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  /* ==============================================  REVEAL "racking focus" */
  /* Un solo observer per tutta la pagina, unobserve immediato: niente
     elementi ri-osservati, niente card che restano invisibili. */
  function initReveal() {
    var els = $$('.reveal');
    if (!els.length) return;
    if (CAP.reduce || !('IntersectionObserver' in window)) {
      els.forEach(function (el) { el.classList.add('is-revealed'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      /* stagger per riga visiva, non per indice: cap a 6 gruppi = 360ms */
      var shown = entries.filter(function (e) { return e.isIntersecting; });
      shown.sort(function (a, b) { return a.boundingClientRect.top - b.boundingClientRect.top; });
      var rowTop = null, group = -1;
      shown.forEach(function (e) {
        var top = Math.round(e.boundingClientRect.top / 24);
        if (top !== rowTop) { rowTop = top; group = Math.min(group + 1, 5); }
        e.target.style.setProperty('--reveal-delay', (group * 60) + 'ms');
        e.target.classList.add('is-revealed');
        io.unobserve(e.target);
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -10% 0px' });
    els.forEach(function (el) { io.observe(el); });
  }

  /* ==============================================================  CONTATORI */
  function initCounters() {
    var els = $$('[data-cnt]');
    if (!els.length) return;
    var run = function (el) {
      var to = parseFloat(el.getAttribute('data-cnt'));
      var suffix = el.getAttribute('data-suffix') || '';
      var dec = (String(to).split('.')[1] || '').length;
      if (CAP.reduce) { el.textContent = formatIT(to, { suffix: suffix, decimals: dec }); return; }
      tween(1600, function (e) {
        el.textContent = formatIT(to * e, { suffix: suffix, decimals: dec });
      });
    };
    if (!('IntersectionObserver' in window)) { els.forEach(run); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        io.unobserve(e.target);          /* parte una volta sola, mai al re-entry */
        run(e.target);
      });
    }, { threshold: 0.5 });
    els.forEach(function (el) { io.observe(el); });
  }

  /* =============================================================  NAVBAR */
  function initNav() {
    var nav = $('#nav'), prog = $('#navProgress'), burger = $('#burger'), drawer = $('#drawer');
    var links = $$('.nav__links a');
    var sections = links.map(function (a) { return $(a.getAttribute('href')); }).filter(Boolean);
    var sticky = $('#stickyCta');
    var ticking = false;

    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        ticking = false;
        var y = window.scrollY || 0;
        var max = document.documentElement.scrollHeight - innerHeight;
        nav.classList.toggle('is-stuck', y > 8);
        if (prog) prog.style.setProperty('--p', max > 0 ? (y / max).toFixed(4) : 0);
        if (sticky) sticky.hidden = !(y > innerHeight * 0.3 && y < max - 300);
        Iris.setScroll(Math.min(1, y / Math.max(1, innerHeight * 0.9)));
      });
    }
    addEventListener('scroll', onScroll, { passive: true });
    addEventListener('resize', onScroll, { passive: true });
    onScroll();

    /* scroll-spy: observer dedicato, non calcoli dentro l'handler di scroll */
    if (sections.length && 'IntersectionObserver' in window) {
      var visible = {};
      var spy = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) { visible[e.target.id] = e.isIntersecting ? e.intersectionRatio : 0; });
        var best = null, bestR = 0;
        Object.keys(visible).forEach(function (id) { if (visible[id] > bestR) { bestR = visible[id]; best = id; } });
        links.forEach(function (a) {
          a.setAttribute('aria-current', a.getAttribute('href') === '#' + best ? 'true' : 'false');
        });
      }, { threshold: [0, .2, .5, .8], rootMargin: '-20% 0px -55% 0px' });
      sections.forEach(function (s) { spy.observe(s); });
    }

    function setDrawer(open) {
      drawer.hidden = !open;
      burger.setAttribute('aria-expanded', String(open));
      burger.setAttribute('aria-label', open ? 'Chiudi il menu' : 'Apri il menu');
      burger.innerHTML = '<svg aria-hidden="true"><use href="#i-' + (open ? 'close' : 'menu') + '"/></svg>';
      document.body.style.overflow = open ? 'hidden' : '';
    }
    burger.addEventListener('click', function () { setDrawer(drawer.hidden); });
    drawer.addEventListener('click', function (e) { if (e.target.closest('a')) setDrawer(false); });
    addEventListener('keydown', function (e) { if (e.key === 'Escape' && !drawer.hidden) { setDrawer(false); burger.focus(); } });
    matchMedia('(min-width: 1000px)').addEventListener('change', function (m) { if (m.matches) setDrawer(false); });
  }

  /* ============================================  BORDO A LUCE RADENTE (.lit) */
  function initLit() {
    if (!CAP.fine || CAP.reduce) return;
    var current = null, rect = null, ev = null, queued = false;
    function apply() {
      queued = false;
      if (!current || !rect || !ev) return;
      current.style.setProperty('--mx', (ev.clientX - rect.left).toFixed(1) + 'px');
      current.style.setProperty('--my', (ev.clientY - rect.top).toFixed(1) + 'px');
    }
    document.addEventListener('pointermove', function (e) {
      var el = e.target.closest ? e.target.closest('.lit') : null;
      if (el !== current) { current = el; rect = el ? el.getBoundingClientRect() : null; }
      if (!current) return;
      ev = e;
      if (!queued) { queued = true; requestAnimationFrame(apply); }
    }, { passive: true });
    /* il rect e valido solo finche la pagina non scorre */
    addEventListener('scroll', function () { if (current) rect = current.getBoundingClientRect(); }, { passive: true });
  }

  /* ===============================================================  IRIS  */
  /* Fragment shader fullscreen su un solo triangolo: nessun VBO, nessun
     attributo. Il gradiente del logo vive solo qui. */
  var Iris = (function () {
    var gl, prog, U = {}, canvas, vao;
    var raf = 0, running = false, visible = true, inView = true, ok = false;
    var t0 = 0, tPrev = 0;
    var mouse = { x: 0, y: 0 }, smooth = { x: 0, y: 0 };
    var scroll = 0, intensity = 0;
    var scale = 1, frames = 0, acc = 0;

    function compile(type, src) {
      var s = gl.createShader(type);
      gl.shaderSource(s, src);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
        console.error('[iris] shader:', gl.getShaderInfoLog(s));
        gl.deleteShader(s);
        return null;
      }
      return s;
    }

    function resize() {
      var dpr = Math.min(devicePixelRatio || 1, CAP.dprCap) * scale;
      var w = Math.max(1, Math.round(canvas.clientWidth  * dpr));
      var h = Math.max(1, Math.round(canvas.clientHeight * dpr));
      if (canvas.width === w && canvas.height === h) return;
      canvas.width = w; canvas.height = h;
      gl.viewport(0, 0, w, h);
    }

    function drawOnce() {
      resize();
      gl.uniform2f(U.uRes, canvas.width, canvas.height);
      gl.uniform2f(U.uMouse, smooth.x, smooth.y);
      gl.uniform1f(U.uTime, t0 ? (performance.now() - t0) / 1000 : 0);
      gl.uniform1f(U.uScroll, scroll);
      gl.uniform1f(U.uIntensity, intensity);
      /* su desktop l'occhio sta a destra, accanto al testo; su mobile e centrato
         e passa dietro, con il velo a garantire il contrasto */
      gl.uniform1f(U.uShift, canvas.clientWidth >= 1000 ? 0.40 : 0.0);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    }

    function frame(now) {
      raf = requestAnimationFrame(frame);
      if (!t0) t0 = now;
      var dt = Math.min((now - tPrev) / 1000, 0.05) || 0.016;
      tPrev = now;

      /* qualita adattiva: sotto 45fps abbassa la risoluzione, sopra 58 risale */
      acc += dt; frames++;
      if (acc >= 1) {
        var fps = frames / acc;
        if (fps < 45 && scale > 0.55)      { scale = Math.max(0.55, scale - 0.2); resize(); }
        else if (fps > 58 && scale < 1)    { scale = Math.min(1, scale + 0.1);    resize(); }
        acc = 0; frames = 0;
      }

      var k = 1 - Math.pow(0.001, dt);   /* lerp indipendente dal frame rate */
      smooth.x += (mouse.x - smooth.x) * k;
      smooth.y += (mouse.y - smooth.y) * k;
      intensity += ((inView ? 1 : 0) - intensity) * k;
      drawOnce();
    }

    function start() {
      if (running || !ok || !visible || !inView || CAP.reduce) return;
      running = true; tPrev = performance.now();
      raf = requestAnimationFrame(frame);
    }
    function stop() { running = false; cancelAnimationFrame(raf); raf = 0; }

    function init(el, fragSrc) {
      canvas = el;
      if (!canvas || !CAP.gl2) { document.documentElement.classList.add('no-webgl'); return false; }
      gl = canvas.getContext('webgl2', {
        alpha: false, antialias: false, depth: false, stencil: false,
        powerPreference: 'high-performance', desynchronized: true
      });
      if (!gl) { document.documentElement.classList.add('no-webgl'); return false; }

      var VERT = '#version 300 es\nvoid main(){vec2 v=vec2(float((gl_VertexID<<1)&2),float(gl_VertexID&2));gl_Position=vec4(v*2.0-1.0,0.0,1.0);}';
      var vs = compile(gl.VERTEX_SHADER, VERT);
      var fs = compile(gl.FRAGMENT_SHADER, fragSrc);
      if (!vs || !fs) { document.documentElement.classList.add('no-webgl'); return false; }

      prog = gl.createProgram();
      gl.attachShader(prog, vs); gl.attachShader(prog, fs); gl.linkProgram(prog);
      if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
        console.error('[iris] link:', gl.getProgramInfoLog(prog));
        document.documentElement.classList.add('no-webgl');
        return false;
      }
      gl.deleteShader(vs); gl.deleteShader(fs);
      gl.useProgram(prog);
      vao = gl.createVertexArray();
      gl.bindVertexArray(vao);
      ['uRes', 'uMouse', 'uTime', 'uScroll', 'uIntensity', 'uShift'].forEach(function (n) {
        U[n] = gl.getUniformLocation(prog, n);
      });
      ok = true;

      canvas.addEventListener('webglcontextlost', function (e) {
        e.preventDefault(); stop(); ok = false;
        document.documentElement.classList.add('no-webgl');
      });

      if (CAP.fine) {
        addEventListener('pointermove', function (e) {
          mouse.x = (e.clientX / innerWidth) * 2 - 1;
          mouse.y = 1 - (e.clientY / innerHeight) * 2;
        }, { passive: true });
      }
      document.addEventListener('visibilitychange', function () {
        visible = !document.hidden;
        visible ? start() : stop();
      });
      if ('IntersectionObserver' in window) {
        new IntersectionObserver(function (es) {
          inView = es[0].isIntersecting;
          inView ? start() : stop();
        }, { threshold: 0 }).observe(canvas);
      }
      if ('ResizeObserver' in window) {
        new ResizeObserver(function () { if (!running && ok) drawOnce(); }).observe(canvas);
      }

      if (CAP.reduce) { intensity = 1; drawOnce(); return true; }  /* un frame statico */
      start();
      return true;
    }

    return { init: init, setScroll: function (v) { scroll = v; }, start: start, stop: stop };
  })();

  /* =========================================  CANVAS STAGE (2D condiviso) */
  /* Risolve DPR, resize, pausa fuori viewport e reduced-motion una volta
     sola per tutte le scene 2D della pagina. */
  function mountStage(canvas, scene, opts) {
    opts = opts || {};
    var ctx = canvas.getContext('2d', { alpha: opts.alpha !== false, desynchronized: true });
    var st = { w: 0, h: 0, dpr: 1, t: 0 };
    var frameMs = 1000 / (opts.fps || (CAP.weak ? 30 : 60));
    var raf = 0, last = 0, inView = false, ready = false, started = false;
    var api;

    function resize() {
      var r = canvas.getBoundingClientRect();
      if (r.width < 1 || r.height < 1) { ready = false; return; }
      st.dpr = Math.min(devicePixelRatio || 1, opts.maxDpr || CAP.dprCap);
      st.w = r.width; st.h = r.height;
      canvas.width  = Math.round(r.width  * st.dpr);
      canvas.height = Math.round(r.height * st.dpr);
      ctx.setTransform(st.dpr, 0, 0, st.dpr, 0, 0);
      ready = true;
      if (scene.resize) scene.resize(ctx, st);
      if (started && !raf) scene.draw(ctx, st, 0);
    }

    function loop(now) {
      raf = requestAnimationFrame(loop);
      if (!ready) return;
      /* Primo frame: fissa l'origine dei tempi e disegna. Senza questo ramo,
         con il cap a 30fps il dt di ripiego (16.7) resta sempre sotto la
         soglia e "last" non viene mai valorizzato: il loop gira a vuoto. */
      if (!last) { last = now; scene.draw(ctx, st, 0); return; }
      var dt = now - last;
      if (dt < frameMs - 1.5) return;
      last = now;
      var step = Math.min(dt, 50);
      st.t += step;
      scene.draw(ctx, st, step);
    }

    function play()  { if (raf) return; last = 0; raf = requestAnimationFrame(loop); }
    function pause() { cancelAnimationFrame(raf); raf = 0; }
    function sync() {
      var on = inView && !document.hidden && !CAP.reduce && api.gate();
      if (on) play();
      else { pause(); if (ready && started) scene.draw(ctx, st, 0); }
    }

    api = {
      gate: function () { return true; },
      state: st, play: play, pause: pause, sync: sync, resize: resize,
      renderFrame: function () { if (ready) scene.draw(ctx, st, 0); }
    };

    resize();
    if (scene.init) scene.init(ctx, st);
    started = true;
    if (ready) scene.draw(ctx, st, 0);

    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (e) { inView = e[0].isIntersecting; sync(); }, { threshold: 0.01 }).observe(canvas);
    } else { inView = true; sync(); }
    if ('ResizeObserver' in window) new ResizeObserver(resize).observe(canvas);
    document.addEventListener('visibilitychange', sync);
    mqReduce.addEventListener('change', sync);
    return api;
  }

  /* ======================================  CONSOLE — la "dashboard viva" */
  function initConsole() {
    var root = $('#console');
    if (!root) return;
    var logEl = $('#consoleLog', root), chart = $('#consoleChart', root);

    var LOGS = [
      ['ok',   'pec &middot; 12 fatture fornitore acquisite'],
      ['ai',   'claude &middot; documento classificato: <b>fattura</b> (0,94)'],
      ['ok',   'gestionale &middot; 12 righe inserite, 0 errori'],
      ['ai',   'agente &middot; anomalia rilevata su imponibile &mdash; in revisione'],
      ['warn', 'gestionale &middot; retry 1/3 &middot; timeout'],
      ['ok',   'gestionale &middot; sincronizzazione completata'],
      ['ai',   'claude &middot; 3 allegati indicizzati'],
      ['ok',   'mail &middot; riepilogo giornaliero inviato allo studio']
    ];
    var i = 0;

    function stamp() {
      var d = new Date();
      return ('0' + d.getHours()).slice(-2) + ':' + ('0' + d.getMinutes()).slice(-2) + ':' + ('0' + d.getSeconds()).slice(-2);
    }
    function push() {
      var l = LOGS[i++ % LOGS.length];
      var li = document.createElement('li');
      li.setAttribute('data-kind', l[0]);
      li.innerHTML = '<time>' + stamp() + '</time><p>' + l[1] + '</p>';
      logEl.insertBefore(li, logEl.firstChild);
      while (logEl.children.length > 5) logEl.removeChild(logEl.lastChild);
    }

    /* grafico: barre giornaliere, si disegnano una volta e poi respirano */
    var DATA = [38, 52, 44, 61, 55, 72, 66, 81, 74, 88, 79, 94];
    var chartScene = {
      draw: function (ctx, st) {
        var w = st.w, h = st.h, n = DATA.length;
        var pad = 6, gap = 5;
        var bw = (w - pad * 2 - gap * (n - 1)) / n;
        ctx.clearRect(0, 0, w, h);
        var prog = chartScene.p;
        for (var k = 0; k < n; k++) {
          var kp = Math.max(0, Math.min(1, prog * 1.6 - k * 0.045));
          var e = 1 - Math.pow(1 - kp, 3);
          var bh = (h - 14) * (DATA[k] / 100) * e;
          var x = pad + k * (bw + gap), y = h - bh;
          var g = ctx.createLinearGradient(0, y, 0, h);
          g.addColorStop(0, k === n - 1 ? 'rgba(200,240,74,.95)' : 'rgba(25,214,208,.75)');
          g.addColorStop(1, k === n - 1 ? 'rgba(200,240,74,.10)' : 'rgba(25,214,208,.06)');
          ctx.fillStyle = g;
          ctx.beginPath();
          if (ctx.roundRect) ctx.roundRect(x, y, bw, bh, [3, 3, 0, 0]);
          else ctx.rect(x, y, bw, bh);
          ctx.fill();
        }
        ctx.strokeStyle = 'rgba(56,64,90,.6)';
        ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(0, h - .5); ctx.lineTo(w, h - .5); ctx.stroke();
        if (prog < 1) chartScene.p = Math.min(1, prog + 0.02);
      },
      p: 0
    };

    var stage = mountStage(chart, chartScene, { fps: 30 });
    var timer = null;
    var io = new IntersectionObserver(function (e) {
      if (e[0].isIntersecting && !timer) {
        push();
        if (!CAP.reduce) timer = setInterval(push, 2600);
      } else if (!e[0].isIntersecting && timer) {
        clearInterval(timer); timer = null;
      }
    }, { threshold: 0.25 });
    io.observe(root);
    if (CAP.reduce) { chartScene.p = 1; stage.renderFrame(); for (var j = 0; j < 4; j++) push(); }
  }

  /* ==========================================  RITRATTI GENERATIVI FOUNDER */
  /* Segnaposto dichiarato, non una foto stock: maglia esagonale derivata dal
     logo, con seed diverso per persona. */
  function initPortraits() {
    $$('.founder__portrait').forEach(function (box) {
      var cv = $('.founder__canvas', box);
      if (!cv) return;
      var seed = 0, s = box.getAttribute('data-initials') || 'FX';
      for (var i = 0; i < s.length; i++) seed += s.charCodeAt(i) * (i + 7);

      mountStage(cv, {
        draw: function (ctx, st) {
          var w = st.w, h = st.h, t = st.t / 1000;
          ctx.clearRect(0, 0, w, h);
          var R = Math.min(w, h) * 0.13;
          var cols = Math.ceil(w / (R * 1.5)) + 2;
          var rows = Math.ceil(h / (R * 1.732)) + 2;
          ctx.lineWidth = 1;
          for (var q = -1; q < cols; q++) {
            for (var r = -1; r < rows; r++) {
              var cx = q * R * 1.5;
              var cy = r * R * 1.732 + (q % 2 ? R * 0.866 : 0);
              var d = Math.hypot(cx - w / 2, cy - h / 2) / Math.max(w, h);
              var puls = 0.5 + 0.5 * Math.sin(t * 0.6 - d * 5 + seed);
              var a = (1 - d * 1.5) * (0.10 + 0.16 * puls);
              if (a <= 0.005) continue;
              var hue = 178 + d * 40;
              ctx.strokeStyle = 'hsla(' + hue + ',72%,58%,' + a.toFixed(3) + ')';
              ctx.beginPath();
              for (var k = 0; k < 6; k++) {
                var ang = Math.PI / 180 * (60 * k);
                var x = cx + R * 0.92 * Math.cos(ang), y = cy + R * 0.92 * Math.sin(ang);
                k ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
              }
              ctx.closePath(); ctx.stroke();
            }
          }
        }
      }, { fps: 24, maxDpr: 1.5 });
    });
  }

  /* ==================================================  RAIL PRODOTTI (tabs) */
  function initRail() {
    var tabs = $$('.rail__node');
    var panels = $$('.panel');
    if (!tabs.length) return;

    function select(idx, focus) {
      tabs.forEach(function (t, i) {
        t.setAttribute('aria-selected', String(i === idx));
        t.tabIndex = i === idx ? 0 : -1;
      });
      panels.forEach(function (p, i) { p.hidden = i !== idx; });
      if (focus) tabs[idx].focus();
    }
    tabs.forEach(function (t, i) {
      t.tabIndex = i === 0 ? 0 : -1;
      t.addEventListener('click', function () { select(i); });
      t.addEventListener('keydown', function (e) {
        var k = e.key, n = tabs.length, next = -1;
        if (k === 'ArrowRight' || k === 'ArrowDown') next = (i + 1) % n;
        else if (k === 'ArrowLeft' || k === 'ArrowUp') next = (i - 1 + n) % n;
        else if (k === 'Home') next = 0;
        else if (k === 'End') next = n - 1;
        if (next >= 0) { e.preventDefault(); select(next, true); }
      });
    });
    select(0);
  }

  /* ==============================================================  SHOWREEL */
  function initShowreel() {
    var root = $('#showreel');
    if (!root) return;
    var cv = $('.fr-canvas', root), btn = $('.fr-play', root), big = $('.fr-big', root);
    var track = $('#frTrack'), fill = $('.fr-fill', root), knob = $('.fr-knob', root);
    var timeEl = $('.fr-time', root), cap = $('.fr-caption', root), chaps = $('.fr-chapters', root);

    var BLUE = '47,107,255', CYAN = '25,214,208', LIME = '200,240,74';
    var seed = 1337;
    function rnd() { seed = (seed * 1664525 + 1013904223) % 4294967296; return seed / 4294967296; }
    function easeIO(x) { return x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; }
    /* punto sull'occhio a mandorla: la stessa forma del logo */
    function lens(a, rx, ry) {
      var s = Math.sin(a);
      return [rx * Math.cos(a), ry * Math.sign(s) * Math.pow(Math.abs(s), 1.55)];
    }

    var dots = null;
    function ensureDots() {
      if (dots) return;
      dots = []; seed = 1337;
      for (var r = 0; r < 3; r++) {
        var N = 64 - r * 12;
        for (var i = 0; i < N; i++) {
          dots.push({ a: (i / N) * Math.PI * 2, ring: r, ox: rnd() * 2 - 1, oy: rnd() * 2 - 1, ph: rnd() * 6.28 });
        }
      }
    }

    var CLIPS = [
      { name: 'Genesi latente', dur: 6, render: function (ctx, u, w, h, t) {
          ensureDots();
          var cx = w / 2, cy = h / 2, R = Math.min(w * .32, h * .58);
          var k = easeIO(Math.min(1, u / .62));
          ctx.globalCompositeOperation = 'lighter';
          for (var i = 0; i < dots.length; i++) {
            var d = dots[i], sc = 1 - d.ring * .26;
            var p = lens(d.a + t * .05, R * sc, R * .46 * sc);
            var jx = d.ox * w * .7, jy = d.oy * h * .7;
            var br = 1 + Math.sin(t * 2 + d.ph) * .06 * (u > .62 ? 1 : 0);
            var x = cx + (jx + (p[0] * br - jx) * k);
            var y = cy + (jy + (p[1] * br - jy) * k);
            ctx.fillStyle = 'rgba(' + (d.ring === 0 ? CYAN : (d.ring === 1 ? BLUE : LIME)) + ',' + (.22 + .58 * k) + ')';
            ctx.beginPath(); ctx.arc(x, y, 1.5 + k * .9, 0, 6.2832); ctx.fill();
          }
          if (k > .55) {
            ctx.strokeStyle = 'rgba(' + CYAN + ',' + (k - .55) * .5 + ')'; ctx.lineWidth = 1;
            ctx.beginPath();
            for (var j = 0; j <= 80; j++) {
              var q = lens((j / 80) * 6.2832, R, R * .46);
              j ? ctx.lineTo(cx + q[0], cy + q[1]) : ctx.moveTo(cx + q[0], cy + q[1]);
            }
            ctx.stroke();
          }
          ctx.globalCompositeOperation = 'source-over';
          var ta = Math.max(0, Math.min(1, (u - .58) * 3));
          if (ta > 0) {
            ctx.textAlign = 'center';
            ctx.font = '900 ' + Math.round(Math.min(w * .052, 44)) + 'px Geist, sans-serif';
            ctx.fillStyle = 'rgba(238,241,248,' + ta * .95 + ')';
            ctx.fillText('FLUX AI', cx, h - h * .14);
            ctx.font = '400 ' + Math.round(Math.min(w * .018, 15)) + 'px Geist, sans-serif';
            ctx.fillStyle = 'rgba(' + LIME + ',' + ta * .8 + ')';
            ctx.fillText('Vediamo ci\u00F2 che gli altri non vedono', cx, h - h * .07);
          }
        } },

      { name: 'Il diaframma', dur: 6, render: function (ctx, u, w, h, t) {
          var cx = w / 2, cy = h / 2, R = Math.min(w * .40, h * .78), RINGS = 15, K = 22;
          var rot = t * .12;
          ctx.globalCompositeOperation = 'lighter';
          var prev = null;
          for (var r = 0; r < RINGS; r++) {
            var z = (r / RINGS + t * .13) % 1;
            var sc = .04 + z * z * 1.35;
            var al = Math.min(1, z * 3.2) * (1 - z) * 1.5;
            var col = 'rgba(' + Math.round(47 + 153 * z) + ',' + Math.round(107 + 133 * z) + ',' + Math.round(255 - 181 * z) + ',';
            var pts = [];
            ctx.strokeStyle = col + (al * .55) + ')'; ctx.lineWidth = 1 + z * 1.2;
            ctx.beginPath();
            for (var i = 0; i <= K; i++) {
              var a = (i / K) * 6.2832 + rot * (1 + z * .6);
              var p = lens(a, R * sc, R * .44 * sc);
              pts.push([cx + p[0], cy + p[1]]);
              i ? ctx.lineTo(cx + p[0], cy + p[1]) : ctx.moveTo(cx + p[0], cy + p[1]);
            }
            ctx.stroke();
            if (prev) {
              ctx.strokeStyle = col + (al * .16) + ')'; ctx.lineWidth = 1;
              ctx.beginPath();
              for (var m = 0; m < K; m += 2) { ctx.moveTo(prev[m][0], prev[m][1]); ctx.lineTo(pts[m][0], pts[m][1]); }
              ctx.stroke();
            }
            prev = pts;
          }
          ctx.fillStyle = 'rgba(238,241,248,' + (.5 + .3 * Math.sin(t * 2)) + ')';
          ctx.beginPath(); ctx.arc(cx, cy, 2.5, 0, 6.2832); ctx.fill();
          ctx.globalCompositeOperation = 'source-over';
        } },

      { name: 'Morfogenesi', dur: 5, render: function (ctx, u, w, h, t) {
          var cx = w / 2, cy = h / 2, R = Math.min(w, h) * .26;
          ctx.globalCompositeOperation = 'lighter';
          for (var l = 0; l < 3; l++) {
            var g = ctx.createLinearGradient(cx - R, cy - R, cx + R, cy + R);
            g.addColorStop(0, 'rgba(' + BLUE + ',.7)');
            g.addColorStop(.5, 'rgba(' + CYAN + ',.7)');
            g.addColorStop(1, 'rgba(' + LIME + ',.65)');
            ctx.strokeStyle = g; ctx.lineWidth = 1.6 - l * .4;
            ctx.beginPath();
            for (var i = 0; i <= 140; i++) {
              var a = (i / 140) * 6.2832;
              var rr = R * (1 + l * .22) * (1 + .24 * Math.sin(3 * a + t * 1.1 + l)
                     + .15 * Math.sin(5 * a - t * .8) + .09 * Math.sin(8 * a + t * 1.6 + l * 2));
              var x = cx + Math.cos(a) * rr, y = cy + Math.sin(a) * rr;
              i ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
            }
            ctx.closePath(); ctx.stroke();
          }
          for (var s = 0; s < 26; s++) {
            var sa = (s / 26) * 6.2832 + t * .5, sr = R * (1.55 + .25 * Math.sin(t * 1.3 + s));
            ctx.fillStyle = 'rgba(' + (s % 2 ? CYAN : LIME) + ',.5)';
            ctx.beginPath(); ctx.arc(cx + Math.cos(sa) * sr, cy + Math.sin(sa) * sr * .8, 1.8, 0, 6.2832); ctx.fill();
          }
          ctx.globalCompositeOperation = 'source-over';
        } },

      { name: 'Strato dati', dur: 6, render: function (ctx, u, w, h, t) {
          var pad = Math.min(w * .1, 64), bw = w - pad * 2, bh = h - pad * 2, y0 = pad + bh;
          ctx.strokeStyle = 'rgba(238,241,248,.055)'; ctx.lineWidth = 1;
          ctx.beginPath();
          for (var i = 0; i <= 5; i++) { var gy = pad + bh * i / 5; ctx.moveTo(pad, gy); ctx.lineTo(pad + bw, gy); }
          ctx.stroke();
          var V = [.32, .51, .44, .68, .59, .82, .74, .93], n = V.length, gap = bw / n;
          for (var b = 0; b < n; b++) {
            var k = Math.max(0, Math.min(1, (u * 1.5 - b * .07) * 2.2));
            var hh = bh * V[b] * easeIO(k);
            var g = ctx.createLinearGradient(0, y0 - hh, 0, y0);
            g.addColorStop(0, 'rgba(' + LIME + ',.85)'); g.addColorStop(1, 'rgba(' + BLUE + ',.2)');
            ctx.fillStyle = g; ctx.fillRect(pad + b * gap + gap * .22, y0 - hh, gap * .42, hh);
          }
          ctx.globalCompositeOperation = 'lighter';
          ctx.strokeStyle = 'rgba(' + CYAN + ',.9)'; ctx.lineWidth = 2;
          ctx.beginPath();
          var upto = Math.min(1, u * 1.35);
          for (var c = 0; c <= 100; c++) {
            var p = c / 100; if (p > upto) break;
            var x = pad + bw * p, y = y0 - bh * (.25 + .45 * p + .09 * Math.sin(p * 9 + t * .6));
            c ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
          }
          ctx.stroke();
          var sx = pad + bw * ((t * .35) % 1);
          var sg = ctx.createLinearGradient(sx - 40, 0, sx, 0);
          sg.addColorStop(0, 'rgba(' + CYAN + ',0)'); sg.addColorStop(1, 'rgba(' + CYAN + ',.3)');
          ctx.fillStyle = sg; ctx.fillRect(sx - 40, pad, 40, bh);
          ctx.globalCompositeOperation = 'source-over';
          ctx.textAlign = 'left';
          ctx.font = '700 ' + Math.round(Math.min(w * .042, 34)) + 'px Geist, sans-serif';
          ctx.fillStyle = 'rgba(238,241,248,.92)';
          ctx.fillText('7 su 9', pad, pad - 14);
          ctx.font = '400 ' + Math.round(Math.min(w * .016, 13)) + 'px Geist, sans-serif';
          ctx.fillStyle = 'rgba(' + LIME + ',.85)';
          ctx.fillText('passaggi manuali eliminati', pad + Math.min(w * .12, 96), pad - 15);
        } }
    ];

    var TOTAL = CLIPS.reduce(function (s, c) { return s + c.dur; }, 0);
    var STARTS = []; CLIPS.reduce(function (s, c, i) { STARTS[i] = s; return s + c.dur; }, 0);
    /* 1.2s: dentro la prima clip, oltre la dissolvenza d'apertura.
   A tempo 0 il fade-in dipinge il frame di nero e il poster sparisce. */
    var reel = { time: 1.2, playing: false };
    var lastChap = -1;

    function fmt(s) { return Math.floor(s / 60) + ':' + ('0' + Math.floor(s % 60)).slice(-2); }
    function ui(idx) {
      var p = reel.time / TOTAL;
      fill.style.width = (p * 100) + '%';
      knob.style.left = (p * 100) + '%';
      timeEl.textContent = fmt(reel.time) + ' / ' + fmt(TOTAL);
      track.setAttribute('aria-valuenow', Math.round(p * 100));
      track.setAttribute('aria-valuetext', fmt(reel.time) + ' di ' + fmt(TOTAL) + ', ' + CLIPS[idx].name);
      if (idx !== lastChap) {
        lastChap = idx;
        cap.textContent = (idx + 1) + '. ' + CLIPS[idx].name;
        Array.prototype.forEach.call(chaps.children, function (el, k) {
          el.setAttribute('aria-current', String(k === idx));
        });
      }
    }

    var stage = mountStage(cv, {
      draw: function (ctx, st, dt) {
        if (reel.playing) { reel.time += dt / 1000; if (reel.time >= TOTAL) reel.time -= TOTAL; }
        var w = st.w, h = st.h;
        ctx.fillStyle = '#05060A'; ctx.fillRect(0, 0, w, h);
        var i = 0;
        while (i < CLIPS.length - 1 && reel.time >= STARTS[i] + CLIPS[i].dur) i++;
        var local = reel.time - STARTS[i], c = CLIPS[i];
        ctx.save();
        c.render(ctx, Math.max(0, Math.min(1, local / c.dur)), w, h, reel.time);
        ctx.restore();
        var edge = Math.min(local, c.dur - local);
        if (edge < .45) { ctx.fillStyle = 'rgba(0,0,0,' + (1 - edge / .45) + ')'; ctx.fillRect(0, 0, w, h); }
        var vg = ctx.createRadialGradient(w / 2, h / 2, Math.min(w, h) * .28, w / 2, h / 2, Math.max(w, h) * .72);
        vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(1, 'rgba(0,0,0,.55)');
        ctx.fillStyle = vg; ctx.fillRect(0, 0, w, h);
        ui(i);
      }
    }, { alpha: false, maxDpr: 1.75 });

    /* in pausa il rAF e completamente fermo: 0% CPU */
    stage.gate = function () { return reel.playing; };

    function play()  { reel.playing = true;  root.classList.add('is-playing');    btn.setAttribute('aria-label', 'Metti in pausa'); stage.sync(); }
    function pause() { reel.playing = false; root.classList.remove('is-playing'); btn.setAttribute('aria-label', 'Riproduci'); stage.sync(); stage.renderFrame(); }
    function toggle(){ reel.playing ? pause() : play(); }
    function seek(sec) { reel.time = Math.max(0, Math.min(TOTAL - .001, sec)); lastChap = -1; stage.renderFrame(); }

    btn.addEventListener('click', toggle);
    big.addEventListener('click', toggle);
    cv.addEventListener('click', toggle);

    var dragging = false;
    function seekFrom(e) {
      var r = track.getBoundingClientRect();
      seek(Math.max(0, Math.min(1, (e.clientX - r.left) / r.width)) * TOTAL);
    }
    track.addEventListener('pointerdown', function (e) {
      dragging = true; track.setPointerCapture(e.pointerId); seekFrom(e);
    });
    track.addEventListener('pointermove', function (e) { if (dragging) seekFrom(e); });
    track.addEventListener('pointerup', function (e) {
      dragging = false;
      try { track.releasePointerCapture(e.pointerId); } catch (x) { /* gia rilasciato */ }
    });
    track.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') { e.preventDefault(); seek(reel.time + 2); }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); seek(reel.time - 2); }
      else if (e.key === 'Home') { e.preventDefault(); seek(0); }
      else if (e.key === 'End') { e.preventDefault(); seek(TOTAL - .1); }
      else if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); toggle(); }
    });

    CLIPS.forEach(function (c, i) {
      var b = document.createElement('button');
      b.className = 'fr-chap'; b.type = 'button';
      b.style.left = (STARTS[i] / TOTAL * 100) + '%';
      b.style.width = (c.dur / TOTAL * 100) + '%';
      b.setAttribute('aria-label', 'Capitolo ' + (i + 1) + ': ' + c.name);
      b.innerHTML = '<i>' + (i + 1) + '. ' + c.name + '</i>';
      b.addEventListener('click', function (e) { e.stopPropagation(); seek(STARTS[i] + .02); if (!reel.playing) play(); });
      chaps.appendChild(b);
    });

    root.addEventListener('keydown', function (e) {
      if (e.target !== root) return;
      if (e.key === ' ' || e.key === 'k') { e.preventDefault(); toggle(); }
    });

    stage.renderFrame();
    ui(0);
  }

  /* ==========================================================  FORM CONTATTI */
  function initForm() {
    var form = $('#leadForm');
    if (!form) return;
    var status = $('#formStatus'), submit = $('#formSubmit');
    var renderedAt = Date.now();

    /* Le CTA di servizio/prodotto/corso preselezionano il campo interesse. */
    document.addEventListener('click', function (e) {
      var a = e.target.closest ? e.target.closest('[data-interesse]') : null;
      if (!a) return;
      var sel = form.elements.interesse;
      if (sel) sel.value = a.getAttribute('data-interesse');
    });

    var RULES = {
      nome:      function (v) { return v.trim().length >= 2 || 'Inserite nome e cognome.'; },
      email:     function (v) { return /^[^\s@,;<>()[\]\\]+@[^\s@.,;<>()[\]\\]+\.[A-Za-z]{2,63}$/.test(v.trim()) || 'Inserite un indirizzo email valido.'; },
      telefono:  function (v) { return !v.trim() || /^[+0-9][0-9\s.\-/()]{5,24}$/.test(v.trim()) || 'Numero di telefono non valido.'; },
      interesse: function (v) { return !!v || 'Selezionate di cosa avete bisogno.'; },
      messaggio: function (v) { return v.trim().length >= 20 || 'Descrivete la richiesta in almeno 20 caratteri.'; },
      consenso_privacy: function (v, el) { return el.checked || 'Dovete accettare l’informativa privacy per inviare.'; }
    };

    function fieldOf(name) { return form.querySelector('[data-field="' + name + '"]'); }
    function setError(name, msg) {
      var f = fieldOf(name); if (!f) return;
      var el = form.elements[name];
      var out = $('.field-error span', f);   /* solo lo span: l'icona resta */
      if (msg) {
        f.setAttribute('data-invalid', 'true');
        if (el) el.setAttribute('aria-invalid', 'true');
        if (out) out.textContent = msg;
      } else {
        f.removeAttribute('data-invalid');
        if (el) el.removeAttribute('aria-invalid');
      }
    }
    function validate(name) {
      var rule = RULES[name]; if (!rule) return true;
      var el = form.elements[name];
      var res = rule(el.value || '', el);
      setError(name, res === true ? null : res);
      return res === true;
    }

    /* validazione progressiva: al blur, poi live solo se gia segnalato */
    Object.keys(RULES).forEach(function (name) {
      var el = form.elements[name]; if (!el) return;
      el.addEventListener('blur', function () { validate(name); });
      el.addEventListener('input', function () {
        var f = fieldOf(name);
        if (f && f.getAttribute('data-invalid') === 'true') validate(name);
      });
      el.addEventListener('change', function () {
        var f = fieldOf(name);
        if (f && f.getAttribute('data-invalid') === 'true') validate(name);
      });
    });

    var counter = $('#msgCount'), msg = form.elements.messaggio;
    if (counter && msg) {
      var upd = function () { counter.textContent = msg.value.length + ' / 2000'; };
      msg.addEventListener('input', upd); upd();
    }

    function say(text, ok) {
      status.textContent = text;
      status.setAttribute('data-state', ok ? 'ok' : 'error');
      status.hidden = false;
    }
    function busy(on) {
      submit.disabled = on;
      submit.setAttribute('aria-busy', String(on));
      submit.innerHTML = on
        ? '<span class="spinner" aria-hidden="true"></span>Invio in corso&hellip;'
        : 'Richiedi l’analisi gratuita<svg class="arrow" aria-hidden="true"><use href="#i-arrow"/></svg>';
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var names = Object.keys(RULES);
      var bad = names.filter(function (n) { return !validate(n); });
      if (bad.length) {
        say('Controllate i campi segnalati: ' + bad.length + (bad.length === 1 ? ' campo non e valido.' : ' campi non sono validi.'), false);
        var first = form.elements[bad[0]];
        if (first && first.focus) first.focus();
        return;
      }

      var payload = {};
      names.concat(['azienda', 'budget']).forEach(function (n) {
        var el = form.elements[n];
        if (!el) return;
        payload[n] = el.type === 'checkbox' ? el.checked : el.value;
      });
      var mk = form.elements.consenso_marketing;
      payload.consenso_marketing = mk ? mk.checked : false;
      payload.website = (form.elements.website || {}).value || '';
      payload.ts = renderedAt;
      payload.source_page = location.pathname + location.hash;

      var utm = {};
      new URLSearchParams(location.search).forEach(function (v, k) { if (/^utm_/.test(k)) utm[k] = v; });
      payload.utm = Object.keys(utm).length ? utm : null;

      busy(true);
      status.hidden = true;
      var ctrl = new AbortController();
      var to = setTimeout(function () { ctrl.abort(); }, 15000);

      fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: ctrl.signal
      }).then(function (res) {
        return res.json().catch(function () { return {}; }).then(function (data) { return { res: res, data: data }; });
      }).then(function (r) {
        clearTimeout(to);
        busy(false);
        if (r.res.ok && r.data.ok) {
          form.innerHTML = '<div class="form-done" role="status" tabindex="-1">' +
            '<svg aria-hidden="true"><use href="#i-check"/></svg>' +
            '<h3 class="t-h3">Richiesta ricevuta.</h3>' +
            '<p class="muted">Vi rispondiamo entro un giorno lavorativo, da una persona vera. ' +
            'Se serve prima: <a href="mailto:ergest@flux-ai.it">ergest@flux-ai.it</a>.</p></div>';
          var done = $('.form-done', form); if (done) done.focus();
          return;
        }
        if (r.res.status === 422 && r.data.fields) {
          Object.keys(r.data.fields).forEach(function (k) { setError(k, r.data.fields[k]); });
          say('Alcuni campi non sono validi. Controllate le indicazioni qui sopra.', false);
          return;
        }
        say(r.data.message || 'Non siamo riusciti a inviare la richiesta. Scriveteci a ergest@flux-ai.it — rispondiamo subito.', false);
      }).catch(function (err) {
        clearTimeout(to);
        busy(false);
        say(err && err.name === 'AbortError'
          ? 'La richiesta ha impiegato troppo tempo. Riprovate, oppure scriveteci a ergest@flux-ai.it.'
          : 'Connessione non riuscita. Riprovate, oppure scriveteci a ergest@flux-ai.it.', false);
      });
    });
  }

  /* ==================================================================  BOOT */
  function boot() {
    var y = $('#year'); if (y) y.textContent = new Date().getFullYear();
    var frag = $('#iris-frag');
    if (frag) Iris.init($('#diaphragm'), frag.textContent.trim());
    initNav();
    initReveal();
    initCounters();
    initLit();
    initRail();
    initConsole();
    initPortraits();
    initShowreel();
    initForm();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
