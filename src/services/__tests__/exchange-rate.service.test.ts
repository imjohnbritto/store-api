import * as exchangeRateService from "../exchange-rate.service";
import ApiError from "../../utils/ApiError";

// Mock dependencies
const mockRedisGet = jest.fn();
const mockRedisSet = jest.fn();
const mockAxiosGet = jest.fn();

jest.mock("../../config/redis", () => ({
  __esModule: true,
  default: {
    get: (...args: any[]) => mockRedisGet(...args),
    set: (...args: any[]) => mockRedisSet(...args),
  },
}));

jest.mock("axios", () => ({
  __esModule: true,
  default: {
    get: (...args: any[]) => mockAxiosGet(...args),
  },
}));

describe("Exchange Rate Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getExchangeRate", () => {
    it("should return cached exchange rate when available", async () => {
      const mockCachedData = {
        data: {
          USD: { value: 1.0 },
        },
      };
      mockRedisGet.mockResolvedValue(JSON.stringify(mockCachedData));

      const result = await exchangeRateService.getExchangeRate("USD");

      expect(result).toEqual(mockCachedData);
      expect(mockRedisGet).toHaveBeenCalledWith("exchange-rate:USD");
      expect(mockAxiosGet).not.toHaveBeenCalled();
    });

    it("should fetch from API and cache when not in cache", async () => {
      const mockApiResponse = {
        data: {
          data: {
            USD: { value: 1.0 },
          },
        },
      };
      mockRedisGet.mockResolvedValue(null);
      mockAxiosGet.mockResolvedValue(mockApiResponse);
      mockRedisSet.mockResolvedValue("OK");

      const result = await exchangeRateService.getExchangeRate("USD");

      expect(result).toEqual(mockApiResponse.data);
      expect(mockRedisGet).toHaveBeenCalledWith("exchange-rate:USD");
      expect(mockAxiosGet).toHaveBeenCalledWith(
        expect.stringContaining("api.currencyapi.com")
      );
      expect(mockRedisSet).toHaveBeenCalledWith(
        "exchange-rate:USD",
        JSON.stringify(mockApiResponse.data),
        { EX: 60 * 5 }
      );
    });

    it("should throw ApiError when API call fails", async () => {
      const mockError = new Error("Network error");
      mockRedisGet.mockResolvedValue(null);
      mockAxiosGet.mockRejectedValue(mockError);

      try {
        await exchangeRateService.getExchangeRate("USD");
        expect(true).toBe(false); // Should not reach here
      } catch (error: any) {
        expect(error).toBeInstanceOf(ApiError);
        expect(error.status).toBe(500);
        expect(error.message).toBe("Failed to get exchange rate");
      }
    });

    it("should handle currency in lowercase and convert to uppercase in API call", async () => {
      const mockApiResponse = {
        data: {
          data: {
            EUR: { value: 0.85 },
          },
        },
      };
      mockRedisGet.mockResolvedValue(null);
      mockAxiosGet.mockResolvedValue(mockApiResponse);
      mockRedisSet.mockResolvedValue("OK");

      await exchangeRateService.getExchangeRate("eur");

      expect(mockAxiosGet).toHaveBeenCalledWith(
        expect.stringContaining("currencies=EUR")
      );
    });
  });
});
