import { createClient } from "redis";
import logger from "../utils/logger";
import { env } from "./env";

const client = createClient({ url: env.REDIS_URL });
client.on("error", (e) => logger.error("Redis error", e));
client.on("connect", () => logger.info("Redis connecting"));
client.on("ready", () => logger.info("Redis ready"));

export const connectRedis = async () => {
  if (!client.isOpen) await client.connect();
  return client;
};

export const disconnectRedis = async () => {
  if (client.isOpen) await client.disconnect();
};

export default client;
