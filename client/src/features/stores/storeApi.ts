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
    createStore: build.mutation<Store, StoreRequest>({
      query: (body) => ({
        url: "/admin/stores",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Stores"],
    }),
    updateStore: build.mutation<Store, UpdateStoreRequest>({
      query: ({ id, body }) => ({
        url: `/admin/stores/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Stores"],
    }),
    deleteStore: build.mutation<DeleteStoreResponse, string>({
      query: (id) => ({
        url: `/admin/stores/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Stores"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetStoresQuery,
  useGetStoreByIdQuery,
  useCreateStoreMutation,
  useUpdateStoreMutation,
  useDeleteStoreMutation,
} = storeApi;
