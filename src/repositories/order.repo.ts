import OrderModel from "../models/order.model";

export const findById = (id: string) => OrderModel.findById(id).lean();
export const create = (data: any) => OrderModel.create(data);
export const findAll = () => OrderModel.find();
