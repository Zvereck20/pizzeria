import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export type SortKey = "priceAsc" | "priceDesc" | "nameAsc" | "nameDesc" | "none";

interface ProductsUIState {
  selectedCategory: string | null;
  selectedProductId: string | null;
  search: string;
  sort: SortKey;
  isProductModalOpen: boolean;
}

const initialState: ProductsUIState = {
  selectedCategory: null,
  selectedProductId: null,
  search: "",
  sort: "none",
  isProductModalOpen: false,
};

const productsUISlice = createSlice({
  name: "productsUI",
  initialState,
  reducers: {
    setCategory: (state, action: PayloadAction<string | null>) => {
      state.selectedCategory = action.payload;
    },
    setSearch: (state, action: PayloadAction<string>) => {
      state.search = action.payload;
    },
    setSort: (state, action: PayloadAction<SortKey>) => {
      state.sort = action.payload;
    },
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

export const { setCategory, setSearch, setSort, openProductModal, closeProductModal } = productsUISlice.actions;

export default productsUISlice.reducer;
