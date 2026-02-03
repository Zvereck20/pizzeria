import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { api } from "./api";

import productsUIReducer from "../features/products/state/productsUISlice";
import productsDataReducer from "../features/products/state/productsDataSlice";
import ingredientsReducer from "../features/ingredients/ingredientsSlice";
// import bannersReducer from "../features/banners/bannersSlice";

export const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
    productsUI: productsUIReducer,
    productsData: productsDataReducer,
    ingredients: ingredientsReducer,
    // banners: bannersReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(api.middleware),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
