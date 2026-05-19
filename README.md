# 👅 Tongue Tech Feed

> Un feed di notizie tech in tempo reale, powered by [Hacker News API](https://github.com/HackerNews/API).

![Preview](https://via.placeholder.com/900x400/0d0d0d/ff4d00?text=Tongue+Tech+Feed)

## 🔗 Live Demo

**[→ Prova l'applicazione online](https://astonishing-frangipane-d9da0a.netlify.app)**

---

## 📖 Descrizione

Tongue Tech Feed è un'applicazione web che aggrega le ultime notizie tecnologiche da Hacker News, presentandole in un'interfaccia editoriale moderna e leggibile.

L'app è stata sviluppata per **Tongue**, media digitale italiano con quasi 3 milioni di follower su Instagram, con l'obiettivo di democratizzare l'informazione tech.

---

## ✨ Funzionalità

- 📰 **Caricamento iniziale** di 10 notizie all'avvio
- ➕ **Load More** progressivo (10 notizie per volta) senza ricaricare la pagina
- 🕐 **Tempo relativo** ("2 ore fa", "3 giorni fa")
- 🌐 **Dominio visibile** per ogni fonte
- ⚡ **Gestione errori** con retry automatico
- 🎨 **Design editoriale** dark, responsive su mobile

---

## 🏗️ Architettura

```
src/
├── js/
│   ├── api/
│   │   └── hackerNews.js      # Chiamate HTTP alle API HN
│   ├── components/
│   │   └── NewsCard.js        # Componente UI card notizia
│   ├── patterns/
│   │   └── NewsRepository.js  # Pattern Repository (disaccoppiamento API/UI)
│   └── utils/
│       └── formatters.js      # Funzioni pure (date, domain, shape)
├── css/
│   └── main.css
tests/
├── formatters.test.js         # Unit test funzioni pure
└── NewsRepository.test.js     # Integration test Repository
```

### 🧩 Design Pattern: Repository

Il **Repository Pattern** disaccoppia la logica di accesso ai dati (API HN) dai componenti UI. I componenti non sanno nulla degli endpoint; dipendono solo dal `NewsRepository`.

**Vantaggi:**
- I test possono fare mock del repository senza toccare il network
- Le trasformazioni dati avvengono in un solo posto
- Cambiare la sorgente dati richiede modifiche solo nel repository

---

## 🛠️ Tecnologie

| Tool | Utilizzo |
|------|---------|
| **Vite** | Bundler + dev server (ES Modules nativi) |
| **Vitest** | Unit test + integration test |
| **Vanilla JS (ES6+)** | Logica applicativa |
| **CSS Custom Properties** | Theming e design system |
| **Hacker News API** | Fonte dati |

---

## 🚀 Avvio locale

```bash
# 1. Installa dipendenze
npm install

# 2. Avvia il server di sviluppo
npm run dev

# 3. Apri http://localhost:5173
```

### Test

```bash
# Esegui i test
npm test

# Test in modalità CI (no watch)
npm run test:run

# Con coverage
npm run test:coverage
```

### Build produzione

```bash
npm run build
# Output in /dist — pronto per Netlify/Firebase
```

---

## 📁 Come deployare su Netlify

1. Fork/clona questo repository
2. Collega il repo a [Netlify](https://netlify.com)
3. Impostazioni build:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
4. Deploy!

---

## 👤 Autore

Sviluppato come progetto del corso **JavaScript Advanced** per Tongue.

---

## 📄 Licenza

MIT
