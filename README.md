# 🗳️ Live Poll App (Frontend + Backend in einem Container)

Ein einfaches WebSocket-basiertes Live-Umfrage-Tool.  
Ermöglicht, dass mehrere Teilnehmer in Echtzeit dieselbe Umfrage sehen, abstimmen und sofort die Ergebnisse verfolgen.  
Frontend und Backend laufen gemeinsam in **einem Docker-Container**.

---

## 🚀 Features

- Live-Synchronisierung aller Teilnehmer über WebSockets  
- Jeder Teilnehmer kann nur **einmal abstimmen**  
- Ergebnisse werden **in Echtzeit** angezeigt  
- Mehrere unabhängige Umfragen über `?poll=ID`  
- Komplette App in einem Container – kein externer Build nötig  
- Integration als `<iframe>` möglich  

---

## 🧱 Struktur

```
poll-app/
├─ server.js
├─ public/
│  └─ index.html
├─ package.json
├─ Dockerfile
└─ docker-compose.yml
```

---

## ⚙️ Voraussetzungen

- Docker & Docker Compose installiert  
- Node.js ist nur für lokale Entwicklung nötig (nicht im Container)

---

## 🐳 Start mit Docker

1. **Container bauen und starten:**

   ```bash
   docker-compose up --build
   ```

2. **App öffnen:**  
   [http://localhost:3000/?poll=demo](http://localhost:3000/?poll=demo)

   Alle Teilnehmer, die dieselbe URL öffnen, sehen dieselbe Live-Umfrage.

---

## 🧠 Nutzung

### 1. Neue Umfrage erstellen
- Öffne eine URL wie `http://localhost:3000/?poll=xyz`
- Gib eine Frage und mehrere Antworten ein (eine pro Zeile)
- Klicke **„Umfrage erstellen“**

### 2. Umfrage starten
- Klicke **„▶️ Umfrage starten“**, damit alle Teilnehmer abstimmen können

### 3. Abstimmen
- Jeder Teilnehmer klickt auf eine Antwort → Buttons verschwinden, Ergebnisse erscheinen

### 4. Neue Umfrage
- Klicke **„🔄 Neue Umfrage“**, um die Umfrage zurückzusetzen

---

## 🧩 Integration per iFrame

Du kannst die Anwendung direkt in eine andere Webseite einbetten:

```html
<iframe src="https://deinserver.de/?poll=feedback" width="600" height="400"></iframe>
```

---

## 🧰 Entwicklung ohne Docker

```bash
npm install
npm start
```

Dann öffne: [http://localhost:3000/?poll=test](http://localhost:3000/?poll=test)

---

## 🧩 API / Nachrichtenstruktur

Die Kommunikation erfolgt über WebSockets (`ws://.../?poll=xyz`).

**Aktionen (Client → Server):**
| Aktion | Beschreibung |
|--------|---------------|
| `create` | Neue Umfrage erstellen |
| `start` | Umfrage starten |
| `vote` | Stimme abgeben |
| `reset` | Neue Umfrage starten |

---

## 📦 Lizenz

MIT License – frei nutzbar für eigene oder kommerzielle Projekte.