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

import { useAuth } from "@/app/context/AuthContext";

export default function Header() {
    const { user, loading, logout } = useAuth();

    if (loading) return null; 
    
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
                        <ShoppingCart className="h-5 w-5" />
                        
                    </Button>

                    {!user ? (
                        <Link href="/auth/login">
                            <Button size="sm">Login</Button>
                        </Link>
                    ) : (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                    <User className="h-5 w-5" />
                                </Button>
                            </DropdownMenuTrigger>

                            <DropdownMenuContent align="end" className="w-40">

                                <DropdownMenuItem asChild>
                                    <Link href="/dashboard">My Account</Link>
                                </DropdownMenuItem>

                                <DropdownMenuItem asChild>
                                    <Link href="/orders">Orders</Link>
                                </DropdownMenuItem>

                                <DropdownMenuItem asChild>
                                    <Link href="/wishlist">Wishlist</Link>
                                </DropdownMenuItem>

                                <DropdownMenuItem asChild>
                                    <button
                                        onClick={logout}
                                        className="text-left w-full"
                                    >
                                        Logout
                                    </button>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
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
        </header>
    );
}