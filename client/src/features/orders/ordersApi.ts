import { api } from "@/app/api";
import type { CreateOrderRequest, Order, UpdateOrderStatusRequest } from "./ordersTypes";

const ordersApi = api.injectEndpoints({
  endpoints: (build) => ({
    getOrders: build.query<Order[], void>({
      query: () => "/admin/orders",
      providesTags: ["Orders"],
    }),
    getOrderById: build.query<Order, string>({
      query: (id) => `/admin/orders/${id}`,
      providesTags: ["Orders"],
    }),
    createOrder: build.mutation<Order, CreateOrderRequest>({
      query: (body) => ({
        url: "/orders",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Orders"],
    }),
    updateOrderStatus: build.mutation<Order, UpdateOrderStatusRequest>({
      query: ({ id, status }) => ({
        url: `/admin/orders/${id}`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: ["Orders"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetOrdersQuery,
  useGetOrderByIdQuery,
  useCreateOrderMutation,
  useUpdateOrderStatusMutation,
} = ordersApi;
