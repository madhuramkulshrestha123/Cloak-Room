import db from "./config/db.config.js";
import { producer, consumer } from "./config/kafka.config.js";

export const produceMessage = async (topic: string, message: any) => {
  if (!producer) {
    // If Kafka is not configured, save directly to database
    await db.query(
      'INSERT INTO chats (id, group_id, message, name, file) VALUES ($1, $2, $3, $4, $5)',
      [message.id, message.group_id, message.message, message.name, message.file]
    );
    return;
  }
  await producer.send({
    topic,
    messages: [{ value: JSON.stringify(message) }],
  });
};

export const consumeMessages = async (topic: string) => {
  if (!consumer) {
    console.log('⚠️  Kafka consumer not configured. Skipping message consumption.');
    return;
  }
  await consumer.connect();
  await consumer.subscribe({ topic: topic });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      if (message.value === null) {
        console.log('Received null message value');
        return;
      }
      const data = JSON.parse(message.value.toString());
      console.log({
        partition,
        offset: message.offset,
        value: data,
      });

      await db.query(
        'INSERT INTO chats (id, group_id, message, name, file) VALUES ($1, $2, $3, $4, $5)',
        [data.id, data.group_id, data.message, data.name, data.file]
      );

      // Process the message (e.g., save to DB, trigger some action, etc.)
    },
  });
};