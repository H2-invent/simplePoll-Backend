# ---- Basis-Image ----
FROM node:20-alpine

# ---- Arbeitsverzeichnis ----
WORKDIR /app

# ---- Dependencies installieren ----
COPY package*.json ./
RUN npm install --production

# ---- Quellcode kopieren ----
COPY . .

# ---- Port & Startbefehl ----
EXPOSE 3000
CMD ["node", "server.js"]
