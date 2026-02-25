"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/header";
import { User } from "@/types/auth";
import ReduxProvider from "./store/ReduxProvider";
import Footer from "@/components/footer";

export default function ClientLayout({ children, user }: { children: React.ReactNode, user: User | null; }) {
  const pathname = usePathname();
  const hiddenRoutes = [
    "/auth/login",
    "/auth/register",
    "/auth/forgot-password",
    "/auth/reset-password",
    "/admin",
  ];

  const hideHeader = hiddenRoutes.some(route =>
    pathname.startsWith(route)
  );
  return (
    <ReduxProvider initialUser={user}>
      {!hideHeader && <Header />}
      {children}
      {!hideHeader && <Footer />}
    </ReduxProvider>
  );
}