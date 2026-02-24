"use client"
import { addToCart } from "@/app/store/cartSlice";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import { QuantityInput } from "@/components/ui/quantity";
import { Product } from "@/types/products";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

export default function ProductsViewPage() {
    const dispatch = useDispatch()
    const [product, setProduct] = useState<Product | null>(null)
    const [quantity, setQuantity] = useState(1)
    const params = useParams()
    const id = params.id as string
    useEffect(() => {
        const details = async () => {
            const res = await fetch("/api/products/" + id);
            const data = await res.json();
            setProduct(data)
        }
        void details()
    }, [id])

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
                            <BreadcrumbLink href="/products">
                                Products
                            </BreadcrumbLink>
                        </BreadcrumbItem>

                        <BreadcrumbSeparator />

                        <BreadcrumbItem>
                            <BreadcrumbPage>{product?.name}</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>

            </header>
            <div className="grid grid-cols-3 gap-4">
                {product && (
                    <>
                        <div className="bg-muted/50 w-full rounded-lg flex items-center justify-center relative h-[500px] overflow-hidden">
                            {product.image ? (
                                <Image
                                    src={product.image}
                                    alt={product.name}
                                    fill
                                    className="object-cover rounded-t-lg border w-full relative"
                                />
                            ) : (
                                <div className="bg-muted/50 h-full w-full rounded-t-lg flex items-center justify-center text-sm text-muted-foreground">
                                    No Image
                                </div>
                            )}
                        </div>
                        <div className="col-span-2 w-full">
                            <h1 className="text-2xl font-bold mb-3">{product.name}</h1>

                            <p className="text-xl font-semibold text-emerald-600">
                                ₹ {product.price}
                            </p>
                            <div className="text-muted-foreground my-3">
                                <span className="font-medium text-primary">Description: </span>
                                {product.description}

                            </div>
                            <div className="add-to-cart flex items-end gap-4 my-6">
                                <div>
                                    <Field>
                                        <FieldLabel>Quantity</FieldLabel>
                                        <QuantityInput value={quantity} onChange={setQuantity} />
                                    </Field>
                                </div>
                                <Button className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 transition" onClick={() =>
                                    dispatch(
                                        addToCart({
                                            id: Number(product.id),
                                            name: product.name,
                                            price: product.price,
                                            image: product.image,
                                            quantity: quantity,
                                        })
                                    )
                                }
                                >
                                    Add to Cart
                                </Button>
                            </div>
                            <span className="text-sm text-muted-foreground">
                                Category: {product.category}
                            </span>

                        </div>
                    </>
                )}
            </div>

        </div>
    );
}