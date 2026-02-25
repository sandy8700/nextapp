"use client";

import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { setUser } from "@/app/store/authSlice";
import { Button } from "./ui/button";

export default function LogoutButton() {
  const dispatch = useDispatch();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      if (!res.ok) throw new Error();

      dispatch(setUser(null)); // ✅ clear redux
      toast.success("Logged out successfully");

      router.push("/"); // redirect home
      router.refresh(); // sync server

    } catch {
      toast.error("Logout failed");
    }
  };

  return (
    <Button
      type="button"
      onClick={handleLogout}
      className="px-2 text-left w-full"
      variant="ghost"
    >
      Logout
    </Button>
  );
}