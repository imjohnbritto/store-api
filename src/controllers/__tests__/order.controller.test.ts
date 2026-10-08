import { Request, Response } from "express";
import * as orderController from "../order.controller";
import * as orderService from "../../services/order.service";
import mongoose from "mongoose";

// Mock dependencies
jest.mock("../../services/order.service");

const mockedOrderService = orderService as jest.Mocked<typeof orderService>;

describe("Order Controller", () => {
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
      body: {},
    };

    mockResponse = {
      json: jsonMock,
      status: statusMock,
    };
  });

  describe("getOrder", () => {
    it("should return all orders when no id is provided", async () => {
      const mockOrders = [
        { _id: "1", name: "Product A", category: "Electronics" },
        { _id: "2", name: "Product B", category: "Clothing" },
      ];
      mockedOrderService.getAllOrder.mockResolvedValue(mockOrders as any);

      await orderController.getOrder(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockedOrderService.getAllOrder).toHaveBeenCalled();
      expect(jsonMock).toHaveBeenCalledWith({ data: mockOrders });
    });

    it("should return order when valid id is provided", async () => {
      const mockOrder = {
        _id: "123",
        name: "Product A",
        category: "Electronics",
      };
      mockRequest.params = { id: "507f1f77bcf86cd799439011" };
      mockedOrderService.getOrder.mockResolvedValue(mockOrder as any);

      await orderController.getOrder(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockedOrderService.getOrder).toHaveBeenCalledWith(
        "507f1f77bcf86cd799439011"
      );
      expect(jsonMock).toHaveBeenCalledWith({ data: mockOrder });
    });

    it("should return 400 when invalid id format is provided", async () => {
      mockRequest.params = { id: "invalid-id" };

      await orderController.getOrder(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({
        message: "Invalid order ID format",
      });
      expect(mockedOrderService.getOrder).not.toHaveBeenCalled();
    });
  });

  describe("createOrder", () => {
    it("should create order successfully", async () => {
      const mockOrderData = { name: "Product A", category: "Electronics" };
      const mockCreatedOrder = { _id: "123", ...mockOrderData };
      mockRequest.body = mockOrderData;
      mockedOrderService.createOrder.mockResolvedValue(mockCreatedOrder as any);

      await orderController.createOrder(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockedOrderService.createOrder).toHaveBeenCalledWith(
        mockOrderData
      );
      expect(statusMock).toHaveBeenCalledWith(201);
      expect(jsonMock).toHaveBeenCalledWith({
        order: mockCreatedOrder,
        message: "Order created successfully",
      });
    });
  });
});

