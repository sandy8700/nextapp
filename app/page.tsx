"use client";
import { ProductCard } from "@/components/product-card";
import { Button } from "@/components/ui/button";
import { Product } from "@/types/products";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Page() {
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])

  useEffect(() => {
    const list = async () => {
      const res = await fetch("/api/products");
      const data = await res.json();
      setProducts(data)
    }
    void list()
  }, [])


  return (
    <>
      <section className="bg-gray-100 py-12 banner relative h-[400px] flex items-center">
        <div className="container mx-auto px-4 relative z-10">
          <h1 className="text-3xl font-bold mb-4">Welcome to Our Store</h1>
          <p className="text-gray-700 text-lg mb-6">
            Discover our wide range of products and find the perfect items for you.
          </p>
          <Button variant="outline" onClick={() => router.push("/products")} className="w-fit px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 hover:text-white transition cursor-pointer">
            Browse Products <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </section>
      <div className="container mx-auto px-4 py-10">

        <h1 className="text-2xl font-bold mb-6">Latest Products</h1>

        {products.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            No products found
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
