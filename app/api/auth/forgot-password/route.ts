import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const after15Min = new Date(Date.now() + 15 * 60 * 1000);
    
    const { email } = await req.json();
    const token = crypto.randomBytes(32).toString("hex");

    const hashedToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    const existing = await db.passwordResetTokens.findUnique({
        where: { email },
        });

        if (existing) {
        await db.passwordResetTokens.update({
            where: { email },
            data: {
            token: hashedToken,
            expiresAt: after15Min,
            },
        });
        } else {
        await db.passwordResetTokens.create({
            data: {
            email,
            token: hashedToken,
            expiresAt: after15Min,
            },
        });
        }
    
    // await db.password_reset_tokens.update({
    //   where: { email },
    //   data: {
    //     token: hashedToken,
    //     expiresAt: after15Min
    // },
    // });
   
    const resetLink = `http://localhost:3000/auth/reset-password?token=${token}`;

    console.log("RESET LINK:", resetLink);

    return NextResponse.json({
      message: "Reset link sent to email",
    });

  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}