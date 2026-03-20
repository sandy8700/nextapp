import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { checkoutSchema } from "@/lib/validation";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = checkoutSchema.parse(body.form);

    
    const { userId, items } = body;

    await db.checkout.create({
      data: {
        userId,
        email: parsed.email,
        firstName: parsed.firstName,
        lastName: parsed.lastName,
        company: parsed.company ?? '',
        country: parsed.country,
        state: parsed.state,
        city: parsed.city,
        address: parsed.address,
        address2: parsed.address2 ?? '',
        postal: parsed.postal,
      },
    });

    const total = items.reduce(
      (sum: number, item: { price: number; quantity: number }) =>
        sum + item.price * item.quantity,
      0
    );

    const order = await db.order.create({
      data: {
        userId,
        total,
        items: {
          create: items.map((item: { id: number; quantity: number; price: number }) => ({
            productId: item.id,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
    });

    await db.cart.deleteMany({
      where: { userId },
    });

    return NextResponse.json({ success: true, order });

  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Checkout failed" },
      { status: 500 }
    );
  }
}