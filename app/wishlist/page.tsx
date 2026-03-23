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
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"


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

    const confirmRemove = (onConfirm: () => void) => {
        toast("Remove item?", {
            description: "Are you sure you want to remove this item?",
            action: {
                label: "Yes",
                onClick: onConfirm,
            },
            cancel: {
                label: "No",
                onClick: () => { },
            },
        });
    };
    const handleRemove = async (productId: number) => {
        confirmRemove(async () => {
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
        });
    };
    if (!items.length) {
        return <div className="p-10 text-center">No wishlist items</div>;
    }

    return (
        <div className="container mx-auto py-6">
            <h1 className="text-2xl font-bold mb-6">My Wishlist</h1>
            <div className="border rounded-lg">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Image</TableHead>
                            <TableHead>Product Name</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead className="w-20">Action</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {items.map((item) => (
                            <TableRow key={item.id}>
                                <TableCell>
                                    <div className="flex items-center gap-3">
                                        <Image
                                            src={item.product.image || "/placeholder.png"}
                                            alt={item.product.name}
                                            width={60}
                                            height={60}
                                            className="rounded object-cover"
                                        />
                                    </div>
                                </TableCell>
                                <TableCell className="font-medium">{item.product.name}</TableCell>
                                <TableCell className="font-medium">
                                    ₹ {item.product.price}
                                </TableCell>

                                <TableCell>
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        className="text-red-500 hover:bg-red-100 hover:text-red-600 rounded-circle"
                                        onClick={() => handleRemove(Number(item.product.id))}
                                    >
                                        <TrashIcon className="h-5 w-5 text-red-500" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

        </div>
    );
}