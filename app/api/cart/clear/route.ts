import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url)
  const userId = searchParams.get("userId")

  if (!userId) {
    return NextResponse.json({ error: "Missing userId" }, { status: 400 })
  }

  await db.cart.deleteMany({
    where: { userId },
  })

  return NextResponse.json({ message: "Cart cleared" })
}