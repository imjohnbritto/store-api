import { Request, Response, NextFunction } from "express";
import logger from "../utils/logger";
import ApiError from "../utils/ApiError";

export default function errorHandler(
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  logger.error(err);
  if (err instanceof ApiError) {
    return res
      .status(err.status)
      .json({ error: err.message, details: err.details });
  }
  res.status(500).json({ error: "Internal server error" });
}
