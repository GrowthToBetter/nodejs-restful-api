import { redisClient } from "../web/redis.js";

export const rateLimitMiddleware = (options = {}) => {
  const max = options.max || 100;
  const windowSeconds = options.windowSeconds || 60;

  return async (req, res, next) => {
    try {
      const identifier = req.ip || req.socket.remoteAddress || "anonymous";
      const key = `rate_limit:${identifier}`;

      const current = await redisClient.incr(key);
      if (current === 1) {
        await redisClient.expire(key, windowSeconds);
      }

      const ttl = await redisClient.ttl(key);

      res.setHeader("X-RateLimit-Limit", max);
      res.setHeader("X-RateLimit-Remaining", Math.max(0, max - current));
      res.setHeader("X-RateLimit-Reset", ttl);

      if (current > max) {
        return res.status(429).json({
          errors: "Too many requests, please try again later",
        });
      }

      next();
    } catch (e) {
      next();
    }
  };
};
