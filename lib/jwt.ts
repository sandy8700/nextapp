import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET!;

export function signToken(user: { id: string; role: string }) {
  return jwt.sign({
      id: user.id,
      role: user.role,
    },
    SECRET, {
    expiresIn: "7d",
  });
}

export function verifyToken(token: string) {
  return jwt.verify(token, SECRET) as {
    id: string;
    role: string;
  };
}