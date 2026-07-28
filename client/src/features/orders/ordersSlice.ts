import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { Order } from "./ordersTypes";

const initialState: Partial<Order> = {};

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    setOrder: (state, action: PayloadAction<Order>) => {
      return action.payload;
    },
  },
});

export const { setOrder } = orderSlice.actions;
export default orderSlice.reducer;
