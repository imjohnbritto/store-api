import { Router } from "express";
import * as userController from "../controllers/user.controller";
import asyncHandler from "../utils/asyncHandler";
import validateRequest from "../middlewares/validateRequest";
import { createUserSchema } from "../validations/user.validation";

const router = Router();

router.get("/:id", asyncHandler(userController.getUser));
router.get("/", asyncHandler(userController.getUser));
router.post(
  "/",
  validateRequest(createUserSchema),
  asyncHandler(userController.createUser)
);

export default router;
