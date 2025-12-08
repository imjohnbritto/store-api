import rateLimit from "express-rate-limit";
import RedisStore from "rate-limit-redis";
import redisClient from "../config/redis";
import { env } from "../config/env";

export const createRateLimiter = () => {
  if (!redisClient.isOpen) throw new Error("Redis client not connected yet");

  return rateLimit({
    windowMs: env.RATE_LIMIT_WINDOW_MS,
    max: env.RATE_LIMIT_MAX,
    standardHeaders: true,
    legacyHeaders: false,
    // rate-limit-redis expects sendCommand with redis v4
    store: new RedisStore({
      sendCommand: (...args: any[]) => (redisClient as any).sendCommand(args),
      prefix: "rl:",
    }),
  });
};
