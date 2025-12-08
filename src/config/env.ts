import dotenv from "dotenv";
dotenv.config();

export const env = {
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: Number(process.env.PORT || 4000),
  MONGO_URL: process.env.MONGO_URL || "mongodb://localhost:27017/mydb",
  REDIS_URL: process.env.REDIS_URL || "redis://127.0.0.1:6379",
  RATE_LIMIT_MAX: Number(process.env.RATE_LIMIT_MAX || 100),
  RATE_LIMIT_WINDOW_MS: Number(process.env.RATE_LIMIT_WINDOW_MS || 60_000),
} as const;
