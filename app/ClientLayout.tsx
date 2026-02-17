"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/header";
import { AuthProvider } from "./context/AuthContext";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const hideHeader =
    pathname.startsWith("/auth/login") ||
    pathname.startsWith("/auth/register") ||
    pathname.startsWith("/auth/forgot-password");
    pathname.startsWith("/auth/reset-password");

  return (
    <AuthProvider>
      {!hideHeader && <Header />}
      {children}
    </AuthProvider>
  );
}