"use client"

import { useSelector, useDispatch } from "react-redux"
import { Button } from "@/components/ui/button"
import { CartItem, clearCart, removeFromCart } from "../store/cartSlice"
import { RootState } from "../store"

export default function CartPage() {
    const dispatch = useDispatch()
    const items = useSelector((state: RootState) => state.cart.items)

    const total = items.reduce(
        (sum: number, item: CartItem) => sum + (item.price * item.quantity), 0)

    if (!items.length) return <p className="p-6">Cart is empty</p>

    return (
        <div className="p-6 space-y-4">
            <h1 className="text-2xl font-bold">Cart</h1>

            {items.map((item: CartItem) => (

                <div key={item.id} className="flex justify-between border p-4 rounded">
                    <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm">Qty: {item.quantity}</p>
                    </div>

                    <div>
                        <p>₹ {item.price * item.quantity}</p>

                        <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => dispatch(removeFromCart(item.id))}
                        >
                            Remove
                        </Button>
                    </div>
                </div>
            ))}

            <div className="flex justify-between font-semibold">
                <span>Total</span>
                <span>₹ {total}</span>
            </div>

            <Button onClick={() => dispatch(clearCart())}>Clear Cart</Button>
        </div>
    )
}