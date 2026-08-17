# MCP Server fal.ai — Flux AI

Configurazione del server MCP ufficiale di **fal.ai**, che dà a Claude accesso diretto
alla piattaforma fal: ricerca modelli, lettura degli schemi, pricing, esecuzione di
inferenze (immagini, video, audio), upload file e ricerca nella documentazione.

- **Endpoint:** `https://mcp.fal.ai/mcp`
- **Transport:** HTTP (streamable)
- **Auth:** header `Authorization: Bearer <FAL_KEY>` — la chiave viaggia a ogni
  richiesta e **non viene memorizzata** sul server fal.

---

## 1. Ottenere la chiave API

1. Vai su <https://fal.ai/dashboard/keys>
2. Crea una nuova API key
3. Copiala (viene mostrata una sola volta)

## 2. Configurare la chiave in locale

```bash
cp .env.example .env
# apri .env e incolla la chiave in FAL_KEY=
```

`.env` è già in `.gitignore`: **la chiave non finisce mai su Git.**

Perché Claude Code possa espandere `${FAL_KEY}` dentro `.mcp.json`, la variabile deve
essere presente nell'ambiente della shell da cui lanci Claude:

```bash
# opzione A — carica il .env nella sessione corrente
export $(grep -v '^#' .env | xargs)

# opzione B — rendila permanente (zsh)
echo 'export FAL_KEY="la-tua-chiave"' >> ~/.zshrc && source ~/.zshrc
```

## 3. Attivare il server

Il file [`.mcp.json`](.mcp.json) in root del progetto è già configurato:

```json
{
  "mcpServers": {
    "fal-ai": {
      "type": "http",
      "url": "https://mcp.fal.ai/mcp",
      "headers": { "Authorization": "Bearer ${FAL_KEY}" }
    }
  }
}
```

Riavvia Claude Code nella cartella del progetto e verifica:

```bash
claude mcp list
# fal-ai: https://mcp.fal.ai/mcp (HTTP) - ✓ Connected
```

`.claude/settings.json` contiene `enabledMcpjsonServers: ["fal-ai"]`, quindi il server
viene approvato automaticamente senza prompt a ogni avvio.

### Alternativa: registrazione via CLI (scope utente, tutti i progetti)

```bash
claude mcp add --transport http fal-ai https://mcp.fal.ai/mcp \
  --header "Authorization: Bearer $FAL_KEY" \
  --scope user
```

### Altri client

<details>
<summary>Cursor / Windsurf / Claude Desktop</summary>

```json
{
  "mcpServers": {
    "fal-ai": {
      "url": "https://mcp.fal.ai/mcp",
      "headers": { "Authorization": "Bearer LA_TUA_FAL_KEY" }
    }
  }
}
```

Claude Desktop legge `~/Library/Application Support/Claude/claude_desktop_config.json`
su macOS; questi client non espandono `${FAL_KEY}`, va incollata la chiave in chiaro.
</details>

---

## 4. Tool disponibili

| Categoria | Tool | Uso |
|---|---|---|
| Discovery | `search_models` | Cerca tra i modelli del catalogo fal |
| Discovery | `get_model_schema` | Input/output schema di un modello |
| Discovery | `get_pricing` | Costo per esecuzione di un modello |
| Discovery | `search_docs` | Ricerca nella documentazione fal |
| Execution | `run_model` | Esegue un modello e attende il risultato (sincrono) |
| Execution | `submit_job` | Accoda un job long-running (asincrono) |
| Execution | `check_job` | Stato/risultato di un job accodato |
| Utility | `upload_file` | Carica un file sullo storage fal e restituisce l'URL |

## 5. Esempi d'uso per Flux AI

- **Asset per i siti cliente:** «Cerca su fal un modello text-to-image, controlla il
  prezzo, e genera un hero image in stile wireframe geometrico con gradiente
  blu → ciano → lime.»
- **Video per landing page:** «Genera con fal una clip di 5 secondi del logo animato,
  usa `submit_job` e poi `check_job`.»
- **Integrazione n8n:** «Recupera lo schema del modello X con `get_model_schema` così
  costruisco il body della chiamata HTTP nel workflow n8n.»

## 6. Troubleshooting

| Problema | Causa / fix |
|---|---|
| `✗ Failed to connect` | `FAL_KEY` non esportata nella shell → `echo $FAL_KEY` deve stampare la chiave, poi riavvia Claude Code |
| `401 Unauthorized` | Chiave revocata o header malformato: deve essere `Bearer <chiave>`, con uno spazio solo |
| Il server non compare | Sei fuori dalla root del progetto: `.mcp.json` viene letto solo dalla cartella in cui lanci Claude |
| `403` dietro proxy aziendale | `mcp.fal.ai` va aggiunto alla allowlist di rete |

## 7. Sicurezza

- La `FAL_KEY` non è **mai** committata: sta solo in `.env` (ignorato da Git).
- Ogni chiamata fal è a consumo — controlla `get_pricing` prima di lanciare
  generazioni video in serie.
- Se una chiave viene esposta, revocala subito da <https://fal.ai/dashboard/keys>.
