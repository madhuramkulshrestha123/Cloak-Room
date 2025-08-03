import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { Kafka, KafkaConfig, logLevel, Producer, Consumer } from 'kafkajs';

// ES Module __dirname Setup
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// CA Certificate Path
const caPath = path.join(process.cwd(), 'src/ssl', 'ca.pem');

// Logging
console.log('--- Initializing Kafka SASL/SSL Connection ---');
console.log(`- Broker: ${process.env.KAFKA_BROKER || 'undefined'}`);
console.log(`- CA Exists: ${fs.existsSync(caPath)}`);

// Validation
if (!process.env.KAFKA_BROKER || !process.env.KAFKA_USERNAME || !process.env.KAFKA_PASSWORD) {
  throw new Error(
    'FATAL: Missing Kafka SASL configuration. Ensure KAFKA_BROKER, KAFKA_USERNAME, and KAFKA_PASSWORD are set.'
  );
}
if (!fs.existsSync(caPath)) {
  throw new Error('FATAL: Missing CA certificate at src/ssl/ca.pem');
}

// Kafka Client Configuration
const kafkaConfig: KafkaConfig = {
  brokers: [process.env.KAFKA_BROKER!],
  logLevel: logLevel.ERROR,
  connectionTimeout: 10000,
  authenticationTimeout: 10000,

  // Enable SSL just for CA validation
  ssl: {
    rejectUnauthorized: true,
    ca: [fs.readFileSync(caPath, 'utf-8')],
  },

  // SASL/SCRAM authentication
  sasl: {
    mechanism: 'scram-sha-256',
    username: process.env.KAFKA_USERNAME!,
    password: process.env.KAFKA_PASSWORD!,
  },
};

console.log('✅ Kafka SASL/SSL configuration loaded.');
export const kafka = new Kafka(kafkaConfig);

// Producer Instance
export const producer: Producer = kafka.producer();
export const connectKafkaProducer = async (): Promise<void> => {
  try {
    await producer.connect();
    console.log('✅ Kafka Producer connected successfully.');
  } catch (error) {
    console.error('❌ Failed to connect Kafka Producer:', error);
    throw error;
  }
};

// Consumer Instance
export const consumer: Consumer = kafka.consumer({ groupId: 'my-default-group' });
export const connectKafkaConsumer = async (topic: string): Promise<void> => {
  try {
    await consumer.connect();
    console.log('✅ Kafka Consumer connected successfully.');
    await consumer.subscribe({ topic, fromBeginning: true });
    console.log(`👂 Consumer subscribed to topic: "${topic}"`);
  } catch (error) {
    console.error('❌ Failed to connect or subscribe Kafka Consumer:', error);
    throw error;
  }
};

// Graceful Shutdown
const gracefulShutdown = async (signal: string) => {
  console.log(`\nReceived ${signal}. Shutting down...`);
  try {
    await producer.disconnect();
    await consumer.disconnect();
    console.log('✅ Kafka connections closed.');
  } catch (error) {
    console.error('❌ Error during shutdown:', error);
  } finally {
    process.exit(0);
  }
};
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));

console.log('--- Kafka SASL/SSL configuration module loaded. ---');
