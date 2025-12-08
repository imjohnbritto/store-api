import UserModel from "../models/user.model";

export const findById = (id: string) => UserModel.findById(id).lean();
export const create = (data: any) => UserModel.create(data);
export const findAll = () => UserModel.find().lean();
