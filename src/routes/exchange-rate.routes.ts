import { Router } from "express";
import * as exchangeRateController from "../controllers/exchange-rate.controller";
import asyncHandler from "../utils/asyncHandler";

const router = Router();

router.get("/:currency", asyncHandler(exchangeRateController.getExchangeRate));

export default router;
