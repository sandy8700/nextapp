"use client";

import { useEffect } from "react";
import { toast } from "sonner";
import { LoginForm } from "@/components/login-form";

export default function LoginClient() {

 useEffect(() => {
    const flash = document.cookie
      .split("; ")
      .find((row) => row.startsWith("flash="))
      ?.split("=")[1];

    if (flash === "logout") {
      toast.error("Logged out successfully 👋");

      document.cookie = "flash=; Max-Age=0; path=/";
    }
  }, []);


  return <LoginForm />;
}