import { api } from "@/app/api";

export interface Banner {
  _id: string;
  name: string;
  image: string;
  link: string;
  isActive: boolean;
}

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
  }),
  overrideExisting: false,
});

export const { useGetBannersQuery, useGetBannerByIdQuery } = bannersApi;
