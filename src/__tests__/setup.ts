// Test setup file
import mongoose from "mongoose";

// Mock environment variables
process.env.NODE_ENV = "test";
process.env.EXCHANGE_RATE_API_KEY = "test-api-key";

// Close database connection after all tests
afterAll(async () => {
  await mongoose.connection.close();
});

