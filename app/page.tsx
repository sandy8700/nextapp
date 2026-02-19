import { ProductCard } from "@/components/product-card";

export default async function Page() {

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
    {
      id: "4",
      name: "Running Shoes",
      price: 1999,
      image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff",
      category: "Fashion",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-6">Products</h1>

      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
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
  );
}
