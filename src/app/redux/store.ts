import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slice/user";
import cartReducer from "./slice/cart";
import { productsSlice } from "./slice/products";
import { locationSlice } from "./slice/location";
import notificationReducer from "./slice/notification";
import paidOrdersReducer from "./slice/paidOrders";

export const store = configureStore({
  reducer: {
    user: userReducer,
    cart: cartReducer,
    products: productsSlice.reducer,
    location: locationSlice.reducer,
    notification: notificationReducer,
    paidOrders: paidOrdersReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
