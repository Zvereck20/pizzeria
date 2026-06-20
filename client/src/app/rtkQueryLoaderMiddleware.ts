import { isFulfilled, isPending, isRejected, Middleware } from "@reduxjs/toolkit";
import { start, stop } from "./asyncSlice";

export const rtkQueryLoaderMiddleware: Middleware = (store) => (next) => (action) => {
  if (isPending(action) && action.type.startsWith("api/")) {
    store.dispatch(start());
  }

  if ((isFulfilled(action) || isRejected(action)) && action.type.startsWith("api/")) {
    store.dispatch(stop());
  }

  return next(action);
};
