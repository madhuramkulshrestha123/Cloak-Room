import { Redis } from '@upstash/redis';

let redis: Redis;

if (process.env.NODE_ENV === 'production') {
  // Use Upstash for production, pulling URL and token from env variables for better security
  redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL as string,
    token: process.env.UPSTASH_REDIS_REST_TOKEN as string,
  });
} else {
  // For local development fallback to local Redis using ioredis (optional)
  // or else use Upstash with development creds
  // Here, you can keep local ioredis or connect to Upstash test instance

  // Option 1: Keep using ioredis for localhost development:
  // import IORedis from 'ioredis';
  // redis = new IORedis({ 
  //   host: 'localhost',
  //   port: 6379,
  // });

  // Option 2: Use Upstash for both prod and dev by providing dev environment variables:
  redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL as string,
    token: process.env.UPSTASH_REDIS_REST_TOKEN as string,
  });
}

export default redis;
