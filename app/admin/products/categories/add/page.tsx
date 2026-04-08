"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Separator } from "@/components/ui/separator";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";

export default function ProductCategory() {
    const [loading, setLoading] = useState(false)
    const [imageUrl, setImageUrl] = useState("")

    const [form, setForm] = useState({
        name: "",
        description: "",
        image: "",
    });

    const handleSubmit = async () => {
        setLoading(true)

        try {
            const res = await fetch("/api/categories", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(form),
            });

            const data = await res.json();

            if (!res.ok) {
                toast.error(data.error);
                return;
            }

            toast.success("Category created 🎉");

            setForm({
                name: "",
                description: "",
                image: "",
            });
        } catch (error) {
            toast.error("An error occurred while creating the category.", { description: error instanceof Error ? error.message : undefined });
        } finally {
            setLoading(false)
        }
    };
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
                                <BreadcrumbLink href="/admin/products/categories">
                                    Categories                                
                                </BreadcrumbLink>
                            </BreadcrumbItem>

                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbPage>Create Category</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                </header>

                <div className="flex flex-1 flex-col gap-6 p-4">
                    <h1 className="text-2xl font-bold">Create Category</h1>

                    <form onSubmit={handleSubmit} className="max-w-md">

                        <FieldGroup>

                            <Field>
                                <FieldLabel htmlFor="name">Category Name</FieldLabel>
                                <Input
                                    required
                                    value={form.name}
                                    onChange={(e) =>
                                        setForm({ ...form, name: e.target.value })
                                    }
                                    placeholder="Enter category name"
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
                                    placeholder="Enter category description"
                                />
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="category">Category Image</FieldLabel>
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
                            {loading ? "Creating..." : "Create Category"}
                        </Button>

                    </form>
                </div>

            </SidebarInset>
        </SidebarProvider>

    );
}