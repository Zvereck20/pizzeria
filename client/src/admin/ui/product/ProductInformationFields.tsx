import type { FC } from "react";
import { Stack } from "@mui/material";
import type { FieldErrors, UseFormRegister } from "react-hook-form";
import { AdminNumberField } from "@/admin/ui/common";
import { numericValidation, type ProductFormValues } from "@/admin/utils";

interface ProductInformationFieldsProps {
  errors: FieldErrors<ProductFormValues>;
  register: UseFormRegister<ProductFormValues>;
}

export const ProductInformationFields: FC<ProductInformationFieldsProps> = ({
  errors,
  register,
}) => (
  <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
    <AdminNumberField
      label="Weight"
      error={Boolean(errors.information?.weight)}
      helperText={errors.information?.weight?.message}
      {...register("information.weight", numericValidation)}
    />
    <AdminNumberField
      label="Energy"
      error={Boolean(errors.information?.energy)}
      helperText={errors.information?.energy?.message}
      {...register("information.energy", numericValidation)}
    />
    <AdminNumberField
      label="Proteins"
      error={Boolean(errors.information?.proteins)}
      helperText={errors.information?.proteins?.message}
      {...register("information.proteins", numericValidation)}
    />
    <AdminNumberField
      label="Fats"
      error={Boolean(errors.information?.fats)}
      helperText={errors.information?.fats?.message}
      {...register("information.fats", numericValidation)}
    />
    <AdminNumberField
      label="Carbohydrates"
      error={Boolean(errors.information?.carbohydrates)}
      helperText={errors.information?.carbohydrates?.message}
      {...register("information.carbohydrates", numericValidation)}
    />
  </Stack>
);
