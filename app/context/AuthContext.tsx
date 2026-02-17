"use client";

import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "sonner";

type User = {
    id: string;
    name: string;
    email: string;
    role: string;
};

type AuthContextType = {
    user: User | null;
    loading: boolean;
    login: (user: User) => void;
    logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [isloggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    function login(user: User) {
        setUser(user);
        setIsLoggedIn(true);
    }
    async function checkAuth() {
        try {
            if (isloggedIn) {
                const res = await fetch("/api/auth/me", {
                    credentials: "include",
                });

                const data = await res.json();

                if (data.loggedIn) setUser(data.user);
            }
            else setUser(null);
        } catch {
            setUser(null);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        checkAuth();
    }, [isloggedIn]);



    async function logout() {
        const res = await fetch("/api/auth/logout", {
            method: "POST",
            credentials: "include",
        });

        if (res.ok) {
            toast.success("Logged out successfully");
            setUser(null);
            setTimeout(() => {
                router.push("/");
                router.refresh();
            }, 800);
        } else {
            toast.error("Logout failed");
        }
    }

    return (
        <AuthContext.Provider value={{ user, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);

    if (!context) throw new Error("useAuth must be used within AuthProvider");

    return context;
}