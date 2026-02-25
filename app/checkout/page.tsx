"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { RootState } from "../store"
import { useSelector } from "react-redux"
import { useRouter } from "next/navigation"
import { Field } from "@/components/ui/field"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { useEffect, useState } from "react"
import { CountrySelect, StateSelect } from "react-country-state-city";
import { CartItem } from "../store/cartSlice"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function CheckoutPage() {
    const items = useSelector((state: RootState) => state.cart.items)
    const router = useRouter()
    const user = useSelector((state: RootState) => state.auth.user);
    const isLoggedIn = !!user;
    const [countryId, setCountryId] = useState<number | null>(null)
    const [stateId, setStateId] = useState<number | null>(null)
    console.log(countryId, stateId);
    const total = items.reduce(
        (sum: number, item: CartItem) => sum + (item.price * item.quantity), 0)

        useEffect(() => {
            if (!items.length) {
                router.replace("/cart")
            }
        }, [items, router])

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
                            <BreadcrumbPage>Checkout</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>

            </header>
            <h1 className="text-2xl font-bold mb-6">Checkout</h1>
            <div className="grid lg:grid-cols-3 gap-8 space-y-8">

                <div className="lg:col-span-2 space-y-8">
                    {!isLoggedIn && (
                        <Card className="bg-purple-100 border-purple-200">
                            <CardContent className="p-6 flex items-center justify-between">
                                <div>
                                    <h3 className="text-lg font-semibold">Already have an account?</h3>
                                    <p className="text-sm text-muted-foreground">
                                        Log in for fast checkout and easy access to your orders.
                                    </p>
                                </div>

                                <div className="flex gap-3">
                                    <Button onClick={() => router.push("/auth/login")}>Log in</Button>
                                    <Button variant="link" onClick={() => router.push("/auth/register")} asChild>
                                        Create account
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                    <Card>
                        <CardHeader>
                            <CardTitle>Contact information</CardTitle>
                        </CardHeader>
                        <CardContent className="grid md:grid-cols-2 gap-4">
                            <Field>
                                <Label className="text-sm font-medium">Email address *</Label>
                                <Input />
                            </Field>
                            <Field>
                                <Label className="text-sm font-medium">Confirm email *</Label>
                                <Input />
                            </Field>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Billing address</CardTitle>
                        </CardHeader>
                        <CardContent className="grid md:grid-cols-2 gap-4">

                            <Field>
                                <Label className="text-sm font-medium">First name *</Label>
                                <Input />
                            </Field>

                            <Field>
                                <Label className="text-sm font-medium">Last name *</Label>
                                <Input />
                            </Field>

                            <Field className="md:col-span-2">
                                <Label className="text-sm font-medium">Company (optional)</Label>
                                <Input />
                            </Field>
                            <Field>
                                <Label className="text-sm font-medium">Country/Region *</Label>
                                <CountrySelect
                                    placeHolder="Select Country"
                                    onChange={(e) => {
                                        if (e && typeof e === 'object' && 'id' in e) {
                                            setCountryId(e.id)
                                            setStateId(null)
                                        }
                                    }}
                                />

                            </Field>
                            <Field>
                                <Label className="text-sm font-medium">Street address *</Label>
                                <Input placeholder="123 Main St" />
                            </Field>

                            <Field>
                                <Label className="text-sm font-medium">Apartment, suite, etc. (optional)</Label>
                                <Input placeholder="Apartment or suite" />
                            </Field>
                            <Field>
                                <Label className="text-sm font-medium">City *</Label>
                                <Input />
                            </Field>
                            <Field>
                                <Label className="text-sm font-medium">State/Province *</Label>
                                <StateSelect
                                    countryid={countryId || 0}
                                    placeHolder="Select State"
                                    onChange={(e) => {
                                        if (e && typeof e === 'object' && 'id' in e) {
                                            setStateId(e.id)
                                        }
                                    }}
                                />

                            </Field>
                            <Field>
                                <Label className="text-sm font-medium">Postal code *</Label>
                                <Input />
                            </Field>
                        </CardContent>
                    </Card>
                    <div className="flex justify-end">

                        <Button className="w-fit h-12 text-lg">
                            Place order
                        </Button>
                    </div>

                </div>

                <div className="space-y-6">
                    <Card>
                        {items.length > 0 && (
                            <CardHeader>
                                <CardTitle>{items.length} item{items.length > 1 ? 's' : ''}</CardTitle>
                            </CardHeader>
                        )}
                        <CardContent className="space-y-4">

                            {items.map((item) => (
                                <>
                                    <Card className="p-4 flex gap-3">

                                        <div className="relative  ">
                                            <div className="h-14 w-14 rounded-md overflow-hidden border bg-muted">
                                                {item.image ? (
                                                    <Image
                                                        src={item.image}
                                                        alt={item.name}
                                                        width={56}
                                                        height={56}
                                                        className="object-cover"
                                                    />
                                                ) : null}
                                            </div>

                                            <Badge className="absolute -top-2 -right-2 rounded-full px-2 py-0 text-xs">
                                                {item.quantity}
                                            </Badge>
                                        </div>

                                        <div className=" gap-3">
                                            <div className="flex justify-between items-start">
                                                <h4 className="font-semibold text-sm">{item.name}</h4>

                                                <div className="text-right">
                                                    <div className="font-semibold text-sm text-primary">
                                                        ₹ {item.price.toLocaleString("en-IN")}
                                                    </div>
                                                </div>
                                            </div>


                                        </div>
                                    </Card>
                                </>
                            ))}
                            <div className="pt-4 flex justify-between">
                                <span>Subtotal</span>
                                <span>₹ {total}</span>
                            </div>

                            <div className="flex justify-between text-lg font-semibold">
                                <span>Total</span>
                                <span>₹ {total}</span>
                            </div>


                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Payment method</CardTitle>
                            <p className="text-sm text-muted-foreground">
                                All transactions are secure and encrypted.
                            </p>
                        </CardHeader>

                        <CardContent className="space-y-6">

                            <div className="flex items-center gap-2">
                                <Label>Credit or debit card</Label>
                            </div>
                            <div className="border rounded-lg p-4 space-y-2">
                                <div className="flex flex-col gap-3">
                                    <Label htmlFor="text">Name of cardholder</Label>
                                    <Input id="text" placeholder="Full name as it appears on the card" />
                                </div>
                                <div className="flex flex-col gap-3">
                                    <Label htmlFor="number">Card number</Label>
                                    <Input id="number" placeholder="1234 5678 9012 3456" />
                                </div>
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="flex flex-col gap-3">
                                        <Label htmlFor="month">Expires</Label>
                                        <Select>
                                            <SelectTrigger id="month" aria-label="Month" className="w-full">
                                                <SelectValue placeholder="Month" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="1">January</SelectItem>
                                                <SelectItem value="2">February</SelectItem>
                                                <SelectItem value="3">March</SelectItem>
                                                <SelectItem value="4">April</SelectItem>
                                                <SelectItem value="5">May</SelectItem>
                                                <SelectItem value="6">June</SelectItem>
                                                <SelectItem value="7">July</SelectItem>
                                                <SelectItem value="8">August</SelectItem>
                                                <SelectItem value="9">September</SelectItem>
                                                <SelectItem value="10">October</SelectItem>
                                                <SelectItem value="11">November</SelectItem>
                                                <SelectItem value="12">December</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="flex flex-col gap-3">
                                        <Label htmlFor="year">Year</Label>
                                        <Select>
                                            <SelectTrigger id="year" aria-label="Year" className="w-full">
                                                <SelectValue placeholder="Year" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {Array.from({ length: 10 }, (_, i) => (
                                                    <SelectItem key={i} value={`${new Date().getFullYear() + i}`}>
                                                        {new Date().getFullYear() + i}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="flex flex-col gap-3">
                                        <Label htmlFor="cvc">CVC</Label>
                                        <Input id="cvc" placeholder="CVC" />
                                    </div>
                                </div>

                                <p className="text-xs text-muted-foreground">
                                    By providing your card information, you allow us to charge your card for future payments.
                                </p>
                            </div>

                        </CardContent>
                    </Card>
                    <p className="text-xs text-muted-foreground">
                        By paying, you agree to the Terms of Service and Privacy Policy.
                    </p>
                </div>
            </div>
        </div>
    )
}