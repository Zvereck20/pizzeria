import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { Order } from "./ordersTypes";

interface OrderState {
  current: Order | null;
}

const initialState: OrderState = {
  current: null,
};

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    setOrder: (state, action: PayloadAction<Order>) => {
      state.current = action.payload;
    },
  },
});

export const { setOrder } = orderSlice.actions;
export default orderSlice.reducer;
