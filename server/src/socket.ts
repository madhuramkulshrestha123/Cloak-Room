import { Server, Socket } from "socket.io";
import { produceMessage } from "./helper.js";
import jwt from "jsonwebtoken";
import db from "./config/db.config.js";

interface CustomSocket extends Socket {
  room?: string;
  userId?: number;
}

export function setupSocket(io: Server) {
  io.use(async (socket: CustomSocket, next) => {
    const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.replace('Bearer ', '');
    
    if (token) {
      try {
        // Verify the JWT token
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'hugyygygy86276372@jkjkj') as { id: number, name: string, email: string };
        socket.userId = decoded.id;
      } catch (err) {
        // Token is invalid, but we'll still allow connection for public chat
        // Only log if it's not a standard "no token" scenario
        if (token && token !== 'undefined') {
          console.log('Invalid token:', err);
        }
      }
    }
    
    const room = socket.handshake.auth.room || socket.handshake.headers.room;
    if (!room) {
      return next(new Error("Invalid room"));
    }
    socket.room = room;
    next();
  });

  io.on("connection", (socket: CustomSocket) => {
    // * Join the room
    if (socket.room) {
      socket.join(socket.room);
    }

    socket.on("message", async (data) => {
      try {
        // Check if the user has access to this chat group (owner or member)
        if (socket.userId) {
          const groupResult = await db.query(`
            SELECT cg.id 
            FROM chat_groups cg 
            WHERE cg.id = $1 AND (cg.user_id = $2 OR EXISTS(
              SELECT 1 FROM group_users gu WHERE gu.group_id = cg.id AND gu.user_id = $3
            ))
          `, [data.group_id, socket.userId, socket.userId]);
          
          if (groupResult.rows.length === 0) {
            console.log('User does not have access to this chat group');
            return;
          }
        }
        
        // Wait for the message to be saved to the database before broadcasting
        await produceMessage("chats", data);
        
        if (socket.room) {
          // Emit to all users in the room, including the sender
          io.to(socket.room).emit("message", data);
        }
      } catch (error) {
        console.log("The produce error is", error);
      }
    });

    socket.on("disconnect", () => {
      console.log("A user disconnected:", socket.id);
    });
  });
}