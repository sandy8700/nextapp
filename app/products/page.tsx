"use client"
import { ProductCard } from "@/components/product-card";
import { ItemActions, ItemContent, ItemTitle } from "@/components/ui/item";
import { Product } from "@/types/products";
import { ChevronRightIcon } from "lucide-react";
import { useEffect, useState } from "react";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  useEffect(() => {
    const list = async () => {
      const res = await fetch("/api/products");
      const data = await res.json();
      setProducts(data)
    }
    const loadCategories = async () => {
      try {
        const res = await fetch("/api/categories");

        if (!res.ok) {
          console.error("API error");
          return;
        }

        const data = await res.json();

        setCategories(data);

      } catch (error) {
        console.error("Category load error:", error);
      }
    };

    loadCategories();
    void list()

  }, [])

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Products</h1>
      <div className="grid gap-6 grid-cols-6">
        <div>
          <div className="mb-4">
            <h2 className="text-md font-semibold mb-4">Categories</h2>
            <div>
              {categories.map(category => (
                <a href={`/products/?category=${category.id}`} key={category.id} className="capitalize flex items-center justify-between rounded-md p-2 hover:bg-muted transition ">
                  <ItemContent>
                    <ItemTitle>{category.name}</ItemTitle>
                  </ItemContent>
                  <ItemActions>
                    <ChevronRightIcon className="size-4" />
                  </ItemActions>
                </a>
              ))}
            </div>

          </div>
        </div>
        <div className="col-span-5">
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
      </div>
    </div>
  );
}