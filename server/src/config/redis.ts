import { Redis } from "ioredis";
import type { Redis as RedisType } from "ioredis";

let redis: RedisType;

if (process.env.NODE_ENV === "production") {
  redis = new Redis(process.env.REDIS_URL as string, {
    tls: {}, // enables TLS for rediss://
  });
} else {
  redis = new Redis({
    host: "localhost",
    port: 6379,
  });
}

export default redis;
