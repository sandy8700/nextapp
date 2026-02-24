import { db } from "@/lib/db"
import { NextResponse } from "next/server"


export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params

    console.log("ID:", id)

    const product = await db.product.findUnique({
      where: { id: Number(id) },
    })

    if (!product) {
      return NextResponse.json(
        { message: "Product not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(product)

  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { message: "Failed to fetch product" },
      { status: 500 }
    )
  }
}

export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params
    const body = await req.json()

    const product = await db.product.update({
      where: { id: Number(id) },
      data: {
        name: body.name,
        price: Number(body.price),
        description: body.description,
        category: body.category,
        image: body.image,
      },
    })

    return NextResponse.json(product)

  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { message: "Failed to update product" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params

    await db.product.delete({
      where: { id: Number(id) },
    })

    return NextResponse.json({ message: "Product deleted" })

  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { message: "Failed to delete product" },
      { status: 500 }
    )
  }
}