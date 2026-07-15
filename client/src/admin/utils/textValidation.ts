export const textValidation = {
  required: "Field is required",
  validate: (value: string) => value.trim().length > 0 || "Field is required",
};
