import { Request, Response, NextFunction } from "express";
import logger from "../utils/logger";

export default function requestLogger(
  req: Request,
  _res: Response,
  next: NextFunction
) {
  logger.info(
    { method: req.method, path: req.path, query: req.query },
    "incoming request"
  );
  next();
}
