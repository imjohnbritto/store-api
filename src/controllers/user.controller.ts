import { Request, Response } from "express";
import * as userService from "../services/user.service";
import mongoose from "mongoose";

export const getUser = async (req: Request, res: Response) => {
  const id = req.params.id;
  if (!id) {
    const data = await userService.getAllUsers();
    return res.json({ data });
  }
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid user ID format" });
  }
  const data = await userService.getUser(id);
  return res.json({ data });
};

export const createUser = async (req: Request, res: Response) => {
  try {
    const user = await userService.createUser(req.body);
    return res
      .status(201)
      .json({ message: "User created successfully!", data: user });
  } catch (err: any) {
    return res.status(500).json({
      message: "Failed to create user!",
      errors: err.details || err.message,
    });
  }
};
