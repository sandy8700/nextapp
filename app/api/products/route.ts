import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const products = await db.product.findMany({
      include: {
        category: true, 
      },
     orderBy: { createdAt: "desc" },

    });

    return NextResponse.json(products);

  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
export async function POST(req: Request) {
  const body = await req.json();

  const product = await db.product.create({
    data: {
      name: body.name,
      price: body.price,
      description: body.description,
      image: body.image,
      categoryId: Number(body.category),
    },
  });

  return NextResponse.json(product, { status: 201 });
} 
