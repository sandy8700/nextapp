import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import { userSchema } from "@/lib/validation";

export async function GET() {
  const users = await db.user.findMany({
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(users);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = userSchema.parse(body);
    const hashed = await bcrypt.hash(body.password, 10);

    const user = await db.user.create({
      data: {
        name: parsed.name,
        email: parsed.email,
        password: hashed,
        role: parsed.role ?? "CUSTOMER",
      },
    });

    return NextResponse.json(user);

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "User create failed" },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();

    const user = await db.user.update({
      where: { id: body.userId },
      data: {
        role: body.role, 
      },
    });

    return NextResponse.json(user);

  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Role update failed" },
      { status: 500 }
    );
  }
}