import { Router } from "express";
import { getDatafromFile } from "../controllers/get-data-from-file";

const router = Router();

router.get("/", getDatafromFile);

export default router;
