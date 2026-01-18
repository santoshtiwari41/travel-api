import { Server } from "socket.io";
import { messageSocket } from "./message.socket.js";

export const initSockets = (io: Server) => {
  messageSocket(io);
};
