# Istruzioni per iPhone - Aggiungere l'App alla Home Screen

## ⚠️ Importante: Deployment Necessario

Per poter aggiungere la PWA alla home screen del tuo iPhone, l'applicazione **deve essere deployata online** (non funziona con localhost).

## Opzioni di Deployment

### Opzione 1: GitHub Pages (Consigliato - Gratuito)

1. **Crea un repository su GitHub**:
   - Vai su https://github.com e crea un nuovo repository
   - Carica tutti i file della cartella `pwa-3`

2. **Attiva GitHub Pages**:
   - Vai su Settings → Pages
   - Source: seleziona "Deploy from a branch"
   - Branch: seleziona "main" (o il tuo branch principale)
   - Folder: seleziona "/ (root)"
   - Clicca "Save"

3. **La tua app sarà disponibile su**:
   - `https://[tuo-username].github.io/[nome-repository]/`

### Opzione 2: Netlify (Alternativa gratuita)

1. Vai su https://app.netlify.com
2. Trascina la cartella `pwa-3` nell'area di drop
3. La tua app sarà online immediatamente

## Come Aggiungere alla Home Screen (iPhone)

Una volta che l'app è online:

1. **Apri Safari** sul tuo iPhone (non Chrome o altri browser)
2. **Naviga all'URL** della tua app deployata
3. **Tocca il pulsante "Condividi"** (l'icona con la freccia verso l'alto) nella barra inferiore
4. **Scorri verso il basso** e tocca **"Aggiungi a Home"**
5. **Personalizza il nome** se vuoi (es. "Ply Calc")
6. **Tocca "Aggiungi"** in alto a destra

## ✅ Verifiche dopo il Deployment

Dopo aver deployato l'app, verifica che:
- Il manifest.json sia accessibile (apri `https://tuo-sito.com/manifest.json`)
- Le icone siano visibili
- Il service worker si registri correttamente (guarda la console del browser)

## 🐛 Problemi Comuni

**Errore 404 quando apro l'app dalla home screen:**
- ✅ RISOLTO: Abbiamo modificato `manifest.json` per usare percorsi relativi (`./` invece di `/`)
- ✅ RISOLTO: Service worker aggiornato per cachare correttamente tutti i file

**L'app non si aggiorna:**
- Cancella la cache del browser
- Rimuovi l'app dalla home screen e aggiungila di nuovo

## 📝 Note

- **iPhone richiede Safari**: Solo Safari supporta l'aggiunta di PWA alla home screen su iOS
- **HTTPS richiesto**: GitHub Pages e Netlify forniscono automaticamente HTTPS
- **Offline funziona**: Grazie al service worker, l'app funzionerà anche senza connessione dopo il primo caricamento
