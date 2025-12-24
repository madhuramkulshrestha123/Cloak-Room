import { Redis } from '@upstash/redis';

// Use the proper Upstash Redis configuration method
const redis = Redis.fromEnv();

export default redis;
