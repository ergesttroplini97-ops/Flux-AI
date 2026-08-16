/* ==========================================================================
   FLUX AI - comportamento
   ========================================================================== */

/* ##########################################################################
   ###                                                                    ###
   ###   DATI PROVVISORI - DA SOSTITUIRE CON QUELLI REALI                 ###
   ###                                                                    ###
   ###   Sono tutti qui dentro, in un posto solo. Cambia i numeri sotto   ###
   ###   e la home si aggiorna: non c'e' nient'altro da toccare.          ###
   ###                                                                    ###
   ###   Finche' "provvisorio" resta true, ogni numero in pagina mostra   ###
   ###   una tilde (~) e sotto la fascia compare una riga che avvisa.     ###
   ###   Metti provvisorio: false quando i dati sono veri: la tilde e     ###
   ###   l'avviso spariscono da soli.                                     ###
   ###                                                                    ###
   ########################################################################## */

const METRICHE = {
  provvisorio: true,

  voci: [
    { valore: 34,   suffisso: '',    etichetta: 'Progetti consegnati' },
    { valore: 1240, suffisso: 'h',   etichetta: 'Ore automatizzate' },
    { valore: 12,   suffisso: '',    etichetta: 'Clienti attivi' },
    { valore: 5,    suffisso: ' su 5', etichetta: 'Valutazione media', decimali: 1, valoreEsatto: 4.8 }
  ]
};

/* ========================================================================== */

