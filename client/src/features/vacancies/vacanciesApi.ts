import { api } from "@/app/api";

export interface Vacancy {
  _id: string;
  name: string;
  description: string;
  isActive: boolean;
}

export interface VacancyRequest {
  name: string;
  description: string;
  isActive: boolean;
}

export interface UpdateVacancyRequest {
  id: string;
  body: Partial<VacancyRequest>;
}

export interface DeleteVacancyResponse {
  message: string;
}

const vacanciesApi = api.injectEndpoints({
  endpoints: (build) => ({
    getVacancies: build.query<Vacancy[], void>({
      query: () => "/vacancies",
      providesTags: ["Vacancies"],
    }),
    getVacancyById: build.query<Vacancy, string>({
      query: (id) => `/vacancies/${id}`,
      providesTags: ["Vacancies"],
    }),
    createVacancy: build.mutation<Vacancy, VacancyRequest>({
      query: (body) => ({
        url: "/admin/vacancies",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Vacancies"],
    }),
    updateVacancy: build.mutation<Vacancy, UpdateVacancyRequest>({
      query: ({ id, body }) => ({
        url: `/admin/vacancies/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Vacancies"],
    }),
    deleteVacancy: build.mutation<DeleteVacancyResponse, string>({
      query: (id) => ({
        url: `/admin/vacancies/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Vacancies"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetVacanciesQuery,
  useGetVacancyByIdQuery,
  useCreateVacancyMutation,
  useUpdateVacancyMutation,
  useDeleteVacancyMutation,
} = vacanciesApi;
