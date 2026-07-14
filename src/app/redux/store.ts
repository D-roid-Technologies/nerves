import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slice/user";
import cartReducer from "./slice/cart";
import { productsSlice } from "./slice/products";
import { locationSlice } from "./slice/location";
import notificationReducer from "./slice/notification";
import paidOrdersReducer from "./slice/paidOrders";
import salesReducer from "./slice/sales";
import reviewReducer from "./slice/reviewSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    cart: cartReducer,
    products: productsSlice.reducer,
    location: locationSlice.reducer,
    notification: notificationReducer,
    paidOrders: paidOrdersReducer,
    sales: salesReducer,
    reviews: reviewReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
