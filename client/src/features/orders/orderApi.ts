import { api } from "../../app/api";

export interface OrderItem {
  productId: string;
  name: string;
  quantity: number;
  unitPrice: number;
}

export interface OrderCustomer {
  fullName: string;
  phone: string;
}

export interface OrderAddress {
  street: string;
  building: string;
  appartment: string;
  entrance: string;
  floor: string;
}

export interface Order {
  _id: string;
  items: OrderItem[];
  totalPrice: number;
  status: "pending" | "confirmed" | "delivering" | "done" | "canceled";
  customer: OrderCustomer;
  orderType: "delivery" | "pickup";
  address: OrderAddress;
  storeId: string;
  createdAt: Date;
  updatedAt: Date;
}

const ordersApi = api.injectEndpoints({
  endpoints: (build) => ({
    getOrders: build.query<Order[], void>({
      query: () => "/orders",
    }),
    getOrderById: build.query<Order, string>({
      query: (id) => `/orders/${id}`,
    }),
  }),
  overrideExisting: false,
});

export const { useGetOrdersQuery, useGetOrderByIdQuery } = ordersApi;
