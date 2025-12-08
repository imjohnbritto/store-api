import { Router } from "express";
import * as orderController from "../controllers/order.controller";
import asyncHandler from "../utils/asyncHandler";

const router = Router();

router.get("/:id", asyncHandler(orderController.getOrder));
router.get("/", asyncHandler(orderController.getOrder));
router.post("/", asyncHandler(orderController.createOrder));

export default router;
