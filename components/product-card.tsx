"use client";

import Image from "next/image";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Product } from "@/types/products";
import Link from "next/link";
import { addToCart } from "@/app/store/cartSlice";
import { useDispatch, useSelector } from "react-redux";
import { ArrowRight, Loader2 } from "lucide-react";
import { useState } from "react";
import { RootState } from "@/app/store";
import { useRouter } from "next/navigation";

export function ProductCard({ product }: { product: Product }) {
  const dispatch = useDispatch()
  const router = useRouter()
  const cartItem = useSelector((state: RootState) =>
    state.cart.items.find(item => item.id === Number(product.id))
  )
  const [loading, setLoading] = useState(false)
  const handleAddToCart = async () => {
    setLoading(true)

    setTimeout(() => {
      dispatch(
        addToCart({
          id: Number(product.id),
          name: product.name,
          price: product.price,
          image: product.image,
          quantity: 1,
        })
      )
      setLoading(false)
    }, 500)
  }

  return (
    <>
      {product && (
        <Card className="w-full max-w-sm hover:shadow-lg transition pt-0">
          <CardHeader className="p-0">
            <div className="relative h-48 w-full">
              {product.image ? (
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover rounded-t-lg"
                />
              ) : (
                <div className="bg-muted/50 h-full w-full rounded-t-lg flex items-center justify-center text-sm text-muted-foreground">
                  No Image
                </div>
              )}
            </div>
          </CardHeader>

          <CardContent className="space-y-2 pt-4">
            {product.category && (
              <Badge variant="secondary">{product.category}</Badge>
            )}

            <CardTitle className="text-lg"><Link href={`/products/${product.id}`}>{product.name}</Link></CardTitle>
            <div className="max-w-[300px] overflow-hidden">
              <p className="text-muted-foreground text-sm truncate">
                {product.description || "-"}
              </p>
            </div>

            <p className="text-xl font-semibold"> ₹ {Number(product.price).toLocaleString("en-IN")}</p>
          </CardContent>

          <CardFooter className="flex gap-2">
            {!cartItem ? (
              <Button className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 transition cursor-pointer" onClick={handleAddToCart}
                disabled={loading}
              >
                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                {loading ? "Adding..." : "Add to Cart"}

              </Button>
            ) : (

              <Button variant="outline" onClick={() => router.push("/cart")} className="w-fit px-4 py-2 rounded hover:bg-muted transition cursor-pointer">
                View Cart <ArrowRight className="h-4 w-4" />
              </Button>
            )}
          </CardFooter>
        </Card>
      )}
    </>
  );
}