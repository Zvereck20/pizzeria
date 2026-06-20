import { api } from "../../app/api";

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
  isActive: Boolean;
}

const storeApi = api.injectEndpoints({
  endpoints: (build) => ({
    getStores: build.query<Store[], void>({
      query: () => "/stores",
      keepUnusedDataFor: 86400,
      providesTags: ["Stores"],
    }),
    getStoreById: build.query<Store, string>({
      query: (id) => `/stores/${id}`,
      providesTags: ["Stores"],
    }),
  }),
  overrideExisting: false,
});

export const { useGetStoresQuery, useGetStoreByIdQuery } = storeApi;
