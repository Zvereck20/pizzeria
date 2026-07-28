import { api } from "@/app/api";
import type { Banner, DeleteBannerResponse, UpdateBannerRequest } from "./types";

const bannersApi = api.injectEndpoints({
  endpoints: (build) => ({
    getBanners: build.query<Banner[], void>({
      query: () => "/banners",
      providesTags: ["Banners"],
    }),
    getBannerById: build.query<Banner, string>({
      query: (id) => `/banners/${id}`,
      providesTags: ["Banners"],
    }),
    createBanner: build.mutation<Banner, FormData>({
      query: (body) => ({
        url: "/admin/banners",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Banners"],
    }),
    updateBanner: build.mutation<Banner, UpdateBannerRequest>({
      query: ({ id, body }) => ({
        url: `/admin/banners/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Banners"],
    }),
    deleteBanner: build.mutation<DeleteBannerResponse, string>({
      query: (id) => ({
        url: `/admin/banners/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Banners"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetBannersQuery,
  useGetBannerByIdQuery,
  useCreateBannerMutation,
  useUpdateBannerMutation,
  useDeleteBannerMutation,
} = bannersApi;
