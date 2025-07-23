import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ShippingInfo {
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone: string;
  email: string;
}

interface PaymentInfo {
  cardNumber: string;
  cardName: string;
  expiryDate: string;
  cvv: string;
}

interface CheckoutState {
  shippingInfo: ShippingInfo | null;
  paymentInfo: PaymentInfo | null;
  orderSubmitted: boolean;
}

const initialState: CheckoutState = {
  shippingInfo: null,
  paymentInfo: null,
  orderSubmitted: false,
};

export const checkoutSlice = createSlice({
  name: "checkout",
  initialState,
  reducers: {
    saveShippingInfo: (state, action: PayloadAction<ShippingInfo>) => {
      state.shippingInfo = action.payload;
    },
    savePaymentInfo: (state, action: PayloadAction<PaymentInfo>) => {
      state.paymentInfo = action.payload;
    },
    submitOrder: (state) => {
      state.orderSubmitted = true;
    },
    resetCheckout: () => initialState,
  },
});

export const { saveShippingInfo, savePaymentInfo, submitOrder, resetCheckout } =
  checkoutSlice.actions;
export default checkoutSlice.reducer;
