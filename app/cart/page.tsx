"use client"

import { useSelector, useDispatch } from "react-redux"
import { Button } from "@/components/ui/button"
import { CartItem, clearCart, removeFromCart, updateQuantity, setCart } from "../store/cartSlice"
import { RootState } from "../store"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import Image from "next/image"
import { TrashIcon } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { QuantityInput } from "@/components/ui/quantity"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { toast } from "sonner"

type CartApiResponse = {
    id: number
    userId: string
    productId: number
    price: number
    quantity: number
    product?: {
        id: number
        name: string
        image?: string
    }
}
export default function CartPage() {
    const router = useRouter()
    const dispatch = useDispatch()

    const items = useSelector((state: RootState) => state.cart.items)
    const user = useSelector((state: RootState) => state.auth.user);

    const total = items.reduce(
        (sum: number, item: CartItem) => sum + (item.price * item.quantity), 0)

    useEffect(() => {
        if (!user?.id) return;

        const loadCart = async () => {
            try {
                const res = await fetch(`/api/cart?userId=${user.id}`);
                const data: CartApiResponse[] = await res.json();
                console.log("Cart API Response:", data);

                if (!res.ok) {
                    const errorData = await res.json()
                    console.error(errorData.error)
                    return
                }


                const formatted: CartItem[] = data.map((item) => ({
                    id: item.productId,
                    name: item.product?.name || "",
                    image: item.product?.image || "",
                    price: item.price,
                    quantity: item.quantity,
                }));
                console.log("Formatted Cart Items:", formatted);

                dispatch(setCart(formatted));
            } catch (err) {
                console.error("Load Cart Error:", err);
            }
        };

        loadCart();
    }, [user, dispatch]);

    const handleQuantityChange = async (item: CartItem, quantity: number) => {
        if (!user?.id) return;

        dispatch(updateQuantity({ ...item, quantity }));

        try {
            const res = await fetch(`/api/cart/${item.id}?userId=${user.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    userId: user.id,
                    quantity: quantity,
                    price: item.price,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                toast.error(data.error || "Failed to update quantity");
            }

        } catch (error) {
            console.error("Update Error:", error);
            toast.error("Something went wrong");
        }
    };
    const confirmRemove = (onConfirm: () => void) => {
        toast("Remove item?", {
            description: "Are you sure you want to remove this item?",
            action: {
                label: "Yes",
                onClick: onConfirm,
            },
            cancel: {
                label: "No",
                onClick: () => { },
            },
        });
    };
    const handleRemoveItem = async (productId: number) => {
        confirmRemove(async () => {

            if (!user?.id) {
                toast.error("Please login first")
                return
            }

            try {
                const res = await fetch(
                    `/api/cart/${productId}?userId=${user.id}`,
                    { method: "DELETE" }
                )

                const data = await res.json()
                console.log("Remove API Response:", data)
                if (!res.ok) {
                    toast.error(data.error || "Failed to remove item")
                    return
                }

                dispatch(removeFromCart(productId))
                toast.error("Item removed from cart")

            } catch (error) {
                console.error("Remove Error:", error)
                toast.error("Something went wrong")
            }
        });
    }
    const handleClearCart = async () => {
        if (!user?.id) return
        const confirmed = window.confirm("Are you sure you want to clear your cart?")
        if (!confirmed) return
        try {
            const res = await fetch(
                `/api/cart/clear?userId=${user.id}`,
                { method: "DELETE" }
            )

            if (!res.ok) {
                const data = await res.json()
                console.error(data.error)
                return
            }

            dispatch(clearCart())
            toast.success("Cart cleared")

        } catch (error) {
            console.error("Clear Cart Error:", error)
        }
    }
    return (
        <div className="container mx-auto">
            <header className="flex h-16 items-center gap-2 ">
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink href="/">
                                Home
                            </BreadcrumbLink>
                        </BreadcrumbItem>

                        <BreadcrumbSeparator />

                        <BreadcrumbItem>
                            <BreadcrumbPage>Cart</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>

            </header>
            {!items.length ? (

                <div className="container mx-auto py-20 flex justify-center">
                    <Card className="p-8 text-center">
                        <CardTitle className="mb-2">Your cart is empty</CardTitle>
                        <p className="text-muted-foreground mb-4">
                            Add items to continue shopping
                        </p>
                        <Button className="cursor-pointer" onClick={() => router.push("/products")} >
                            Continue Shopping
                        </Button>
                    </Card>
                </div>
            ) : (
                <div className="grid grid-cols-3 gap-4">
                    <div className="col-span-2 w-full">
                        <div className="flex justify-between items-center mb-3">
                            <h1 className="text-2xl font-bold">Cart</h1>
                            <Button variant="destructive" onClick={() => handleClearCart()}> <TrashIcon /> Clear Cart</Button>
                        </div>


                        <div className="border rounded-lg">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Product</TableHead>
                                        <TableHead className="text-center">Qty</TableHead>
                                        <TableHead className="text-right">Total</TableHead>
                                        <TableHead className="w-20"></TableHead>
                                    </TableRow>
                                </TableHeader>

                                <TableBody>
                                    {items.map((item) => (
                                        <TableRow key={item.id}>
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <Image
                                                        src={item.image || "/placeholder.png"}
                                                        alt={item.name}
                                                        width={60}
                                                        height={60}
                                                        className="rounded object-cover"
                                                    />
                                                    <span className="font-medium">{item.name}</span>
                                                </div>
                                            </TableCell>

                                            <TableCell className="text-center">
                                                <QuantityInput
                                                    value={item.quantity}
                                                    onChange={(val) => handleQuantityChange(item, val)}
                                                />
                                            </TableCell>

                                            <TableCell className="text-right font-medium">
                                                ₹ {(item.price * item.quantity).toLocaleString()}
                                            </TableCell>

                                            <TableCell>
                                                <Button
                                                    size="icon"
                                                    variant="ghost"
                                                    className="text-red-500 hover:bg-red-100 hover:text-red-600 rounded-circle"
                                                    onClick={() => handleRemoveItem(item.id)}
                                                >
                                                    <TrashIcon />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                    <div className="w-full">
                        <Card className="w-full max-w-md flex flex-col">
                            <CardHeader>
                                <div className="flex justify-between items-center">
                                    <CardTitle>Order Summary</CardTitle>
                                    <span className="font-bold">{items.length} Product(s)</span>
                                </div>
                            </CardHeader>

                            <CardContent className="flex flex-col gap-3">
                                <div className="border rounded-lg p-4 space-y-3">
                                    <div className="flex justify-between">
                                        <span>Product(s) total</span>
                                        <span>₹ {total}</span>
                                    </div>

                                    <div className="flex justify-between">
                                        <span>Delivery</span>
                                        <span className="text-muted-foreground">FREE</span>
                                    </div>
                                </div>

                                <div className="flex justify-between font-semibold">
                                    <span>Total</span>
                                    <span>₹ {total}</span>
                                </div>


                            </CardContent>
                            <CardFooter>
                                <Button className="w-full cursor-pointer" onClick={() => router.push("/checkout")}>Proceed to Checkout</Button>
                            </CardFooter>
                        </Card>

                    </div>
                </div>
            )}
        </div>
    )
}