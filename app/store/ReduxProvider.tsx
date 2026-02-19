"use client";

import { Provider } from "react-redux";
import { store } from "./store";
import { setUser } from "./authSlice";
import { User } from "@/types/auth";
import { useEffect } from "react";
import { AuthProvider } from "./AuthProvider";

export default function ReduxProvider({
  children,
  initialUser,
}: {
  children: React.ReactNode;
  initialUser: User | null;
}) {
  useEffect(() => {
    store.dispatch(setUser(initialUser));
  }, [initialUser]);

  return <Provider store={store}><AuthProvider>{children}</AuthProvider></Provider>;
}