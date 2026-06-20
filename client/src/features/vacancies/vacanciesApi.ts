import { api } from "@/app/api";

export interface Vacancy {
  _id: string;
  name: string;
  description: string;
  isActive: boolean;
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
  }),
  overrideExisting: false,
});

export const { useGetVacanciesQuery, useGetVacancyByIdQuery } = vacanciesApi;
