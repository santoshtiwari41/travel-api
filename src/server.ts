import http from "http";
import { Server } from "socket.io";
import {app} from "./app.js";
import { initSockets } from "./sockets/index.js";

const httpServer = http.createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: "*", // restrict in production
    methods: ["GET", "POST"],
  },
});

initSockets(io);

const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
