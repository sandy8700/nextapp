"use client";

import Image from "next/image";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Product } from "@/types/products";
import Link from "next/link";
import { addToCart } from "@/app/store/cartSlice";
import { useDispatch, useSelector } from "react-redux";
import { ArrowRight, Heart, Loader2 } from "lucide-react";
import { useState } from "react";
import { RootState } from "@/app/store";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { toggleWishlist } from "@/app/store/wishlistSlice";

export function ProductCard({ product }: { product: Product }) {
  const dispatch = useDispatch()
  const user = useSelector((state: RootState) => state.auth.user);
  const wishlistIds = useSelector((state: RootState) => state.wishlist.ids);

// const isWishlisted = wishlistIds.includes(product.id);
  const router = useRouter()
  const cartItem = useSelector((state: RootState) =>
    state.cart.items.find(item => item.id === Number(product.id))
  )
  const [loading, setLoading] = useState(false)
  const handleAddToCart = async () => {
    try {
      if (!user) {
        router.push("/login")
        return
      }
      setLoading(true)

      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          productId: product.id
        }),
      })
      const data = await res.json()
      console.log("Add to cart response:", data)
      if (!res.ok) {
        throw new Error("Failed to add to cart")
      }

      dispatch(
        addToCart({
          id: Number(product.id),
          name: product.name,
          price: product.price,
          image: product.image,
          quantity: 1,
        })
      )

    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }
  const handleWishlist = async (productId: number) => {
    dispatch(toggleWishlist(productId));
    if (!user?.id) {
      alert("Login first");
      return;
    }

    const res = await fetch("/api/wishlist", {
      method: "POST",
      body: JSON.stringify({
        userId: user.id,
        productId,
      }),
    });

    const data = await res.json();

    if (data.added) {
      toast.success("Added to wishlist ❤️");

    } else {
      toast.error("Removed from wishlist ❌");
    }
  };
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
             <Button
                variant="ghost"
                size="icon"
                onClick={() => handleWishlist(Number(product.id))}
                className="relative cursor-pointer"
              >
                
                <Heart className={`h-5 w-5 ${ wishlistIds.length > 0 ? "text-red-500 fill-red-500" : "" }`} />

              </Button>
          </CardFooter>
        </Card>
      )}
    </>
  );
}