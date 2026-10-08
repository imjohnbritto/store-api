import { Router } from "express";
import userRoutes from "./user.routes";
import orderRoutes from "./order.routes";
import exchangeRateRoutes from "./exchange-rate.routes";
import readFileFetchData from "./read-file-data.routes";

const router = Router();

router.use("/users", userRoutes);
router.use("/orders", orderRoutes);
router.use("/exchange-rate", exchangeRateRoutes);
router.use("/read-file-fetch-data", readFileFetchData);

export default router;
