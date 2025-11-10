const express = require("express");
const cors = require("cors");
const http = require("http");
const { WebSocketServer } = require("ws");
const { v4: uuidv4 } = require("uuid");

const app = express();
app.use(cors());
app.use(express.static("public"));

const server = http.createServer(app);
const wss = new WebSocketServer({ server });

// pollId -> pollData
const polls = {};

// Verbindung
wss.on("connection", (ws, req) => {
  // PollID aus der URL ?poll=abc extrahieren
  const urlParams = new URLSearchParams(req.url.replace(/^.*\?/, ''));
  const pollId = urlParams.get('poll') || uuidv4();
  ws.pollId = pollId;
  ws.clientId = uuidv4();

  // Wenn Poll nicht existiert, initialisieren
  if(!polls[pollId]){
    polls[pollId] = {
      state: "editing",
      question: "",
      options: [],
      votes: [],
      votedClients: {}
    };
  }

  // Initialzustand senden
  ws.send(JSON.stringify(polls[pollId]));

  ws.on("message", msg => {
    const data = JSON.parse(msg);
    const poll = polls[ws.pollId];

    switch(data.action){
      case "create":
        poll.state = "created";
        poll.question = data.question;
        poll.options = data.options;
        poll.votes = new Array(data.options.length).fill(0);
        poll.votedClients = {};
        break;
      case "start":
        if(poll.state === "created") poll.state = "started";
        break;
      case "vote":
        if(poll.state === "started" && !poll.votedClients[ws.clientId]){
          poll.votes[data.index]++;
          poll.votedClients[ws.clientId] = true;
          // Feedback nur an diesen Client
          ws.send(JSON.stringify({...poll, yourVoteDone:true}));
        }
        break;
      case "reset":
        polls[ws.pollId] = {
          state: "editing",
          question: "",
          options: [],
          votes: [],
          votedClients: {}
        };
        break;
    }

    broadcast(ws.pollId);
  });
});

function broadcast(pollId){
  const msg = JSON.stringify(polls[pollId]);
  wss.clients.forEach(client => {
    if(client.readyState===1 && client.pollId===pollId) client.send(msg);
  });
}

server.listen(3000, "0.0.0.0", () => console.log("Server läuft auf Port 3000"));
