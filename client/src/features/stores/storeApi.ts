import { api } from "../../app/api";

export interface Store {
  _id: string;
  name: string;
  address: string;
  isActive: Boolean;
}

const storeApi = api.injectEndpoints({
  endpoints: (build) => ({
    getStores: build.query<Store[], void>({
      query: () => "/stores",
    }),
    getStoreById: build.query<Store, string>({
      query: (id) => `/stores/${id}`,
    }),
  }),
  overrideExisting: false,
});

export const { useGetStoresQuery, useGetStoreByIdQuery } = storeApi;
