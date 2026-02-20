"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { toast } from "sonner"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { Product } from "@/types/products"

export default function EditProductPage() {
    const router = useRouter()
    const params = useParams()
    const id = params.id as string

    const [loading, setLoading] = useState(false)
    const [fetching, setFetching] = useState(true)

    const [form, setForm] = useState({
        name: "",
        price: "",
        category: "",
        image: "",
    })

    useEffect(() => {
        async function fetchProduct() {
            try {
                const res = await fetch(`/api/products/${id}`)
                if (!res.ok) throw new Error("API error")

                const data: Product | null = await res.json()

                if (!data) {
                    toast.error("Product not found")
                    router.push("/admin/products")
                    return
                }

                setForm({
                    name: data.name ?? "",
                    price: String(data.price ?? ""),
                    category: data.category ?? "",
                    image: data.image ?? "",
                })

            } catch (err) {
                console.error(err)
                toast.error("Failed to load product")
            } finally {
                setFetching(false)
            }
        }

        if (id) fetchProduct()
    }, [id, router])

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setLoading(true)

        try {
            const res = await fetch(`/api/products/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...form,
                    price: Number(form.price),
                }),
            })

            if (!res.ok) throw new Error("Update failed")

            toast.success("Product updated 🎉")

            router.push("/admin/products")
            router.refresh()

        } catch (err) {
            console.error(err)
            toast.error("Failed to update product")
        } finally {
            setLoading(false)
        }
    }

    if (fetching) {
        return <div className="p-4">Loading product...</div>
    }

    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>

                <header className="flex h-16 items-center gap-2 px-4">
                    <SidebarTrigger />
                    <Separator orientation="vertical" className="h-4" />

                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <BreadcrumbLink href="/admin/dashboard">
                                    Dashboard
                                </BreadcrumbLink>
                            </BreadcrumbItem>

                            <BreadcrumbSeparator />

                            <BreadcrumbItem>
                                <BreadcrumbLink href="/admin/products">
                                    Products
                                </BreadcrumbLink>
                            </BreadcrumbItem>

                            <BreadcrumbSeparator />

                            <BreadcrumbItem>
                                <BreadcrumbPage>Edit Product</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                </header>

                <div className="flex flex-1 flex-col gap-6 p-4">


                    <h1 className="text-2xl font-bold mb-4">Edit Product</h1>
                    <span>Products id: {id }</span>
                    <form onSubmit={handleSubmit}>

                        <FieldGroup>

                            <Field>
                                <FieldLabel>Product Name</FieldLabel>
                                <Input
                                    value={form.name}
                                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                                    required
                                />
                            </Field>

                            <Field>
                                <FieldLabel>Price</FieldLabel>
                                <Input
                                    type="number"
                                    value={form.price}
                                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                                    required
                                />
                            </Field>

                            <Field>
                                <FieldLabel>Category</FieldLabel>
                                <Input
                                    value={form.category}
                                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                                    required
                                />
                            </Field>

                            <Field>
                                <FieldLabel>Image URL</FieldLabel>
                                <Input
                                    value={form.image}
                                    onChange={(e) => setForm({ ...form, image: e.target.value })}
                                />
                            </Field>

                        </FieldGroup>

                        <Button type="submit" className="w-full mt-4" disabled={loading}>
                            {loading ? "Updating..." : "Update Product"}
                        </Button>

                    </form>

                </div>

            </SidebarInset>
        </SidebarProvider>

    )
}