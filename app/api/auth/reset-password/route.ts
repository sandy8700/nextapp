import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { token, password } = await req.json();

    const user = await db.passwordResetTokens.findFirst({
      where: {
        token: token,
        expiresAt: { gt: new Date() },
      },
    });

    if (!user) {
      return NextResponse.json({ message: "Invalid or expired token" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.user.update({
      where: { email: user.email },
      data: { password: hashedPassword },
    });

    await db.passwordResetTokens.delete({
      where: { email: user.email },
    });

    return NextResponse.json({ message: "Password updated successfully" });

  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
