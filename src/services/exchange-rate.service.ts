import path from "path";
import ApiError from "../utils/ApiError";
import { readFile } from "fs/promises";
import axios from "axios";
import redisClient from "../config/redis";

const getCachedExchangeRate = async (currency: string) => {
  const cachedExchangeRate = await redisClient.get(`exchange-rate:${currency}`);
  if (cachedExchangeRate) {
    return cachedExchangeRate;
  }
  return null;
};

export const getExchangeRate = async (currency: string) => {
  const cachedExchangeRate = await getCachedExchangeRate(currency);
  if (cachedExchangeRate) {
    return JSON.parse(cachedExchangeRate);
  } else {
    const currencyApi = `https://api.currencyapi.com/v3/latest?apikey=${
      process.env.EXCHANGE_RATE_API_KEY
    }&currencies=${currency.toUpperCase()}`;
    try {
      const currrencyInfo = await axios.get(currencyApi);
      redisClient.set(
        `exchange-rate:${currency}`,
        JSON.stringify(currrencyInfo.data),
        { EX: 60 * 5 } // 5 minutes
      );
      return currrencyInfo.data;
    } catch (error) {
      throw new ApiError(500, "Failed to get exchange rate", error);
    }
  }
};
