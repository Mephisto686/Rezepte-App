# Firebase AI Logic (Gemini) – Setup-Anleitung

Diese Schritte sind **einmalig** in der Firebase Console nötig, bevor die neuen
KI-Funktionen (v3.2.0) live funktionieren. Der Code ist bereits fertig –
es fehlen nur zwei Werte in `index.html`.

## 1. AI Logic aktivieren

1. [Firebase Console](https://console.firebase.google.com/) → Projekt `rezepte-multi-user`
2. Linkes Menü → **AI Services → AI Logic**
3. **Get started** klicken
4. Als Gemini-API-Provider **„Gemini Developer API"** wählen (kostenlos, kein Billing nötig)
5. Den Workflow durchklicken – dabei wird automatisch **App Check** für AI Logic aktiviert

## 2. App Check mit reCAPTCHA v3 einrichten (Produktions-Schutz)

1. Firebase Console → **Security → App Check → Apps**
2. Deine Web-App auswählen → **reCAPTCHA v3** als Provider registrieren
   (führt dich zu [Google reCAPTCHA Admin Console](https://www.google.com/recaptcha/admin) falls noch kein Key existiert)
3. Als Domains eintragen:
   - `rezepte-multi-user.web.app`
   - `mephisto686.github.io`
   - eure neue "schöne" Hosting-URL (falls schon angelegt)
4. Den generierten **Site-Key** kopieren

## 3. Site-Key in den Code eintragen

In `index.html` suchen nach:
```js
const RECAPTCHA_SITE_KEY = 'TODO_RECAPTCHA_SITE_KEY';
```
Und durch den echten Key ersetzen.

## 4. Lokale Entwicklung (Debug-Token)

Beim Testen auf `localhost` NICHT `localhost` bei reCAPTCHA freischalten (Sicherheitsrisiko!).
Stattdessen den Debug-Provider nutzen:

1. In `index.html`, im `<script type="module">`-Block, die Zeile
   ```js
   // self.FIREBASE_APPCHECK_DEBUG_TOKEN = true;
   ```
   auskommentieren → aktivieren (Kommentarzeichen entfernen)
2. App lokal öffnen, Browser-Konsole öffnen → Debug-Token wird dort ausgegeben
3. Firebase Console → **Security → App Check → Apps** → eure App → **⋮ → Manage debug tokens** → Token eintragen
4. **Wichtig:** Vor dem Commit/Deploy die Zeile wieder auskommentieren! Nie mit `true` live gehen.

## 5. Vertex AI aktivieren (Pflicht – nicht mehr optional!)

**Update Juli 2026:** Google hat die Gemini Developer API im März 2026 auf ein separates
Prepaid-Guthaben umgestellt. Sobald auf einem Google-Cloud-Projekt Billing aktiv ist (bei euch
der Fall, ihr seid auf Blaze), gibt es dort keinen kostenlosen Gemini-Modus mehr – jeder Call
würde ein leeres, nie aufgeladenes Prepay-Wallet ansprechen und mit
"Your prepayment credits are depleted" fehlschlagen.

Deshalb läuft jetzt **alles** über Vertex AI statt der Gemini Developer API – Vertex AI bucht
normal gegen euer bestehendes Cloud-Billing (Blaze-Guthaben), nicht gegen das separate Prepay-Wallet:

1. Firebase Console → **AI Logic** → **Vertex AI Gemini API** einrichten
   (Link erscheint im AI-Logic-Dashboard, "Set up Vertex AI Gemini API")
2. Das ist bei euch unkompliziert, da ihr schon auf **Blaze** mit Guthaben seid – keine neue Kreditkarte nötig
3. Kosten sind minimal (Gemini Flash: Bruchteile eines Cents pro Anfrage) – bei privater Nutzung
   zu zweit im Cent-Bereich pro Monat, leicht vom vorhandenen Guthaben gedeckt

## 6. Testen

Nach Deploy: Rezept-Foto importieren, Nährwerte schätzen lassen und
"Im Internet suchen" ausprobieren. Bei Fehlern zuerst die Browser-Konsole
prüfen – App-Check-Fehler zeigen sich dort deutlich (401/403 mit
"App Check token" im Fehlertext).

## Was sich geändert hat

- Kein Anthropic-API-Key mehr im Einstellungen-Screen
- Alle KI-Aufrufe laufen über `window.geminiText`, `window.geminiJSON`,
  `window.geminiRecipeBlock` und `window.geminiSearch` (definiert im neuen
  `<script type="module">`-Block direkt nach der Firebase-Config)
- Modell: `gemini-2.5-flash` (in der Konstante `GEMINI_MODEL` änderbar,
  z.B. auf `gemini-3.5-flash` für das neueste Modell)
