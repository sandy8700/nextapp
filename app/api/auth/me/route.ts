import { db } from "@/lib/db";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import  * as jwt from "jsonwebtoken";

export async function GET() {
  try {
    const token = (await cookies()).get("token")?.value;

    if (!token) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as { id: string };

    const user = await db.user.findUnique({
      where: { id: decoded.id },
       select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
      
    });

    return NextResponse.json({ user });

  } catch {
    return NextResponse.json({ user: null }, { status: 401 });
  }
    
}