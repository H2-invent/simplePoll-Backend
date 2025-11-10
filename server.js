const express = require("express");
const cors = require("cors");
const http = require("http");
const { WebSocketServer } = require("ws");
const { v4: uuidv4 } = require("uuid");

const app = express();
app.use(cors());
app.use(express.static("public")); // Frontend wird hiermit serviert

const server = http.createServer(app);
const wss = new WebSocketServer({ server });

// Poll-Status
let poll = {
  state: "editing",      // editing | created | started
  question: "",
  options: [],
  votes: [],             // Anzahl Stimmen pro Option
  votedClients: {},      // { clientId: true }
};

wss.on("connection", (ws) => {
  // Jeder Client bekommt eine eindeutige ID
  const clientId = uuidv4();
  ws.clientId = clientId;

  // Initialen Poll-Zustand senden
  ws.send(JSON.stringify(poll));

  ws.on("message", (msg) => {
    try {
      const data = JSON.parse(msg);

      switch (data.action) {
        case "create":
          // Neue Umfrage erstellen
          poll = {
            state: "created",
            question: data.question,
            options: data.options,
            votes: new Array(data.options.length).fill(0),
            votedClients: {},
          };
          break;

        case "start":
          if (poll.state === "created") poll.state = "started";
          break;

        case "vote":
          if (poll.state === "started") {
            // Prüfen, ob dieser Client schon abgestimmt hat
            if (!poll.votedClients[ws.clientId]) {
              poll.votes[data.index]++;
              poll.votedClients[ws.clientId] = true;

              // Feedback nur an diesen Client, dass er abgestimmt hat
              ws.send(JSON.stringify({ ...poll, yourVoteDone: true }));
            }
          }
          break;

        case "reset":
          poll = {
            state: "editing",
            question: "",
            options: [],
            votes: [],
            votedClients: {},
          };
          break;
      }

      // Poll an alle Clients broadcasten
      broadcast(poll);
    } catch (err) {
      console.error("Fehler:", err);
    }
  });

  ws.on("close", () => console.log("Client disconnected"));
});

// Broadcast-Funktion
function broadcast(data) {
  const msg = JSON.stringify(data);
  wss.clients.forEach((client) => {
    if (client.readyState === 1) client.send(msg);
  });
}

// Server starten
server.listen(3000, "0.0.0.0", () => console.log("Server läuft auf Port 3000"));
 