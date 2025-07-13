// lib/jwt.ts
import jwt, { JwtPayload } from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET!;

export function signToken(payload: object): string {
  return jwt.sign(payload, SECRET_KEY, { expiresIn: "7d" });
}
export function verifyToken(token: string): JwtPayload {
  return jwt.verify(token, SECRET_KEY) as JwtPayload;
}
