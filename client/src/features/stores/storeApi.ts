import { api } from "../../app/api";
import type { DeleteStoreResponse, Store, StoreRequest, UpdateStoreRequest } from "./types";

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
