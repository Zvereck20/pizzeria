import { api } from "./api";

interface Email {
  to: string;
  subject: string;
  message: string;
}

const emailApi = api.injectEndpoints({
  endpoints: (build) => ({
    sendOrderEmail: build.mutation<void, Email>({
      query: (body) => ({
        url: "/mail-sender/order",
        method: "POST",
        body,
      }),
    }),
    sendVacancyEmail: build.mutation<void, Email>({
      query: (body) => ({
        url: "/mail-sender/vacancy",
        method: "POST",
        body,
      }),
    }),
  }),
  overrideExisting: false,
});

export const { useSendOrderEmailMutation, useSendVacancyEmailMutation } = emailApi;
