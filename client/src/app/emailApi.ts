import { api } from "./api";

interface VacancyEmailRequest {
  name: string;
  email: string;
  message: string;
  vacancyName: string;
}

const emailApi = api.injectEndpoints({
  endpoints: (build) => ({
    sendVacancyEmail: build.mutation<void, VacancyEmailRequest>({
      query: (body) => ({
        url: "/mail-sender/vacancy",
        method: "POST",
        body,
      }),
    }),
  }),
  overrideExisting: false,
});

export const { useSendVacancyEmailMutation } = emailApi;
