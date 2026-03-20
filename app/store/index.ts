import { configureStore, combineReducers } from "@reduxjs/toolkit"
import cartReducer from "./cartSlice"
import authReducer from "./authSlice"

import storage from "redux-persist/lib/storage"
import { persistReducer, persistStore } from "redux-persist"
import wishlistReducer from "./wishlistSlice"

const rootReducer = combineReducers({
  cart: cartReducer,
  wishlist: wishlistReducer,
  auth: authReducer,
})

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["cart", "wishlist"],
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
})

export const persistor = persistStore(store)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch