import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { signToken } from "@/lib/jwt";
import { loginSchema } from "@/lib/validation";
import { ZodError } from "zod";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = loginSchema.parse(body);
    const user = await db.user.findUnique({
      where: { email: parsed.email },
    });
    if (!user)
      return NextResponse.json({ message: "User not found" }, { status: 401 });

    const valid = await bcrypt.compare(parsed.password, user.password);

    if (!valid)
      return NextResponse.json(
        { message: "Invalid password" },
        { status: 401 },
      );

    const token = signToken({
      id: user.id,
      role: user.role,
    });

    const response = NextResponse.json(
      {
        success: true,
        message: "Login successful",
      },
      { status: 200 },
    );

    response.cookies.set("token", token, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
    });

    return response;
  } catch (err) {
    if (err instanceof ZodError) {
      return NextResponse.json(
        { message: err.issues[0].message },
        { status: 400 },
      );
    } 

    return NextResponse.json({ message: err }, { status: 500 });
  }
}
