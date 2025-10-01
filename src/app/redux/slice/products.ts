// store/productsSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { MyItems } from "../configuration/auth.service";

interface ProductsState {
    listedItems: MyItems[];
}

const initialState: ProductsState = {
    listedItems: [],
};

export const productsSlice = createSlice({
    name: "products",
    initialState,
    reducers: {
        setListedItems: (state, action: PayloadAction<MyItems[]>) => {
            state.listedItems = action.payload;
            console.log(state.listedItems)
        },
        addListedItem: (state, action: PayloadAction<MyItems>) => {
            state.listedItems.push(action.payload);
        },
    },
});

export const { setListedItems, addListedItem } = productsSlice.actions;
export default productsSlice.reducer;
