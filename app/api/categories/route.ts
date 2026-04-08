import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const categories = await db.category.findMany();

    return NextResponse.json(categories); 
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}


export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { name, description, image } = body;

    if (!name) {
      return NextResponse.json(
        { error: "Name is required" },
        { status: 400 }
      );
    }

    const slug = name.toLowerCase().replace(/\s+/g, "-");

    const category = await db.category.create({
      data: {
        name,
        slug,
        description,
        image,
      },
    });

    return NextResponse.json(category);

  } catch (error) {
    console.error("Error creating category:", error);
    return NextResponse.json(
      { error: "Category create failed" },
      { status: 500 }
    );
  }
}