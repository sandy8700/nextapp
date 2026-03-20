import { NextResponse } from "next/server"
import { db } from "@/lib/db"

// delete a cart item by productId and userId
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ productId: string }> }
) {
  const { productId } = await params; 
  const { searchParams } = new URL(req.url)
  const userId = searchParams.get("userId")

  if (!userId) {
    return NextResponse.json({ error: "Missing userId" }, { status: 400 })
  }

  await db.cart.deleteMany({
    where: {
      userId,
      productId: Number(productId),
    },
  })

  return NextResponse.json({ message: "Item removed" })
}

// update the quantity and price of a cart item
export async function PUT(req: Request, { params }: { params: Promise<{ productId: string }> }) {
  try {
    const body = await req.json();
    const { userId, quantity } = body;

    const { productId } = await params;

    const cart = await db.cart.updateMany({
      where: {
        userId,
        productId: Number(productId),
      },
      data: {
        quantity,
      },
    });

    return NextResponse.json({
      success: true,
      cart
    });

  } catch (error) {
    console.log("Update cart error", error)
    return NextResponse.json(
      { error: "Failed to update cart" },
      { status: 500 }
    );
  }
}