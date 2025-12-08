import { Router } from "express";
import userRoutes from "./user.routes";
import orderRoutes from "./order.routes";
import exchangeRateRoutes from "./exchange-rate.routes";

const router = Router();

router.use("/users", userRoutes);
router.use("/orders", orderRoutes);
router.use("/exchange-rate", exchangeRateRoutes);

export default router;
