"use client";
import { ProductCard } from "@/components/product-card";
import { Product } from "@/types/products";
import { useEffect, useState } from "react";

export default function Page() {

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
    <div className="container mx-auto px-4 py-10">
      
      <h1 className="text-2xl font-bold mb-6">Products</h1>

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
  );
}
