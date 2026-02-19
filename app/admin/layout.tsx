import type { Metadata } from "next";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import ClientLayout from "../ClientLayout";
import { getServerUser } from "../helper/auth";

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
