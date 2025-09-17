import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface ProductState {
  selectedCategory: string | null;
  selectedProductId: string | null;
}

const initialState: ProductState = {
  selectedCategory: null,
  selectedProductId: null,
};

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setCategory: (state, action: PayloadAction<string | null>) => {
      state.selectedCategory = action.payload;
    },
    openProductModal: (state, action: PayloadAction<string>) => {
      state.selectedProductId = action.payload;
    },
    closeProductModal: (state) => {
      state.selectedProductId = null;
    },
  },
});

export const { setCategory, openProductModal, closeProductModal } = productsSlice.actions;

export default productsSlice.reducer;
