# Signaling Server (Node.js + Socket.IO)

## Run locally
1. cd server
2. npm install
3. npm start

Server default: http://localhost:5003

This server only relays signaling (offer/answer/ICE). Media (audio/video) flows directly between peers.

## Environment
- For production, set appropriate CORS origins and run behind HTTPS / WSS.
