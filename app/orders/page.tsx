"use client";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import Image from "next/image";
import { Order } from "@/types/products";


export default function OrdersPage() {
  const user = useSelector((state: RootState) => state.auth.user);
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    if (!user?.id) return;

    const loadOrders = async () => {
      try {
        const res = await fetch(`/api/orders?userId=${user.id}`);
        const data = await res.json();

        if (!res.ok) {
          console.error(data.error);
          return;
        }

        setOrders(data);
      } catch (err) {
        console.error(err);
      }
    };

    loadOrders();
  }, [user?.id]);

  if (!orders.length) {
    return (
      <div className="p-10 text-center">
        <h2 className="text-xl font-semibold">No orders found</h2>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">My Orders</h1>

      <div className="space-y-6">
        {orders.map((order) => (
          <div key={order.id} className="border rounded-lg p-4">

            {/* Order Header */}
            <div className="flex justify-between mb-3">
              <div>
                <p className="font-semibold">Order #{order.id}</p>
                <p className="text-sm text-gray-500">
                  {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </div>

              <div className="font-semibold">
                ₹ {order.total.toLocaleString("en-IN")}
              </div>
            </div>

            {/* Items */}
            <div className="space-y-3">
              {order.items.map((item) => (
                <div key={item.id} className="flex gap-3 items-center">
                  <Image
                    src={item.product?.image || "/placeholder.png"}
                    alt={item.product?.name}
                    width={50}
                    height={50}
                    className="rounded"
                  />

                  <div className="flex-1">
                    <p className="text-sm font-medium">
                      {item.product?.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      Qty: {item.quantity}
                    </p>
                  </div>

                  <div className="text-sm font-semibold">
                    ₹ {(item.price * item.quantity).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}