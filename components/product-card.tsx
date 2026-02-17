"use client";

import Image from "next/image";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type Product = {
  id: string;
  name: string;
  price: number;
  image: string;
  category?: string;
};

export function ProductCard({ product }: { product: Product }) {
  return (
    <Card className="w-full max-w-sm hover:shadow-lg transition">
      <CardHeader className="p-0">
        <div className="relative h-48 w-full">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover rounded-t-lg"
          />
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

        <p className="text-xl font-semibold">₹ {product.price}</p>
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