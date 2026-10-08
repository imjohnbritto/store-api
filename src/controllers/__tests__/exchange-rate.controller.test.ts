import { Request, Response } from "express";
import * as exchangeRateController from "../exchange-rate.controller";
import * as currencyService from "../../services/exchange-rate.service";

// Mock dependencies
jest.mock("../../services/exchange-rate.service");
jest.mock("../../config/redis", () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
    set: jest.fn(),
  },
}));

const mockedCurrencyService = currencyService as jest.Mocked<
  typeof currencyService
>;

describe("Exchange Rate Controller", () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let jsonMock: jest.Mock;
  let statusMock: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();

    jsonMock = jest.fn();
    statusMock = jest.fn().mockReturnValue({ json: jsonMock });

    mockRequest = {
      params: {},
    };

    mockResponse = {
      json: jsonMock,
      status: statusMock,
    };
  });

  describe("getExchangeRate", () => {
    it("should return exchange rate when currency is provided", async () => {
      const mockExchangeRate = {
        data: {
          USD: { value: 1.0 },
        },
      };
      mockRequest.params = { currency: "USD" };
      mockedCurrencyService.getExchangeRate.mockResolvedValue(
        mockExchangeRate as any
      );

      await exchangeRateController.getExchangeRate(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockedCurrencyService.getExchangeRate).toHaveBeenCalledWith("USD");
      expect(jsonMock).toHaveBeenCalledWith({ data: mockExchangeRate });
    });

    it("should return 400 when currency is not provided", async () => {
      mockRequest.params = {};

      await exchangeRateController.getExchangeRate(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({ message: "Invalid currency" });
      expect(mockedCurrencyService.getExchangeRate).not.toHaveBeenCalled();
    });

    it("should return 400 when currency is empty string", async () => {
      mockRequest.params = { currency: "" };

      await exchangeRateController.getExchangeRate(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({ message: "Invalid currency" });
      expect(mockedCurrencyService.getExchangeRate).not.toHaveBeenCalled();
    });
  });
});
