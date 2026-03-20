"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store";
import Image from "next/image";
import { WishlistItem } from "@/types/products";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { TrashIcon } from "lucide-react";
import { removeFromWishlist, setWishlist } from "../store/wishlistSlice";



export default function WishlistPage() {
    const dispatch = useDispatch()
    const user = useSelector((state: RootState) => state.auth.user);
    const [items, setItems] = useState<WishlistItem[]>([]);

    useEffect(() => {
        if (!user?.id) return;

        const loadWishlist = async () => {
            const res = await fetch(`/api/wishlist?userId=${user.id}`);
            const data = await res.json();

            setItems(data);

            const ids = data.map((item: WishlistItem) => Number(item.product.id));
            dispatch(setWishlist(ids))
        };

        loadWishlist();
    }, [user?.id]);


    const handleRemove = async (productId: number) => {
        if (!user?.id) return;

        try {
            const res = await fetch(
                `/api/wishlist/${productId}?userId=${user.id}`,
                { method: "DELETE" }
            );

            const data = await res.json();

            if (!res.ok) {
                toast.error(data.error || "Failed to remove");
                return;
            }

            setItems((prev) =>
                prev.filter((item) => Number(item.product.id) !== productId)
            );

            dispatch(removeFromWishlist(productId));

        } catch (error) {
            console.error("Remove error:", error);
        }
    };
    if (!items.length) {
        return <div className="p-10 text-center">No wishlist items</div>;
    }

    return (
        <div className="container mx-auto py-6">
            <h1 className="text-2xl font-bold mb-6">My Wishlist</h1>

            <div className="grid grid-cols-4 gap-4">
                {items.map((item) => (
                    <div key={item.id} className="border p-3 rounded">

                        <Image
                            src={item.product.image || "/placeholder.png"}
                            alt={item.product.name}
                            width={150}
                            height={150}
                        />

                        <h3 className="mt-2 font-medium">
                            {item.product.name}
                        </h3>

                        <p className="text-primary font-semibold">
                            ₹ {item.product.price}
                        </p>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemove(Number(item.product.id))}
                            className="cursor-pointer"
                        >
                            <TrashIcon className="h-5 w-5 text-red-500" />
                        </Button>
                    </div>
                ))}
            </div>
        </div>
    );
}