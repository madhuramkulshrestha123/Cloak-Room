import { Kafka, logLevel } from "kafkajs";

export const kafka = new Kafka({
  brokers: [process.env.KAFKA_BROKER!],
  ssl: true,
  sasl: {
    mechanism: "scram-sha-256",
    username: process.env.KAFKA_USERNAME!,
    password: process.env.KAFKA_PASSWORD!,
  },
  logLevel: logLevel.ERROR,
});

export const producer = kafka.producer();
export const consumer = kafka.consumer({ groupId: "chats" });

// Kafka is removed in favor of direct WebSocket + Redis communication
// This file is kept for potential future analytics use
export const connectKafkaProducer = async () => {
  console.log("Kafka is disabled for real-time chat. Using WebSocket + Redis instead.");
  return Promise.resolve();
};
