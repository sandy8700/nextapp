"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger
} from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { Separator } from "@/components/ui/separator"
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator
} from "@/components/ui/breadcrumb"

import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { toast } from "sonner"
import { Textarea } from "@/components/ui/textarea"

export default function NewProductPage() {

    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [imageUrl, setImageUrl] = useState("")
    const [form, setForm] = useState({
        name: "",
        price: "",
        description: "",
        category: "",
        image: "",
    })
    async function handleImageUpload(file: File) {
        const formData = new FormData()
        formData.append("file", file)

        const res = await fetch("/api/upload", {
            method: "POST",
            body: formData,
        })

        const data = await res.json()
        setImageUrl(data.url)
        setForm(prev => ({ ...prev, image: data.url }))
    }
    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()

        setLoading(true)

        try {
            const res = await fetch("/api/products", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...form,
                    price: Number(form.price),
                }),
            })

            const data = await res.json()

            if (!res.ok) {
                throw new Error(data.message || "Failed to create product")
            }

            toast.success("Product created successfully 🎉")

            setForm({
                name: "",
                price: "",
                description: "",
                category: "",
                image: "",
            })

            setTimeout(() => {
                router.push("/admin/products")
                router.refresh()
            }, 1000)

        } catch (error: unknown) {
            const errorMessage =
                error instanceof Error ? error.message : "Unknown error occurred"

            toast.error("Error creating product", {
                description: errorMessage,
            })
        } finally {
            setLoading(false)
        }
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
                                <BreadcrumbPage>Add Product</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                </header>

                <div className="flex flex-1 flex-col gap-6 p-4">
                    <h1 className="text-2xl font-bold">Add Product</h1>

                    <form onSubmit={handleSubmit} className="max-w-md">

                        <FieldGroup>

                            <Field>
                                <FieldLabel htmlFor="name">Product Name</FieldLabel>
                                <Input
                                    required
                                    value={form.name}
                                    onChange={(e) =>
                                        setForm({ ...form, name: e.target.value })
                                    }
                                />
                            </Field>

                            <Field>
                                <FieldLabel htmlFor="price">Price </FieldLabel>
                                <Input
                                    type="number"
                                    required
                                    value={form.price}
                                    onChange={(e) =>
                                        setForm({ ...form, price: e.target.value })
                                    }
                                />
                            </Field>

                            <Field>
                                <FieldLabel htmlFor="category">Category</FieldLabel>
                                <Input
                                    required
                                    value={form.category}
                                    onChange={(e) =>
                                        setForm({ ...form, category: e.target.value })
                                    }
                                />
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="description">Description</FieldLabel>
                                <Textarea
                                    required
                                    value={form.description}
                                    onChange={(e) =>
                                        setForm({ ...form, description: e.target.value })
                                    }
                                />
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="image">Image URL</FieldLabel>
                                <Input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => {
                                        if (e.target.files?.[0]) {
                                        handleImageUpload(e.target.files[0])
                                        }
                                    }}
                                />
                            </Field>

                        </FieldGroup>

                        <Button type="submit" className="w-full mt-4" disabled={loading}>
                            {loading ? "Saving..." : "Save Product"}
                        </Button>

                    </form>
                </div>

            </SidebarInset>
        </SidebarProvider>
    )
}