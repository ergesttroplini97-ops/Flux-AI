# 🚀 Flux AI - Deployment & Credentials Management

## 📋 Quick Setup

Questo file documenta come Claude può aggiornare automaticamente il repository GitHub.

---

## 🔐 Credenziali e Chiavi API

### File: `.env.local` (NON tracciato da git)

Il file `.env.local` contiene tutte le credenziali necessarie:

```env
# GitHub Credentials (salvati in .env.local locale)
GITHUB_USERNAME=ergesttroplini97-ops
GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
GITHUB_REPO=Flux-AI

# API Keys (aggiungi le tue chiavi qui)
# OPENAI_API_KEY=sk-...
# CLAUDE_API_KEY=...
# VERCEL_TOKEN=...
# NETLIFY_TOKEN=...
```

**⚠️ Nota:** I token veri sono salvati solo nel file `.env.local` locale, non su GitHub

**⚠️ IMPORTANTE:** Questo file non è tracciato da git (vedi `.gitignore`)

---

## 🤖 Come Claude Fa il Deploy Automatico

### Comando per l'Update automatico:

```bash
cd "C:/Users/erges/Desktop/Flux AI"

# Carica le credenziali
source .env.local

# Commit e Push automatico
git add .
git commit -m "Update: [descrizione modifica]"
git push https://${GITHUB_TOKEN}@github.com/${GITHUB_USERNAME}/${GITHUB_REPO}.git main
```

### Cosa Chiedi a Claude:

Basta dire:
> "Aggiorna il sito Flux AI su GitHub con [descrizione modifica]"

E Claude farà automaticamente:
1. ✅ Legge le credenziali da `.env.local`
2. ✅ Fa il commit con messaggio descrittivo
3. ✅ Pusha su GitHub
4. ✅ GitHub Pages si aggiorna automaticamente

---

## 📱 GitHub Pages Deployment

**URL Live:** `https://ergesttroplini97-ops.github.io/Flux-AI`

Configurazione:
- Source: `main` branch, root `/`
- Auto-deploys on push

---

## 🔧 Aggiungere Altre Credenziali

Aggiungi nel file `.env.local`:

```env
# Vercel (deploy alternativo)
VERCEL_TOKEN=vercel_xxxxxxxxxxxxxxxx
VERCEL_PROJECT_ID=prj_xxxxxxxxxxxxxxxx

# Netlify
NETLIFY_TOKEN=nf_xxxxxxxxxxxxxxxx
NETLIFY_SITE_ID=site-xxxxxxxxxxxxxxxx

# OpenAI (per integrazioni AI future)
OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxx

# Stripe (se usi pagamenti)
STRIPE_API_KEY=sk_live_xxxxxxxxxxxxxxxx
STRIPE_PUBLISHABLE_KEY=pk_live_xxxxxxxxxxxxxxxx
```

---

## 🛡️ Sicurezza

- `.env.local` è in `.gitignore` → non va su GitHub
- Solo tu e Claude avete accesso alle credenziali locali
- Nessun token è esposto pubblicamente

---

## 📊 Ultimo Deploy

- **Repo:** https://github.com/ergesttroplini97-ops/Flux-AI
- **Branch:** main
- **Status:** ✅ Online
- **URL:** https://ergesttroplini97-ops.github.io/Flux-AI

---

## 📝 Comandi Utili

```bash
# Check status
git status

# View recent commits
git log --oneline -5

# Manual push (se necessario)
git push origin main

# Pull updates from GitHub
git pull origin main
```

---

Generated: 29 Marzo 2026
