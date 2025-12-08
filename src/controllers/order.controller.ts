import { Request, Response } from "express";
import * as orderService from "../services/order.service";
import mongoose from "mongoose";

export const getOrder = async (req: Request, res: Response) => {
  const id = req.params.id;
  if (!id) {
    const data = await orderService.getAllOrder();
    return res.json({ data });
  }
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid order ID format" });
  }
  const data = await orderService.getOrder(id);
  return res.json({ data });
};

export const createOrder = async (req: Request, res: Response) => {
  const order = await orderService.createOrder(req.body);
  return res.status(201).json({ order, message: "Order created successfully" });
};
