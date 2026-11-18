import "dotenv/config";
import Redis from "ioredis";
import { logger } from "./logging.js";

export const redisClient = new Redis(process.env.REDIS_URL, {
  lazyConnect: false,
  maxRetriesPerRequest: 3,
});

redisClient.on("connect", () => {
  logger.info("Connected to Redis");
});

redisClient.on("error", (e) => {
  logger.error(`Redis Error: ${e.message}`);
});
