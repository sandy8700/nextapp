import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ productId: string }> },
) {
  try {
    const { productId } = await params;

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "UserId required" }, { status: 400 });
    }

    await db.wishlist.deleteMany({
      where: {
        userId,
        productId: Number(productId),
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.log("Update cart error", error);

    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}
