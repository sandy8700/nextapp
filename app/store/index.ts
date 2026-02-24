// import { configureStore } from "@reduxjs/toolkit";
// import authReducer from "./authSlice";
// import cartReducer from "./cartSlice";


// export const store = configureStore({
//   reducer: {
//     cart: cartReducer,
//     auth: authReducer,
//   },
// });

// export type RootState = ReturnType<typeof store.getState>;
// export type AppDispatch = typeof store.dispatch;

import { configureStore, combineReducers } from "@reduxjs/toolkit"
import cartReducer from "./cartSlice"
import authReducer from "./authSlice"

import storage from "redux-persist/lib/storage"
import { persistReducer, persistStore } from "redux-persist"

const rootReducer = combineReducers({
  cart: cartReducer,
  auth: authReducer,
})

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["cart"],
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