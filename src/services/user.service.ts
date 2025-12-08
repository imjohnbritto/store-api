import path from "path";
import * as userRepo from "../repositories/user.repo";
import ApiError from "../utils/ApiError";
import { readFile } from "fs/promises";

export const getUser = async (id: string) => {
  const user = await userRepo.findById(id);
  if (!user) {
    const fileName = "dummData.json";
    const filePath = path.join(__dirname, ".", fileName);
    const dummyList = await readFile(filePath, "utf-8");
    throw new ApiError(404, "User not found!!", JSON.parse(dummyList));
  }
  return user;
};

export const createUser = async (data: any) => {
  try {
    return userRepo.create(data);
  } catch (err: any) {
    throw new ApiError(500, "Failed to create user!", err);
  }
};

export const getAllUsers = async () => {
  return userRepo.findAll();
};
