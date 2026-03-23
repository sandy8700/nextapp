export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
}

export type CartApiResponse = {
    id: number
    userId: string
    productId: number
    price: number
    quantity: number
    product?: {
        id: number
        name: string
        image?: string
    }
}
export type Order = {
  id: number;
  total: number;
  createdAt: string;
  items: {
    id: number;
    quantity: number;
    price: number;
    product: {
      name: string;
      image?: string;
    };
  }[];
};

export type WishlistItem = {
  id: string;
  product: {
    id: string;
    image?: string;
    name: string;
    price: number;
  };
};
