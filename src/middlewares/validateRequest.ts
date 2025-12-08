import { NextFunction, Request, Response } from "express";
import { ZodError, ZodIssue, ZodTypeAny } from "zod";

// Generic validator middleware that supports params/query/body schemas
const validateRequest =
  (schema: ZodTypeAny) => (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse({
        params: req.params,
        query: req.query,
        body: req.body,
      });
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        return res.status(400).json({
          message: "Validation error",
          errors: err.issues.map((e: ZodIssue) => ({
            path: e.path.join("."),
            message: e.message,
          })),
        });
      }
      return res.status(400).json({ message: "Validation failed" });
    }
  };

export default validateRequest;
