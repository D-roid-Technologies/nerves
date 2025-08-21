// store/productsSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ListedItem } from "../configuration/auth.service";

interface ProductsState {
    listedItems: ListedItem[];
}

const initialState: ProductsState = {
    listedItems: [],
};

export const productsSlice = createSlice({
    name: "products",
    initialState,
    reducers: {
        setListedItems: (state, action: PayloadAction<ListedItem[]>) => {
            state.listedItems = action.payload;
        },
        addListedItem: (state, action: PayloadAction<ListedItem>) => {
            state.listedItems.push(action.payload);
        },
    },
});

export const { setListedItems, addListedItem } = productsSlice.actions;
export default productsSlice.reducer;
