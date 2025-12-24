import { io, Socket } from "socket.io-client";
import Env from "./env";

let socket: Socket | null = null;

export const getSocket = (roomId: string) => {
  if (!socket) {
    socket = io(Env.BACKEND_URL, {
      autoConnect: false,
      transports: ["websocket", "polling"],
      timeout: 20000,
      auth: {
        room: roomId,
      },
    });
    
    socket.on("connect", () => {
      console.log("Connected to socket server:", socket?.id);
    });
    
    socket.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
    });
    
    socket.on("disconnect", (reason) => {
      console.log("Socket disconnected:", reason);
      socket = null;
    });
  }
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
