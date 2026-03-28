import { Request, Response, NextFunction } from "express";
import Ajv from "ajv";
import addFormats from "ajv-formats";

const ajv = new Ajv({ allErrors: true });
addFormats(ajv);

export const validateBody = (schema: any) => {
  const validate = ajv.compile(schema);

  return (req: Request, res: Response, next: NextFunction) => {
    const valid = validate(req.body);

    if (!valid) {
      return res.status(400).json({
        message: "Validation failed",
        errors: validate.errors
      });
    }

    next(); 
  };
};