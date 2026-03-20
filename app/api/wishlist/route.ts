import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { userId, productId } = await req.json();

    if (!userId || !productId) {
      return NextResponse.json(
        { error: "Invalid data" },
        { status: 400 }
      );
    }

    const existing = await db.wishlist.findFirst({
      where: { userId, productId },
    });

    if (existing) {
      await db.wishlist.delete({
        where: { id: existing.id },
      });

      return NextResponse.json({ removed: true });
    }

    // ✅ add
    const wishlist = await db.wishlist.create({
      data: { userId, productId },
    });

    return NextResponse.json({ added: true, wishlist });

  } catch (error) {
    return NextResponse.json(
      { error: "Wishlist error" },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "UserId required" }, { status: 400 });
  }

  const wishlist = await db.wishlist.findMany({
    where: { userId },
    include: {
      product: true,
    },
  });

  return NextResponse.json(wishlist);
}