import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface SaleItem {
  id: string;
  itemId: string;
  title: string;
  price: number;
  quantity: number;
  image?: string;
  category?: string;
  buyerId: string;
  buyerEmail: string;
  sellerId: string;
  sellerEmail: string;
  soldAt: string;
  status: "completed" | "refunded" | "cancelled";
  totalAmount: number;
}

export interface SalesState {
  sales: SaleItem[];
  totalSales: number;
  totalRevenue: number;
}

const initialState: SalesState = {
  sales: [],
  totalSales: 0,
  totalRevenue: 0,
};

const salesSlice = createSlice({
  name: "sales",
  initialState,
  reducers: {
    addSale: (state, action: PayloadAction<SaleItem>) => {
      const existingSaleIndex = state.sales.findIndex(
        (sale) => sale.id === action.payload.id
      );

      if (existingSaleIndex === -1) {
        state.sales.unshift(action.payload);

        if (action.payload.status === "completed") {
          state.totalSales += action.payload.quantity;
          state.totalRevenue += action.payload.totalAmount;
        }
      }
    },

    updateSaleStatus: (
      state,
      action: PayloadAction<{ saleId: string; status: SaleItem["status"] }>
    ) => {
      const { saleId, status } = action.payload;
      const saleIndex = state.sales.findIndex((sale) => sale.id === saleId);

      if (saleIndex !== -1) {
        const previousStatus = state.sales[saleIndex].status;
        state.sales[saleIndex].status = status;

        if (
          previousStatus === "completed" &&
          (status === "refunded" || status === "cancelled")
        ) {
          state.totalSales -= state.sales[saleIndex].quantity;
          state.totalRevenue -= state.sales[saleIndex].totalAmount;
        }

        if (
          (previousStatus === "refunded" || previousStatus === "cancelled") &&
          status === "completed"
        ) {
          state.totalSales += state.sales[saleIndex].quantity;
          state.totalRevenue += state.sales[saleIndex].totalAmount;
        }
      }
    },

    removeSale: (state, action: PayloadAction<string>) => {
      const saleId = action.payload;
      const saleIndex = state.sales.findIndex((sale) => sale.id === saleId);

      if (saleIndex !== -1) {
        const sale = state.sales[saleIndex];
        if (sale.status === "completed") {
          state.totalSales -= sale.quantity;
          state.totalRevenue -= sale.totalAmount;
        }
        state.sales.splice(saleIndex, 1);
      }
    },

    clearSales: (state) => {
      state.sales = [];
      state.totalSales = 0;
      state.totalRevenue = 0;
    },

    setSales: (state, action: PayloadAction<SaleItem[]>) => {
      state.sales = action.payload;
      state.totalSales = action.payload
        .filter((sale) => sale.status === "completed")
        .reduce((total, sale) => total + sale.quantity, 0);
      state.totalRevenue = action.payload
        .filter((sale) => sale.status === "completed")
        .reduce((total, sale) => total + sale.totalAmount, 0);
    },
  },
});

export const { addSale, updateSaleStatus, removeSale, clearSales, setSales } =
  salesSlice.actions;

export default salesSlice.reducer;
