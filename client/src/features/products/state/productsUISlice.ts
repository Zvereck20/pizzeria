import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface ProductsUIState {
  selectedProductId: string | null;
  isProductModalOpen: boolean;
}

const initialState: ProductsUIState = {
  selectedProductId: null,
  isProductModalOpen: false,
};

const productsUISlice = createSlice({
  name: "productsUI",
  initialState,
  reducers: {
    openProductModal: (state, action: PayloadAction<string>) => {
      state.selectedProductId = action.payload;
      state.isProductModalOpen = true;
    },
    closeProductModal: (state) => {
      state.selectedProductId = null;
      state.isProductModalOpen = false;
    },
  },
});

export const { openProductModal, closeProductModal } = productsUISlice.actions;

export default productsUISlice.reducer;
