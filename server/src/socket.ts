import { Server, Socket } from "socket.io";
// Redis adapter is configured in index.ts to avoid circular dependencies
import redis from "./config/redis.js";

interface CustomSocket extends Socket {
  room?: string;
}

export function setupSocket(io: Server) {
  // Redis adapter will be set in index.ts
  io.use((socket: CustomSocket, next) => {
    const room = socket.handshake.auth.room || socket.handshake.query.room;
    if (!room) {
      return next(new Error("Invalid room"));
    }
    socket.room = room;
    next();
  });

  io.on("connection", (socket: CustomSocket) => {
    console.log("New socket connection with ID:", socket.id);
    
    // Join the room
    if (socket.room) {
      socket.join(socket.room);
      console.log(`Socket ${socket.id} joined room: ${socket.room}`);
    }

    socket.on("send_message", (data) => {
      console.log("Received message from client:", data);
      
      // Broadcast the message to all clients in the same room (including sender)
      io.to(socket.room).emit("receive_message", data);
      
      console.log("Broadcasted message to room:", socket.room);
    });

    socket.on("disconnect", (reason) => {
      console.log("A user disconnected:", socket.id, "reason:", reason);
    });
  });

}
