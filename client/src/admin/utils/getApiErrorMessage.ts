const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

export const getApiErrorMessage = (error: unknown, field?: string) => {
  if (!isRecord(error) || !isRecord(error.data)) {
    return "";
  }

  const { message, field: errorField } = error.data;

  if (typeof message !== "string" || (field && errorField !== field)) {
    return "";
  }

  return message;
};
