import app from "./app";
import { connectDB } from "./config/db";
import { connectRedis, disconnectRedis } from "./config/redis";
import { createRateLimiter } from "./middlewares/rateLimiter.middleware";
import logger from "./utils/logger";
import { env } from "./config/env";

const server = app.listen(env.PORT, async () => {
  try {
    await connectDB();
    await connectRedis(); // ensure Redis is connected before using it
    app.use(createRateLimiter()); // now safe
    logger.info(`Server running on port ${env.PORT}`);
  } catch (err) {
    logger.error("Startup error", err as any);
    process.exit(1);
  }
});

// graceful shutdown
const shutdown = async () => {
  logger.info("Shutting down...");
  server.close(async () => {
    await disconnectRedis();
    // close DB connections
    process.exit(0);
  });
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
