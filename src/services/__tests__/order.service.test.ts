import * as orderService from "../order.service";
import * as orderRepo from "../../repositories/order.repo";
import ApiError from "../../utils/ApiError";
import { readFile } from "fs/promises";

// Mock dependencies
jest.mock("../../repositories/order.repo");
jest.mock("fs/promises");

describe("Order Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getOrder", () => {
    it("should return order when found", async () => {
      const mockOrder = {
        _id: "123",
        name: "Product A",
        category: "Electronics",
      };
      (orderRepo.findById as jest.Mock).mockResolvedValue(mockOrder);

      const result = await orderService.getOrder("123");

      expect(result).toEqual(mockOrder);
      expect(orderRepo.findById).toHaveBeenCalledWith("123");
    });

    it("should throw ApiError with dummy data when order not found", async () => {
      const mockDummyData = [
        { id: 1, name: "John" },
        { id: 2, name: "Mike" },
      ];
      (orderRepo.findById as jest.Mock).mockResolvedValue(null);
      (readFile as jest.Mock).mockResolvedValue(JSON.stringify(mockDummyData));

      await expect(orderService.getOrder("123")).rejects.toThrow(ApiError);
      await expect(orderService.getOrder("123")).rejects.toThrow(
        "Order not found!!"
      );
    });
  });

  describe("createOrder", () => {
    it("should create and return order successfully", async () => {
      const mockOrderData = { name: "Product A", category: "Electronics" };
      const mockCreatedOrder = { _id: "123", ...mockOrderData };
      (orderRepo.create as jest.Mock).mockResolvedValue(mockCreatedOrder);

      const result = await orderService.createOrder(mockOrderData);

      expect(result).toEqual(mockCreatedOrder);
      expect(orderRepo.create).toHaveBeenCalledWith(mockOrderData);
    });

    it("should throw ApiError with validation errors when ValidationError occurs", async () => {
      const mockOrderData = { name: "Product A" };
      const mockValidationError = {
        name: "ValidationError",
        errors: {
          category: { message: "Category is required" },
        },
      };
      (orderRepo.create as jest.Mock).mockRejectedValue(mockValidationError);

      await expect(orderService.createOrder(mockOrderData)).rejects.toThrow(
        ApiError
      );
      try {
        await orderService.createOrder(mockOrderData);
      } catch (error: any) {
        expect(error.status).toBe(400);
        expect(error.message).toBe("Validation failed");
        expect(error.details).toEqual({ category: "Category is required" });
      }
    });

    it("should throw ApiError when duplicate key error occurs", async () => {
      const mockOrderData = { name: "Product A", category: "Electronics" };
      const mockDuplicateError = {
        code: 11000,
        keyValue: { name: "Product A" },
      };
      (orderRepo.create as jest.Mock).mockRejectedValue(mockDuplicateError);

      await expect(orderService.createOrder(mockOrderData)).rejects.toThrow(
        ApiError
      );
      try {
        await orderService.createOrder(mockOrderData);
      } catch (error: any) {
        expect(error.status).toBe(400);
        expect(error.message).toBe("Duplicate entry");
        expect(error.details).toEqual({ name: "Product A" });
      }
    });

    it("should throw ApiError for generic errors", async () => {
      const mockOrderData = { name: "Product A", category: "Electronics" };
      const mockError = new Error("Database connection failed");
      (orderRepo.create as jest.Mock).mockRejectedValue(mockError);

      await expect(orderService.createOrder(mockOrderData)).rejects.toThrow(
        ApiError
      );
      try {
        await orderService.createOrder(mockOrderData);
      } catch (error: any) {
        expect(error.status).toBe(400);
        expect(error.message).toBe("Database connection failed");
      }
    });
  });

  describe("getAllOrder", () => {
    it("should return all orders", async () => {
      const mockOrders = [
        { _id: "1", name: "Product A", category: "Electronics" },
        { _id: "2", name: "Product B", category: "Clothing" },
      ];
      (orderRepo.findAll as jest.Mock).mockResolvedValue(mockOrders);

      const result = await orderService.getAllOrder();

      expect(result).toEqual(mockOrders);
      expect(orderRepo.findAll).toHaveBeenCalled();
    });
  });
});

