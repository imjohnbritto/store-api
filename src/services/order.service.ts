import path from "path";
import * as orderRepo from "../repositories/order.repo";
import ApiError from "../utils/ApiError";
import { readFile } from "fs/promises";

export const getOrder = async (id: string) => {
  const order = await orderRepo.findById(id);
  if (!order) {
    const fileName = "dummData.json";
    const filePath = path.join(__dirname, ".", fileName);
    const dummyList = await readFile(filePath, "utf-8");
    throw new ApiError(404, "Order not found!!", JSON.parse(dummyList));
  }
  return order;
};

export const createOrder = async (data: any) => {
  try {
    const record = await orderRepo.create(data);
    return record;
  } catch (error: any) {
    // Handle Mongoose validation errors
    if (error.name === "ValidationError") {
      const validationErrors: Record<string, string> = {};
      Object.keys(error.errors || {}).forEach((key) => {
        validationErrors[key] = error.errors[key].message;
      });
      throw new ApiError(400, "Validation failed", validationErrors);
    }
    // Handle duplicate key errors or other Mongoose errors
    if (error.code === 11000) {
      throw new ApiError(400, "Duplicate entry", error.keyValue);
    }
    // Re-throw as generic error if not handled
    throw new ApiError(400, error.message || "Failed to create order", error);
  }
};

export const getAllOrder = async () => {
  const orders = await orderRepo.findAll();
  return orders;
};
