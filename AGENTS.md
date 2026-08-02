# Istruzioni per gli agenti — sito Flux AI

Rispondi in italiano.

## Prima di iniziare

Leggi **[OBIETTIVI-2026.md](OBIETTIVI-2026.md)**. È il goal condiviso di tutti
gli agenti su questo repository, con scadenza 31 dicembre 2026. Lo stato di
avanzamento di ogni voce vive nel database Notion **🎯 Obiettivi 2026** dentro
📌 CRM (Dashboard), non in questo repo.

Se in Obiettivi 2026 c'è una riga aperta con il tuo nome, si finisce quella
prima di aprire qualsiasi altro lavoro. Nessun agente prende un obiettivo
assegnato a un altro.

## Che cos'è questo repository

Il sito pubblico di Flux AI. HTML, CSS e JavaScript scritti a mano, **nessun
framework e nessuna compilazione**: si apre `index.html` e funziona.

```
index.html          la pagina, sezione per sezione
assets/css/style.css
assets/js/main.js   animazioni, contatori, la linea del Flusso
assets/img/
```

In produzione su Vercel (progetto `flux-ai`); GitHub Pages serve lo stesso
contenuto come specchio. **GitHub Pages non può eseguire codice lato server:**
appena esiste una cartella `api/`, i due indirizzi smettono di essere
equivalenti e la produzione è solo Vercel.

## Direzione visiva — «Strumentazione»

Il sito ha una tesi: sembra uno strumento di misura, non una brochure.
Superficie chiara, inchiostro quasi nero, e il verde `#059669` usato **come un
LED, solo dove c'è un'azione**. Tipografia Bricolage Grotesque per i titoli,
Source Serif 4 per il testo, JetBrains Mono per i dati.

Non introdurre gradienti viola-blu, card arrotondate con barretta d'accento,
emoji come marcatori di sezione, o tutto centrato. Sono i luoghi comuni del
design generato: questo sito è stato rifatto apposta per non assomigliarci.

Se aggiungi un numero in pagina, deve essere **misurato**, non promesso: è il
punto della direzione visiva. Vedi la Fase 2 in OBIETTIVI-2026.md.

## Regole non negoziabili

1. **Nessun segreto nel repository.** Questo repo è pubblico. Chiavi e token
   stanno nelle variabili d'ambiente di Vercel, mai nel codice, mai negli URL
   dei remote git, mai in un file tracciato.
2. **Niente API di Notion dal browser.** L'unico punto di scrittura verso il
   CRM è una funzione serverless. Un token nel sorgente della pagina è accesso
   in scrittura a tutto il CRM per chiunque apra gli strumenti da sviluppatore.
3. **Nessun dato commerciale in chiaro qui dentro.** Fatturato, nomi dei
   clienti, numeri di lead e valutazioni interne stanno su Notion e nel vault
   privato. Questo repository è indicizzato.
4. **Niente di nuovo finché l'ultimo costruito non è in produzione.**
5. Si committa sul branch di lavoro; il merge su `main` lo decide Ergest.

## Contesto

- `contesto.md` — cronologia delle sessioni di lavoro sul sito
- `PROMPT_RESTYLING_FLUX_AI.md` — il brief del restyling di agosto 2026
- `index.html.backup-2026-08-01` — la versione precedente, tenuta come
  riferimento; non è più il sito
