import prisma from "./config/db.config.js";
import { producer } from "./config/kafka.config.js";

export const produceMessage = async (topic: string, message: any) => {
  await producer.send({
    topic,
    messages: [{ value: JSON.stringify(message) }],
  });
};

// This file contains helper functions for the chat application
// Kafka functionality has been removed in favor of WebSocket + Redis

// Placeholder function for potential future use
export const consumeMessages = async (topic: string) => {
  console.log(`Kafka consumer is disabled. Using WebSocket + Redis for real-time chat.`);
  return Promise.resolve();
};
