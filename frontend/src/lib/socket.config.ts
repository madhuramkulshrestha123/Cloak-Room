import { io, Socket } from "socket.io-client";
import Env from "./env";

let socket: Socket | null = null;
let currentSocketUrl: string | null = null;

export const getSocket = (token?: string) => {
  const socketUrl = Env.BACKEND_URL;
  
  // If we have an existing socket and the URL hasn't changed, return it
  if (socket && currentSocketUrl === socketUrl) {
    return socket;
  }
  
  // If URL changed or no socket exists, disconnect the old one
  if (socket) {
    socket.disconnect();
  }
  
  // Create new socket with auth if token is provided
  // Token already includes "Bearer " prefix from the backend
  socket = io(socketUrl, { 
    autoConnect: false,
    auth: {
      token: token || undefined
    }
  });
  
  currentSocketUrl = socketUrl;
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
    currentSocketUrl = null;
  }
};