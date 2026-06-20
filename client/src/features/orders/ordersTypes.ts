export interface OrderItem {
  productId: string;
  ingredients?: string[];
  name: string;
  quantity: number;
  unitPrice: number;
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

export interface Order {
  items: OrderItem[];
  totalPrice: number;
  status: "pending" | "confirmed" | "delivering" | "done" | "canceled";
  orderDetails: OrderDetails;
  customer: OrderCustomer;
  address?: OrderAddress;
  store: string;
}

// export type OrderRequest = Omit<Order, "_id">;
export interface OrderRequest extends Order {
  number: number;
}
