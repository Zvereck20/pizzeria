import { createSlice } from "@reduxjs/toolkit";

interface AsyncState {
  pending: number;
}

const initialState: AsyncState = {
  pending: 0,
};

const asyncSlice = createSlice({
  name: "async",
  initialState,
  reducers: {
    start(state) {
      state.pending += 1;
    },
    stop(state) {
      state.pending = Math.max(0, state.pending - 1);
    },
  },
});

export const { start, stop } = asyncSlice.actions;
export const asyncReducer = asyncSlice.reducer;
