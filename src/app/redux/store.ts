import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slice/user";
import cartReducer from "./slice/cart";
import { productsSlice } from "./slice/products";
import { locationSlice } from "./slice/location";

export const store = configureStore({
  reducer: {
    user: userReducer,
    cart: cartReducer,
    products: productsSlice.reducer,
    location: locationSlice.reducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
