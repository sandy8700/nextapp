import { ProductCard } from "@/components/product-card";

const products = [
  {
    id: "1",
    name: "Wireless Headphones",
    price: 2999,
    image: "https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b",
    category: "Electronics",
  },
  {
    id: "2",
    name: "Smart Watch",
    price: 4999,
    image: "https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b",
    category: "Wearables",
  },
  {
    id: "3",
    name: "Running Shoes",
    price: 1999,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff",
    category: "Fashion",
  },
];

export default function ProductsPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Products</h1>

      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
}