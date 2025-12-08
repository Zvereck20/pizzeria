import { createSlice } from "@reduxjs/toolkit";
import { Banner } from "./bannersApi";
import type { PayloadAction } from "@reduxjs/toolkit";

type State = Banner[];

const initialState: State = [];

const bannersSlice = createSlice({
  name: "banners",
  initialState,
  reducers: {
    setBanners: (state, action: PayloadAction<Banner[]>) => {
      //   console.log(action, "action");

      return action.payload;
    },
    // upsertBanners: (state, action: PayloadAction<Banner{}>) => {
    //     state = [
    //         ...state,
    //         ...action.payload
    //     ]
    // }
  },
});

export const { setBanners } = bannersSlice.actions;
export default bannersSlice.reducer;
