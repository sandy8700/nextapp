import { db } from "@/lib/db";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import  * as jwt from "jsonwebtoken";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) {
      return NextResponse.json({ user: null, loggedIn: false }, { status: 401 });
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
   
    return NextResponse.json({ user, loggedIn: true }, );

  } catch {
    return NextResponse.json({ user: null, loggedIn: false }, { status: 401 });
  }
    
}