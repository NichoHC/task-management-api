import jwt from "jsonwebtoken";
import { config } from "../config/config";

export function generateToken(userId: number): string {
  return jwt.sign(
    { userId },
    config.JWT_SECRET,
    { expiresIn: "1d" }
  );
}