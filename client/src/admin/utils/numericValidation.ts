export const numericValidation = {
  valueAsNumber: true,
  required: "Value is required",
  validate: (value: number) => value > 0 || "Value must be greater than 0",
};
