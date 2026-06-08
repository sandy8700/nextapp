import type { Metadata } from "next";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import ClientLayout from "../ClientLayout";
import { getServerUser } from "../helper/auth";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
    title: "Admin Dashboard",
    description: "To manage products, orders, and users",
};

export default async function AdminLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const user = await getServerUser();
    if (!user) {
        redirect("/auth/login");
    }

    if (user.role !== "ADMIN") {
        redirect("/"); 
    }

    return (
        <>
            <ClientLayout user={user}>
                <TooltipProvider>
                    {children}
                </TooltipProvider>
                <Toaster position="top-right" richColors />
            </ClientLayout>
        </>
    );
}
