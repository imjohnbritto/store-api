import mongoose from "mongoose";
import { env } from "./env";
import logger from "../utils/logger";

export async function connectDB() {
  try {
    await mongoose.connect(env.MONGO_URL, {
      serverSelectionTimeoutMS: 5000, // fail fast
    });

    mongoose.connection.on("connected", () => {
      logger.info("✅ MongoDB connected");
    });

    mongoose.connection.on("error", (err) => {
      logger.info("MongoDB connection error:", err);
    });

    mongoose.connection.on("disconnected", () => {
      logger.info("MongoDB disconnected");
    });
  } catch (err) {
    logger.error("❌ MongoDB connection error:", err as any);
    throw err;
  }
}

export const closeDB = async () => {
  await mongoose.connection.close();
};
