export interface OrderItem {
  productId: string;
  ingredients?: string[];
  name: string;
  quantity: number;
  unitPrice: number;
}

export interface CreateOrderItemRequest {
  productId: string;
  ingredients?: string[];
  quantity: number;
}

interface OrderDetails {
  orderType: "delivery" | "pickup";
  scheduledTime?: string | null;
  persons: number;
  paymentMethod: "cash" | "online" | "card";
  comment?: string | null;
}

interface OrderCustomer {
  fullName: string;
  phone: string;
}

export interface OrderAddress {
  city?: string;
  street?: string;
  building?: string;
  appartment?: string | null;
  entrance?: string | null;
  floor?: string | null;
  comment?: string | null;
}

export interface CreateOrderRequest {
  items: CreateOrderItemRequest[];
  orderDetails: OrderDetails;
  customer: OrderCustomer;
  address?: OrderAddress;
  store: string;
}

export type OrderStatus = "pending" | "confirmed" | "delivering" | "done" | "canceled";

export interface Order extends Omit<CreateOrderRequest, "items"> {
  _id: string;
  items: OrderItem[];
  totalPrice: number;
  status: OrderStatus;
  number: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface UpdateOrderStatusRequest {
  id: string;
  status: OrderStatus;
}
