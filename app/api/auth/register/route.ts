import { registerSchema } from "@/lib/validation";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { ZodError } from "zod";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = registerSchema.parse(body);

    const exists = await db.user.findUnique({
      where: { email: parsed.email },
    });

    if (exists) {
      return Response.json(
        { message: "Email already registered" },
        { status: 400 },
      );
    }

    const hashed = await bcrypt.hash(parsed.password, 10);

    await db.user.create({
      data: {
        name: parsed.name,
        email: parsed.email,
        password: hashed,
      },
    });

    return Response.json({
      success: true,
      message: "Account created successfully 🎉",
    });
  } catch (err) {
    if (err instanceof ZodError) {
      return Response.json({ message: err.issues[0].message }, { status: 400 });
    }

    return Response.json({ message: "Server error" }, { status: 500 });
  }
}
