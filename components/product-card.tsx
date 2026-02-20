"use client";

import Image from "next/image";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Product } from "@/types/products";

export function ProductCard({ product }: { product: Product }) {
  return (
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

        <CardTitle className="text-lg">{product.name}</CardTitle>

        <p className="text-muted-foreground text-sm">
          High quality product with modern design.
        </p>

        <p className="text-xl font-semibold"> ₹ {Number(product.price).toLocaleString("en-IN")}</p>
      </CardContent>

      <CardFooter className="flex gap-2">
        <Button className="w-fit">Add to Cart</Button>
        <Button variant="outline" className="w-fit">
          View
        </Button>
      </CardFooter>
    </Card>
  );
}