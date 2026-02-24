import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  const products = await db.product.findMany({
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(products);
}

export async function POST(req: Request) {
  const body = await req.json();

  const product = await db.product.create({
    data: {
      name: body.name,
      price: body.price,
      description: body.description,
      category: body.category,
      image: body.image,
    },
  });

  return NextResponse.json(product, { status: 201 });
}