(function () {
  'use strict';

  const ridotto = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* --- Fascia dati -------------------------------------------------------- */
  const strip = document.querySelector('[data-datastrip]');

  if (strip) {
    strip.innerHTML = '';

    METRICHE.voci.forEach(function (voce) {
      const cella = document.createElement('div');
      if (METRICHE.provvisorio) cella.className = 'provvisorio';

      const v = document.createElement('span');
      v.className = 'v';
      v.dataset.a = String(voce.valoreEsatto !== undefined ? voce.valoreEsatto : voce.valore);
      v.dataset.dec = String(voce.decimali || 0);
      v.dataset.suf = voce.suffisso || '';
      v.textContent = '0' + (voce.suffisso || '');

      const k = document.createElement('span');
      k.className = 'k label';
      k.textContent = voce.etichetta;

      cella.append(v, k);
      strip.append(cella);
    });

    if (METRICHE.provvisorio) {
      const nota = document.createElement('p');
      nota.className = 'datastrip-note';
      nota.textContent = 'Dati indicativi, in corso di verifica.';
      strip.append(nota);
    }
  }

  /* Conteggio: parte quando la fascia entra in vista, una volta sola. */
  function conta(el) {
    const meta = parseFloat(el.dataset.a);
    const dec = parseInt(el.dataset.dec, 10) || 0;
    const suf = el.dataset.suf || '';

    if (ridotto) {
      el.textContent = meta.toFixed(dec) + suf;
      return;
    }

    const durata = 1100;
    const t0 = performance.now();

    function passo(t) {
      const p = Math.min((t - t0) / durata, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = (meta * eased).toFixed(dec) + suf;
      if (p < 1) requestAnimationFrame(passo);
    }
    requestAnimationFrame(passo);
  }

  /* --- Comparsa dei blocchi ---------------------------------------------- */
  const osservatore = new IntersectionObserver(function (voci) {
    voci.forEach(function (v) {
      if (!v.isIntersecting) return;
      v.target.classList.add('is-in');
      v.target.querySelectorAll('[data-a]').forEach(conta);
      osservatore.unobserve(v.target);
    });
  }, { threshold: .15, rootMargin: '0px 0px -8% 0px' });

  document.querySelectorAll('[data-reveal]').forEach(function (el) {
    osservatore.observe(el);
  });

  /* --- Il Flusso ---------------------------------------------------------- */
  /* Una linea sola che attraversa la pagina. Sostituisce lo sfondo animato:
     stessa presenza visiva, ma significa qualcosa - l'azienda si chiama Flux. */
  const flux = document.querySelector('[data-flux] .stroke');
  const trace = document.querySelector('[data-flux] .trace');

  function disegnaFlusso() {
    if (!flux) return;

    const h = window.innerHeight;
    const w = window.innerWidth;
    const x = w * .5;
    const ampiezza = Math.min(w * .26, 300);

    /* Curva morbida a quattro anse: sempre la stessa forma, cosi' e' un
       marchio e non un effetto casuale. */
    const d = [
      'M', x - ampiezza * .8, -40,
      'C', x + ampiezza * .5, h * .18, x - ampiezza, h * .34, x + ampiezza * .2, h * .5,
      'C', x + ampiezza * 1.1, h * .64, x - ampiezza * .6, h * .8, x + ampiezza * .35, h + 40
    ].join(' ');

    flux.setAttribute('d', d);
    if (trace) trace.setAttribute('d', d);

    const lung = flux.getTotalLength();
    flux.style.strokeDasharray = lung;
    flux.dataset.len = lung;
    aggiornaFlusso();
  }

  function aggiornaFlusso() {
    if (!flux || !flux.dataset.len) return;
    const lung = parseFloat(flux.dataset.len);
    /* documentElement, non body: con body il massimo risulta piu' alto del
       vero e la linea non arriva mai in fondo. */
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const p = max > 0 ? Math.min(window.scrollY / max, 1) : 0;
    flux.style.strokeDashoffset = lung * (1 - p);
  }

  /* --- Header e navigazione ---------------------------------------------- */
  const header = document.querySelector('.site-header');
  const nav = document.querySelector('.nav');
  const toggle = document.querySelector('.nav-toggle');
  const sezioni = Array.from(document.querySelectorAll('main section[id]'));
  const voci = Array.from(document.querySelectorAll('.nav a[href^="#"]'));

  function aggiornaHeader() {
    if (header) header.dataset.stuck = window.scrollY > 8 ? 'true' : 'false';

    /* Voce di menu attiva: l'ultima sezione il cui inizio e' gia' passato.
       In fondo alla pagina vince sempre l'ultima: le sezioni corte non
       arriverebbero mai alla soglia e resterebbe evidenziata quella prima. */
    let attiva = null;
    const inFondo = window.innerHeight + window.scrollY >=
                    document.documentElement.scrollHeight - 2;

    if (inFondo && sezioni.length) {
      attiva = sezioni[sezioni.length - 1].id;
    } else {
      for (const s of sezioni) {
        if (s.getBoundingClientRect().top <= window.innerHeight * .35) attiva = s.id;
      }
    }
    voci.forEach(function (a) {
      const suo = a.getAttribute('href').slice(1) === attiva;
      if (suo) a.setAttribute('aria-current', 'true');
      else a.removeAttribute('aria-current');
    });
  }

  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      const aperto = nav.dataset.open === 'true';
      nav.dataset.open = String(!aperto);
      toggle.setAttribute('aria-expanded', String(!aperto));
      toggle.textContent = aperto ? 'Menu' : 'Chiudi';
    });

    nav.addEventListener('click', function (e) {
      if (e.target.tagName !== 'A') return;
      nav.dataset.open = 'false';
      toggle.setAttribute('aria-expanded', 'false');
      toggle.textContent = 'Menu';
    });

    document.addEventListener('keydown', function (e) {
      if (e.key !== 'Escape' || nav.dataset.open !== 'true') return;
      nav.dataset.open = 'false';
      toggle.setAttribute('aria-expanded', 'false');
      toggle.textContent = 'Menu';
      toggle.focus();
    });
  }

  /* --- Ascolto scroll, una chiamata per frame ----------------------------- */
  let inCoda = false;
  window.addEventListener('scroll', function () {
    if (inCoda) return;
    inCoda = true;
    requestAnimationFrame(function () {
      aggiornaHeader();
      aggiornaFlusso();
      inCoda = false;
    });
  }, { passive: true });

  let tRidim;
  window.addEventListener('resize', function () {
    clearTimeout(tRidim);
    tRidim = setTimeout(disegnaFlusso, 150);
  });


  /* --- Modulo contatti --------------------------------------------------- */
  const moduloLead = document.querySelector('[data-lead-form]');
  if (moduloLead) {
    const statoForm = moduloLead.querySelector('[data-form-status]');
    const pulsante = moduloLead.querySelector('button[type="submit"]');

    function mostraStato(testo, tipo) {
      statoForm.textContent = testo;
      if (tipo) statoForm.dataset.state = tipo;
      else delete statoForm.dataset.state;
    }

    moduloLead.addEventListener('submit', async function (evento) {
      evento.preventDefault();
      if (!moduloLead.reportValidity()) return;

      pulsante.disabled = true;
      mostraStato('Invio in corso…');

      const controller = new AbortController();
      const timeout = setTimeout(function () { controller.abort(); }, 12000);

      try {
        const dati = new FormData(moduloLead);
        const payload = Object.fromEntries(dati.entries());
        payload.consenso = moduloLead.elements.consenso.checked;

        const risposta = await fetch('/api/lead', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
          signal: controller.signal
        });
        const risultato = await risposta.json().catch(function () { return {}; });

        if (!risposta.ok || risultato.ok !== true) {
          throw new Error(risultato.message || 'Invio non riuscito.');
        }

        moduloLead.reset();
        mostraStato('Richiesta ricevuta. Ti ricontatteremo personalmente.', 'success');
      } catch (errore) {
        const messaggio = errore.name === 'AbortError'
          ? 'Tempo scaduto. Riprova tra poco.'
          : errore.message || 'Invio non riuscito. Scrivi a ergest@flux-ai.it.';
        mostraStato(messaggio, 'error');
      } finally {
        clearTimeout(timeout);
        pulsante.disabled = false;
      }
    });
  }

  /* --- Anno nel footer ---------------------------------------------------- */
  const anno = document.querySelector('[data-anno]');
  if (anno) anno.textContent = new Date().getFullYear();

  disegnaFlusso();
  aggiornaHeader();
})();
