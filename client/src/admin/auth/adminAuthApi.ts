import { api } from "@/app/api";
import type { AdminLoginRequest, AdminLoginResponse, AdminUser } from "./types";

const adminAuthApi = api.injectEndpoints({
  endpoints: (build) => ({
    adminLogin: build.mutation<AdminLoginResponse, AdminLoginRequest>({
      query: (body) => ({
        url: "/admin/login",
        method: "POST",
        body,
      }),
    }),
    getAdminMe: build.query<AdminUser, void>({
      query: () => "/admin/login/me",
    }),
  }),
  overrideExisting: false,
});

export const { useAdminLoginMutation, useGetAdminMeQuery } = adminAuthApi;
