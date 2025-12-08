import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { Product } from "@/features";

interface ProductsDataState {
  items: Product[];
  byId: Record<string, Product>;
  loadedAt: number | null; // когда загрузили (можно для инвалидации)
}

const initialState: ProductsDataState = {
  items: [],
  byId: {},
  loadedAt: null,
};

const indexById = (list: Product[]) =>
  list.reduce<Record<string, Product>>((acc, p) => {
    acc[p._id] = p;
    return acc;
  }, {});

const productsDataSlice = createSlice({
  name: "productsData",
  initialState,
  reducers: {
    setProducts: (state, action: PayloadAction<Product[]>) => {
      state.items = action.payload;
      state.byId = indexById(action.payload);
      state.loadedAt = Date.now();
    },
    upsertProducts: (state, action: PayloadAction<Product[]>) => {
      // добавление/обновление части списка (например, после правки в админке)
      const incoming = action.payload;
      const map = { ...state.byId };
      for (const p of incoming) {
        map[p._id] = p;
      }
      state.byId = map;
      state.items = Object.values(map);
      state.loadedAt = Date.now();
    },
    removeProduct: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      if (state.byId[id]) {
        delete state.byId[id];
        state.items = state.items.filter((p) => p._id !== id);
      }
    },
  },
});

export const { setProducts, upsertProducts, removeProduct } = productsDataSlice.actions;

export default productsDataSlice.reducer;
