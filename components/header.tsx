"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Sheet,
    SheetContent,
    SheetTrigger,
} from "@/components/ui/sheet";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
    ShoppingCart,
    Heart,
    User,
    Menu,
    Search,
} from "lucide-react";

import { usePathname } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/app/store";
import LogoutButton from "./logout";
import { CartItem } from "@/app/store/cartSlice";

export default function Header() {
    const items = useSelector((state: RootState) => state.cart.items) ?? []

    const total = items.reduce(
        (sum: number, item: CartItem) => sum + item.quantity, 0)

    const pathname = usePathname();
    const user = useSelector((state: RootState) => state.auth.user);
    const isLoggedIn = !!user;

    const navLinks = [
        { name: "Home", href: "/" },
        { name: "Products", href: "/products" },
    ];
    return (
        <header className="sticky top-0 z-50 w-full border-b bg-white">
            <div className="container flex h-16 items-center justify-between gap-4 mx-auto">
                <Link href="/" className="text-xl font-bold">
                    ShopKart
                </Link>

                <div className="hidden md:flex flex-1 max-w-xl relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search products..."
                        className="pl-9"
                    />
                </div>

                <div className="flex items-center gap-2">

                    <Button variant="ghost" size="icon">
                        <Heart className="h-5 w-5" />
                    </Button>

                    <Button variant="ghost" size="icon" className="relative">
                        <Link href="/cart">
                            <ShoppingCart className="h-5 w-5" />
                            <span className="absolute -top-2 -right-2 bg-primary text-white text-xs px-1.5 py-0.5 rounded-full">
                                {total}
                            </span>
                        </Link>
                    </Button>

                    {isLoggedIn ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                    <User className="h-5 w-5" />
                                </Button>
                            </DropdownMenuTrigger>

                            <DropdownMenuContent align="end" className="w-40">

                                <DropdownMenuItem asChild>
                                    <Link href="/admin/dashboard">My Account</Link>
                                </DropdownMenuItem>

                                <DropdownMenuItem asChild>
                                    <Link href="/orders">Orders</Link>
                                </DropdownMenuItem>

                                <DropdownMenuItem asChild>
                                    <Link href="/wishlist">Wishlist</Link>
                                </DropdownMenuItem>

                                <DropdownMenuItem asChild>
                                    <LogoutButton />
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <Link href="/auth/login">
                            <Button size="sm">Login</Button>
                        </Link>
                    )}
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon" className="md:hidden">
                                <Menu className="h-5 w-5" />
                            </Button>
                        </SheetTrigger>

                        <SheetContent side="left" className="w-72 space-y-4">

                            <Input placeholder="Search products..." />

                            <nav className="flex flex-col gap-3">
                                <Link href="/category/men">Men</Link>
                                <Link href="/category/women">Women</Link>
                                <Link href="/category/electronics">Electronics</Link>
                                <Link href="/category/offers">Offers</Link>
                            </nav>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
            <div className="border-t">
                <div className="container flex h-9 items-center mx-auto ">
                    <ul className="flex gap-1">
                        {navLinks.map((link) => {
                            const isActive = pathname === link.href;

                            return (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className={`px-3 py-2 ${isActive
                                            ? "bg-primary text-white"
                                            : "text-gray-600 hover:text-black"
                                            }`}
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            </div>
        </header>

    );
}