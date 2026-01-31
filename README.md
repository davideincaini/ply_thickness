# Ply Thickness Calculator - PWA

## 📱 Cos'è una PWA?
Una Progressive Web App è un sito web che funziona come un'app nativa:
- ✅ Installabile sulla home screen
- ✅ Funziona offline
- ✅ Nessuna scadenza (funziona per sempre!)
- ✅ Nessun App Store necessario
- ✅ Funziona su iPhone, Android, PC, Mac

## 🚀 Come Installare

### Opzione 1: Hosting Gratuito con GitHub Pages (CONSIGLIATO)

1. **Crea un account GitHub** (se non ce l'hai già)
   - Vai su https://github.com
   - Clicca "Sign up"

2. **Crea un nuovo repository**
   - Clicca il + in alto a destra → "New repository"
   - Nome: `ply-calculator` (o quello che vuoi)
   - Spunta "Public"
   - Clicca "Create repository"

3. **Carica i file**
   - Clicca "uploading an existing file"
   - Trascina tutti i file della cartella `pwa`:
     - index.html
     - app.js
     - manifest.json
     - sw.js
     - icon-192.png (vedi sotto come crearla)
     - icon-512.png (vedi sotto come crearla)
   - Clicca "Commit changes"

4. **Attiva GitHub Pages**
   - Vai in Settings (del repository)
   - Scorri fino a "Pages" nella sidebar sinistra
   - Source: seleziona "main" branch
   - Clicca "Save"
   - Aspetta 1-2 minuti

5. **La tua app è online!**
   - URL: `https://[tuo-username].github.io/ply-calculator/`
   - Esempio: `https://davide.github.io/ply-calculator/`

### Opzione 2: Hosting Locale (per test)

1. **Installa Python** (se non ce l'hai già)
   
2. **Apri il terminale** nella cartella `pwa/`

3. **Avvia un server locale:**
   ```bash
   # Python 3
   python3 -m http.server 8000
   
   # Python 2
   python -m SimpleHTTPServer 8000
   ```

4. **Apri il browser** su `http://localhost:8000`

## 📐 Creare le Icone

### Metodo Semplice (Online):

1. Vai su https://favicon.io/favicon-generator/
2. Scrivi "PC" o usa l'emoji 📐
3. Scegli colore: blu (#007AFF)
4. Genera e scarica
5. Rinomina i file in:
   - `icon-192.png` (192x192px)
   - `icon-512.png` (512x512px)
6. Metti nella cartella `pwa/`

### Metodo Veloce (Temporaneo):
Qualsiasi immagine quadrata funziona! Basta che si chiami `icon-192.png` e `icon-512.png`

## 📲 Installare sul Telefono

### iPhone:
1. Apri Safari (non Chrome!)
2. Vai all'URL della tua app
3. Tocca il pulsante Condividi (quadrato con freccia)
4. Scorri e tocca "Aggiungi a Home"
5. Tocca "Aggiungi"
6. L'icona appare sulla home screen! 🎉

### Android:
1. Apri Chrome
2. Vai all'URL della tua app
3. Tocca i tre puntini (⋮)
4. Tocca "Installa app" o "Aggiungi a schermata Home"
5. Conferma
6. L'icona appare sulla home screen! 🎉

## 🎯 Vantaggi della PWA

| Feature | PWA | App Nativa (gratis) |
|---------|-----|---------------------|
| **Durata** | ♾️ Infinita | ⏱️ 7 giorni |
| **Offline** | ✅ Funziona | ✅ Funziona |
| **Aggiornamenti** | 🔄 Automatici | 🔌 Richiede Mac |
| **Multi-device** | ✅ iPhone, Android, PC | ❌ Solo iPhone |
| **Condivisione** | 🔗 Basta un link | ❌ Impossibile |
| **Costo** | 💰 Gratis | 💰 Gratis (ma limitato) |

## 🔄 Aggiornare l'App

1. Modifica i file su GitHub (o localmente)
2. Commit delle modifiche
3. L'app si aggiorna automaticamente al prossimo refresh!

## ❓ Troubleshooting

### L'app non si installa su iPhone
- Assicurati di usare **Safari** (non Chrome)
- Verifica di avere **HTTPS** (GitHub Pages lo fornisce automaticamente)

### L'app non funziona offline
- Controlla che `sw.js` sia caricato correttamente
- Apri Developer Tools → Application → Service Workers

### Icone non visibili
- Verifica che `icon-192.png` e `icon-512.png` esistano
- Controlla che i nomi siano esatti (lowercase)

## 📝 Files nella Cartella PWA

```
pwa/
├── index.html       # Struttura HTML dell'app
├── app.js          # Logica e calcoli
├── manifest.json   # Configurazione PWA
├── sw.js           # Service Worker (offline support)
├── icon-192.png    # Icona piccola (da creare)
├── icon-512.png    # Icona grande (da creare)
└── README.md       # Questo file
```

## 🎉 Fatto!

Ora hai un'app completamente funzionale che:
- ✅ Non scade mai
- ✅ Funziona offline
- ✅ È gratis per sempre
- ✅ Funziona su tutti i dispositivi
- ✅ Si aggiorna automaticamente

**Buon calcolo! 🚀**
