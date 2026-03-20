import { NextResponse } from "next/server"
import { db } from "@/lib/db"

// ✅ POST → Add to Cart
export async function POST(req: Request) {
  try {
    const body = await req.json()

    const userId: string = body.userId
    const productId: number = Number(body.productId)

    if (!userId || Number.isNaN(productId)) {
      return NextResponse.json(
        { error: "Invalid payload" },
        { status: 400 }
      )
    }

    // product check
    const product = await db.product.findUnique({
      where: { id: productId },
    })

    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      )
    }

    // check if already in cart
    const existing = await db.cart.findFirst({
      where: {
        userId,
        productId,
      },
    })

    if (existing) {
      await db.cart.update({
        where: { id: existing.id },
        data: {
        quantity: existing.quantity + 1,

        },
      })
    } else {
      await db.cart.create({
        data: {
          userId,
          productId,
          price: product.price,
          quantity: 1,
        },
      })
    }

    return NextResponse.json({ message: "Added to cart" })

  } catch (error) {
    console.error("Cart POST Error:", error)
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    )
  }
}

// ✅ GET → Get User 

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json(
        { error: "Missing userId" },
        { status: 400 }
      )
    }

    const cartItems = await db.cart.findMany({
      where: { userId },
      include: {
        product: true,
      },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json(cartItems)

  } catch (error) {
    console.error("Cart GET Error:", error)
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    )
  }
}

// export async function POST(req: Request) {
//   try {
//     const body = await req.json()

//     const userId: string = body.userId
//     const productId: number = Number(body.productId)
//     const quantity: number = Number(body.quantity) || 1 // ✅ FIX

//     if (!userId || Number.isNaN(productId)) {
//       return NextResponse.json(
//         { error: "Invalid payload" },
//         { status: 400 }
//       )
//     }

//     // ✅ check product
//     const product = await db.product.findUnique({
//       where: { id: productId },
//     })

//     if (!product) {
//       return NextResponse.json(
//         { error: "Product not found" },
//         { status: 404 }
//       )
//     }

//     // ✅ check existing cart item
//     const existing = await db.cart.findFirst({
//       where: {
//         userId,
//         productId,
//       },
//     })

//     if (existing) {
//       // ✅ update quantity
//       await db.cart.update({
//         where: { id: existing.id },
//         data: {
//           quantity: existing.quantity + quantity,
//         },
//       })
//     } else {
//       // ✅ create new item
//       await db.cart.create({
//         data: {
//           userId,
//           productId,
//           price: product.price, // optional (can remove)
//           quantity: quantity,
//         },
//       })
//     }

//     return NextResponse.json({ message: "Added to cart" })

//   } catch (error) {
//     console.error("Cart POST Error:", error)
//     return NextResponse.json(
//       { error: "Something went wrong" },
//       { status: 500 }
//     )
//   }
// }