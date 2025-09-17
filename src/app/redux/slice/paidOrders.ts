import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface PaidOrderItem {
  id: number;
  name: string;
  price: number;
  discountPrice?: number;
  image?: string;
  quantity: number;
  total: number;
}

export interface PaidOrder {
  id: string;
  orderId: string;
  items: PaidOrderItem[];
  shippingDetails: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  paymentDetails: {
    firstName: string;
    lastName: string;
    email: string;
    amount: string;
    reference: string;
    transactionDate: string;
  };
  shippingMethod: string;
  shippingCost: number;
  tax: number;
  subtotal: number;
  total: number;
  status:
    | "paid"
    | "sealed"
    | "dispatched"
    | "arrived"
    | "confirmed"
    | "returned"
    | "reviewed";
  createdAt: string;
  updatedAt: string;
}

interface PaidOrdersState {
  orders: PaidOrder[];
  totalOrders: number;
}

const initialState: PaidOrdersState = {
  orders: [],
  totalOrders: 0,
};

const paidOrdersSlice = createSlice({
  name: "paidOrders",
  initialState,
  reducers: {
    addPaidOrder: (state, action: PayloadAction<PaidOrder>) => {
      state.orders.unshift(action.payload); // Add to beginning for newest first
      state.totalOrders += 1;
    },

    updateOrderStatus: (
      state,
      action: PayloadAction<{ orderId: string; status: PaidOrder["status"] }>
    ) => {
      const { orderId, status } = action.payload;
      const orderIndex = state.orders.findIndex(
        (order) => order.orderId === orderId
      );

      if (orderIndex !== -1) {
        state.orders[orderIndex].status = status;
        state.orders[orderIndex].updatedAt = new Date().toISOString();
      }
    },

    clearPaidOrders: (state) => {
      state.orders = [];
      state.totalOrders = 0;
    },

    removePaidOrder: (state, action: PayloadAction<string>) => {
      const orderId = action.payload;
      state.orders = state.orders.filter((order) => order.orderId !== orderId);
      state.totalOrders = Math.max(0, state.totalOrders - 1);
    },
  },
});

export const {
  addPaidOrder,
  updateOrderStatus,
  clearPaidOrders,
  removePaidOrder,
} = paidOrdersSlice.actions;

export default paidOrdersSlice.reducer;
