import { api } from "@/app/api";
import { Order, OrderRequest } from "./ordersTypes";

const ordersApi = api.injectEndpoints({
  endpoints: (build) => ({
    getOrders: build.query<OrderRequest[], void>({
      query: () => "/orders",
      providesTags: ["Orders"],
    }),
    getOrderById: build.query<OrderRequest, string>({
      query: (id) => `/orders/${id}`,
      providesTags: ["Orders"],
    }),
    createOrder: build.mutation<OrderRequest, Order>({
      query: (body) => ({
        url: "/orders",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Orders"],
    }),
  }),
  overrideExisting: false,
});

export const { useGetOrdersQuery, useGetOrderByIdQuery, useCreateOrderMutation } =
  ordersApi;
