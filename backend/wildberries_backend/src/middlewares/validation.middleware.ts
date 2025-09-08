import { Request, Response, NextFunction } from "express";
import { z, ZodError, ZodIssue } from "zod";
import { ValidationError } from "../utilis/errors";

// Middleware to validate request data against a Zod schema
export const validate = (schema: z.ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (e: unknown) {
      if (e instanceof ZodError) {
        const errors: Record<string, string[]> = {};

        e.issues.forEach((issue: ZodIssue) => {
          const path = issue.path.join(".");
          if (!errors[path]) errors[path] = [];
          errors[path].push(issue.message);
        });

        return next(new ValidationError(errors));
      }

      return next(e);
    }
  };
};

// Function to validate arbitrary data
export const validateData = <T>(schema: z.ZodSchema<T>, data: unknown): T => {
  try {
    return schema.parse(data);
  } catch (e: unknown) {
    if (e instanceof ZodError) {
      const errors: Record<string, string[]> = {};

      e.issues.forEach((issue: ZodIssue) => {
        const path = issue.path.join(".");
        if (!errors[path]) errors[path] = [];
        errors[path].push(issue.message);
      });

      throw new ValidationError(errors);
    }
    throw e;
  }
};
