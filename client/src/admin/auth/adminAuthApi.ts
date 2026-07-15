import { api } from "@/app/api";

export interface AdminLoginRequest {
  login: string;
  password: string;
}

export interface AdminLoginResponse {
  role: string;
}

export interface AdminUser {
  login: string;
  role: string;
}

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
