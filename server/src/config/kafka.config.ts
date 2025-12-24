import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { Kafka, KafkaConfig, logLevel, Producer, Consumer } from 'kafkajs';

// ES Module __dirname Setup
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// CA Certificate Path
const caPath = process.env.KAFKA_SSL_CA_PATH ? path.join(process.cwd(), process.env.KAFKA_SSL_CA_PATH) : path.join(process.cwd(), 'src/ssl', 'ca.pem');

// Logging
console.log('--- Initializing Kafka SASL/SSL Connection ---');
console.log(`- Broker: ${process.env.KAFKA_BROKER || 'undefined'}`);
console.log(`- CA Path: ${caPath}`);
console.log(`- CA Exists: ${fs.existsSync(caPath)}`);

// Kafka Client Configuration
let kafka: Kafka | null = null;
let producer: Producer | null = null;
let consumer: Consumer | null = null;

// Initialize Kafka only if environment variables are set and SSL files exist
if (process.env.KAFKA_BROKER && process.env.KAFKA_USERNAME && process.env.KAFKA_PASSWORD && fs.existsSync(caPath)) {
  const kafkaConfig: KafkaConfig = {
    brokers: [process.env.KAFKA_BROKER],
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
      username: process.env.KAFKA_USERNAME,
      password: process.env.KAFKA_PASSWORD,
    },
  };

  kafka = new Kafka(kafkaConfig);
  producer = kafka.producer();
  consumer = kafka.consumer({ groupId: process.env.KAFKA_GROUP_ID || 'my-default-group' });
  console.log('✅ Kafka SASL/SSL configuration loaded.');
} else {
  console.log('⚠️  Kafka configuration not found or SSL files missing. Running in local mode without Kafka.');
}

// Producer Instance
export { producer };
export const connectKafkaProducer = async (): Promise<void> => {
  if (!producer) {
    console.log('⚠️  Kafka producer not configured. Skipping connection.');
    return;
  }
  try {
    await producer.connect();
    console.log('✅ Kafka Producer connected successfully.');
  } catch (error) {
    console.error('❌ Failed to connect Kafka Producer:', error);
    throw error;
  }
};

// Consumer Instance
export { consumer };
export const connectKafkaConsumer = async (topic: string): Promise<void> => {
  if (!consumer) {
    console.log('⚠️  Kafka consumer not configured. Skipping connection.');
    return;
  }
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
    if (producer) {
      await producer.disconnect();
    }
    if (consumer) {
      await consumer.disconnect();
    }
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