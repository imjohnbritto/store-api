import * as orderRepo from "../order.repo";
import OrderModel from "../../models/order.model";

// Mock OrderModel
jest.mock("../../models/order.model");

const mockedOrderModel = OrderModel as jest.Mocked<typeof OrderModel>;

describe("Order Repository", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("findById", () => {
    it("should find order by id", async () => {
      const mockOrder = {
        _id: "123",
        name: "Product A",
        category: "Electronics",
      };
      const mockQuery = {
        lean: jest.fn().mockResolvedValue(mockOrder),
      };
      mockedOrderModel.findById.mockReturnValue(mockQuery as any);

      const result = await orderRepo.findById("123");

      expect(mockedOrderModel.findById).toHaveBeenCalledWith("123");
      expect(mockQuery.lean).toHaveBeenCalled();
      expect(result).toEqual(mockOrder);
    });

    it("should return null when order not found", async () => {
      const mockQuery = {
        lean: jest.fn().mockResolvedValue(null),
      };
      mockedOrderModel.findById.mockReturnValue(mockQuery as any);

      const result = await orderRepo.findById("123");

      expect(result).toBeNull();
    });
  });

  describe("create", () => {
    it("should create a new order", async () => {
      const mockOrderData = { name: "Product A", category: "Electronics" };
      const mockCreatedOrder = { _id: "123", ...mockOrderData };
      mockedOrderModel.create.mockResolvedValue(mockCreatedOrder as any);

      const result = await orderRepo.create(mockOrderData);

      expect(mockedOrderModel.create).toHaveBeenCalledWith(mockOrderData);
      expect(result).toEqual(mockCreatedOrder);
    });
  });

  describe("findAll", () => {
    it("should return all orders", async () => {
      const mockOrders = [
        { _id: "1", name: "Product A", category: "Electronics" },
        { _id: "2", name: "Product B", category: "Clothing" },
      ];
      mockedOrderModel.find.mockResolvedValue(mockOrders as any);

      const result = await orderRepo.findAll();

      expect(mockedOrderModel.find).toHaveBeenCalled();
      expect(result).toEqual(mockOrders);
    });
  });
});

