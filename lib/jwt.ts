import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET!;

export function signToken<T extends Record<string, unknown>>(payload: T) {
  return jwt.sign(payload, SECRET, {
    expiresIn: "1d",
  });
}

export function verifyToken(token: string) {
  return jwt.verify(token, SECRET);
}

