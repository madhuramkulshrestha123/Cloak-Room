import { Redis as UpstashRedis } from '@upstash/redis';

let redis: UpstashRedis;

try {
  // For local development, we'll create a mock Redis instance if real connection fails
  if (process.env.NODE_ENV === 'production') {
    // Use Upstash for production
    redis = new UpstashRedis({
      url: process.env.UPSTASH_REDIS_REST_URL as string,
      token: process.env.UPSTASH_REDIS_REST_TOKEN as string,
    });
  } else {
    // For local development, try to connect to Upstash
    if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
      redis = new UpstashRedis({
        url: process.env.UPSTASH_REDIS_REST_URL as string,
        token: process.env.UPSTASH_REDIS_REST_TOKEN as string,
      });
      console.log('Using Upstash Redis for development');
    } else {
      console.log('Upstash Redis credentials not found, you may need to set them up');
      // We still create the Upstash Redis instance but it may fail later
      // In that case, Socket.IO will fall back to memory adapter
      redis = new UpstashRedis({
        url: process.env.UPSTASH_REDIS_REST_URL as string,
        token: process.env.UPSTASH_REDIS_REST_TOKEN as string,
      });
    }
  }
} catch (error) {
  console.log('Error initializing Redis, Socket.IO will use in-memory adapter:', error);
  // We'll let Socket.IO handle the fallback to memory adapter
  redis = new UpstashRedis({
    url: process.env.UPSTASH_REDIS_REST_URL as string,
    token: process.env.UPSTASH_REDIS_REST_TOKEN as string,
  });
}

export default redis;