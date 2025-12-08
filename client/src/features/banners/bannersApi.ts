import { api } from "@/app/api";

export interface Banner {
  _id: string;
  name: string;
  image: string;
  isActive: boolean;
}

const bannersApi = api.injectEndpoints({
  endpoints: (build) => ({
    getBanners: build.query<Banner[], void>({
      query: () => "/banners",
    }),
    getBannerById: build.query<Banner, string>({
      query: (id) => `/banners/${id}`,
    }),
  }),
  overrideExisting: false,
});

export const { useGetBannersQuery, useGetBannerByIdQuery } = bannersApi;
