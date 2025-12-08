import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { Ingredient } from "./ingredientsApi";

interface IngredientsState {
  items: Ingredient[];
}

const initialState: IngredientsState = {
  items: [],
};

const ingredientsSlice = createSlice({
  name: "ingredients",
  initialState,
  reducers: {
    setIngredients: (state, action: PayloadAction<Ingredient[]>) => {
      state.items = action.payload;
    },
    setIngredientAvailability: (state, action: PayloadAction<{ id: string; available: boolean }>) => {
      const item = state.items.find((i) => i._id === action.payload.id);
      if (item) item.available = action.payload.available;
    },
  },
});

export const { setIngredients, setIngredientAvailability } = ingredientsSlice.actions;
export default ingredientsSlice.reducer;
