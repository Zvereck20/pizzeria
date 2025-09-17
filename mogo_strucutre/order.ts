interface Order {
  _id: string;
  items: Array<{
    productId: string;
    name: string;
    quantity: number;
    unitPrice: number;
  }>;
  totalPrice: number;
  status: "pending" | "confirmed" | "delivering" | "done" | "canceled";
  customer: {
    fullName: string;
    phone: string;
  };
  orderType: "delivery" | "pickup";
  address?: {
    street: string;
    building: string;
    appartment?: string;
    entrance?: string;
    floor?: string;
  };
  storeId: string;
  createdAt: Date;
  updatedAt: Date;
}
