"use client";

import { Provider } from "react-redux";
import { persistor, store } from "./index";
import { setUser } from "./authSlice";
import { User } from "@/types/auth";
import { useEffect } from "react";
import { AuthProvider } from "./AuthProvider";
import { PersistGate } from "redux-persist/lib/integration/react";

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

  return <Provider store={store}>
    <AuthProvider>
      <PersistGate loading={null} persistor={persistor}>
        {children}
      </PersistGate>
    </AuthProvider>
  </Provider>;
}