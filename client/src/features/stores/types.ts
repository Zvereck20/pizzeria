export interface Store {
  _id: string;
  name: string;
  address: string;
  operating_mode: string;
  phone: string;
  menu: string;
  geo: {
    lat: number;
    lan: number;
  };
  isActive: boolean;
}

export interface StoreRequest {
  name: string;
  address: string;
  operating_mode: string;
  phone: string;
  menu: string;
  geo: {
    lat: number;
    lan: number;
  };
  isActive?: boolean;
}

export interface UpdateStoreRequest {
  id: string;
  body: Partial<StoreRequest>;
}

export interface DeleteStoreResponse {
  message: string;
}
