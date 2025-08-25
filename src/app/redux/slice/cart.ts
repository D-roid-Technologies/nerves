// redux/slice/cart.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Product } from "../../types/product";

interface ExtendedProduct extends Product {
  sellerId: string;
  total: number;
  addedAt: string;
}

interface CartItem {
  product: ExtendedProduct;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
}

const initialState: CartState = {
  items: [],
  isOpen: false,
};

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: {
      reducer(
        state,
        action: PayloadAction<{ product: Product & { sellerId: string }; quantity: number }>
      ) {
        const { product, quantity } = action.payload;
        const existingItem = state.items.find(
          (item) => item.product.id === product.id
        );

        if (existingItem) {
          existingItem.quantity += quantity;
          existingItem.product.total = existingItem.quantity * existingItem.product.price;
        } else {
          state.items.push({
            product: {
              ...product,
              total: product.price * quantity,
              addedAt: new Date().toISOString(),
            },
            quantity,
          });
        }
      },
      prepare(product: Product & { sellerId: string }, quantity: number = 1) {
        return { payload: { product, quantity } };
      },
    },

    removeFromCart(state: CartState, action: PayloadAction<number>) {
      state.items = state.items.filter(
        (item) => item.product.id !== action.payload
      );
    },

    updateQuantity(
      state: CartState,
      action: PayloadAction<{ id: number; quantity: number }>
    ) {
      const item = state.items.find(
        (item) => item.product.id === action.payload.id
      );
      if (item) {
        item.quantity = action.payload.quantity;
        item.product.total = item.quantity * item.product.price;
      }
    },

    clearCart(state: CartState) {
      state.items = [];
    },

    toggleCart(state: CartState) {
      state.isOpen = !state.isOpen;
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  toggleCart,
} = cartSlice.actions;
export default cartSlice.reducer;
