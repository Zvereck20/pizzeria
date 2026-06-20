import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { api } from "./api";

import { rtkQueryLoaderMiddleware } from "./rtkQueryLoaderMiddleware";
import productsUIReducer from "../features/products/state/productsUISlice";
import orderReducer from "../features/orders/ordersSlice";
import { asyncReducer } from "./asyncSlice";

export const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
    productsUI: productsUIReducer,
    order: orderReducer,
    async: asyncReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware).concat(rtkQueryLoaderMiddleware),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
