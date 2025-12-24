import express, { Application, Request, Response } from "express";
import "dotenv/config";
import cors from "cors";
const app: Application = express();
const PORT = parseInt(process.env.PORT || '8000');  // Use port 8000 as defined in .env

import Routes from "./routes/index.js";
import { Server } from "socket.io";
import { createServer } from "http";
import { setupSocket } from "./socket.js";
import { instrument } from "@socket.io/admin-ui";
import { connectKafkaProducer } from "./config/kafka.config.js";

const server = createServer(app);

// Create Socket.IO server - use Redis adapter only in production
let io: Server;
if (process.env.NODE_ENV === 'production') {
  // Use Redis adapter in production
  const { createAdapter } = require("@socket.io/redis-streams-adapter");
  const redis = require("./config/redis.js").default;
  io = new Server(server, {
    cors: {
      origin: [process.env.CLIENT_APP_URL || "http://localhost:3000", "https://admin.socket.io"],
    },
    adapter: createAdapter(redis),
  });
} else {
  // Use default in-memory adapter for development
  io = new Server(server, {
    cors: {
      origin: [process.env.CLIENT_APP_URL || "http://localhost:3000", "https://admin.socket.io"],
    },
  });
}

instrument(io, {
  auth: false,
  mode: "development",
});

export { io };
setupSocket(io);

// * Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/", (req: Request, res: Response) => {
  return res.send("It's working Guys 🙌");
});

// * Routes
app.use("/api", Routes);

// * Connect Kafka Producer only if Kafka is properly configured
import { producer } from "./config/kafka.config.js";
if (producer) {
  connectKafkaProducer().catch(console.error);
} else {
  console.log("⚠️ Kafka not configured. Running in local mode without Kafka.");
}

server.listen(PORT, () => console.log(`Server is running on PORT ${PORT}`));

// Handle port already in use error
server.on('error', (err: NodeJS.ErrnoException) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use. Please stop the other process or use a different port.`);
    process.exit(1);
  } else {
    console.error('Server error:', err);
  }
});