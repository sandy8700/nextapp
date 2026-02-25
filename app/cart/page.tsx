"use client"

import { useSelector, useDispatch } from "react-redux"
import { Button } from "@/components/ui/button"
import { CartItem, clearCart, removeFromCart, updateQuantity } from "../store/cartSlice"
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

export default function CartPage() {
    const router = useRouter()
    const dispatch = useDispatch()
    const items = useSelector((state: RootState) => state.cart.items)

    const total = items.reduce(
        (sum: number, item: CartItem) => sum + (item.price * item.quantity), 0)

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
                            <Button variant="destructive" onClick={() => dispatch(clearCart())}> <TrashIcon /> Clear Cart</Button>
                        </div>


                        <div className="border rounded-lg">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Product</TableHead>
                                        <TableHead className="text-center">Qty</TableHead>
                                        <TableHead className="text-right">Total</TableHead>
                                        <TableHead className="w-[80px]"></TableHead>
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
                                                    onChange={(val) => dispatch(updateQuantity({ ...item, quantity: val }))}
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
                                                    onClick={() => dispatch(removeFromCart(item.id))}
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