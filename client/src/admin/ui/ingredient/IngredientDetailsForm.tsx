import { useEffect, useState, type FC } from "react";
import { Controller, useForm, type SubmitHandler } from "react-hook-form";
import { Checkbox, FormControlLabel, Paper, Stack, TextField } from "@mui/material";
import { AdminFormActions, AdminImageUpload, AdminNumberField } from "@/admin/ui/common";
import {
  numericValidation,
  textValidation,
  type IngredientFormValues,
} from "@/admin/utils";
import type { Ingredient } from "@/features/ingredients";

interface IngredientDetailsFormProps {
  ingredient?: Ingredient;
  isCreateMode: boolean;
  isSaving: boolean;
  isDeleting: boolean;
  imageErrorMessage?: string;
  onSubmit: (values: IngredientFormValues, image: File | null) => void;
  onImageChange?: () => void;
  onDeleteClick: () => void;
}

const defaultValues: IngredientFormValues = {
  name: "",
  price: 0,
  available: true,
};

const getIngredientFormValues = (ingredient?: Ingredient): IngredientFormValues => {
  if (!ingredient) {
    return defaultValues;
  }

  return {
    name: ingredient.name,
    price: ingredient.price,
    available: ingredient.available,
  };
};

export const IngredientDetailsForm: FC<IngredientDetailsFormProps> = ({
  ingredient,
  isCreateMode,
  isSaving,
  isDeleting,
  imageErrorMessage,
  onSubmit,
  onImageChange,
  onDeleteClick,
}) => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  const {
    register,
    control,
    handleSubmit,
    reset,
    trigger,
    formState: { errors, isValid },
  } = useForm<IngredientFormValues>({
    mode: "onChange",
    defaultValues,
  });

  useEffect(() => {
    reset(getIngredientFormValues(ingredient));
    setSelectedImage(null);
    void trigger();
  }, [ingredient, reset, trigger]);

  const hasImageError = isCreateMode && !selectedImage;
  const imageHelperText =
    imageErrorMessage || (hasImageError ? "Image is required" : undefined);

  const handleImageChange = (file: File | null) => {
    setSelectedImage(file);
    onImageChange?.();
  };

  const handleFormSubmit: SubmitHandler<IngredientFormValues> = (values) => {
    if (hasImageError) {
      return;
    }

    onSubmit(values, selectedImage);
  };

  return (
    <Paper component="form" onSubmit={handleSubmit(handleFormSubmit)} sx={{ p: 3 }}>
      <Stack spacing={3}>
        <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
          <TextField
            label="Name"
            error={Boolean(errors.name)}
            helperText={errors.name?.message}
            fullWidth
            {...register("name", textValidation)}
          />
          <AdminNumberField
            label="Price"
            error={Boolean(errors.price)}
            helperText={errors.price?.message}
            {...register("price", numericValidation)}
          />
        </Stack>

        <Controller
          control={control}
          name="available"
          render={({ field }) => (
            <FormControlLabel
              control={
                <Checkbox
                  checked={field.value}
                  onChange={(_, checked) => field.onChange(checked)}
                />
              }
              label="Available"
            />
          )}
        />

        <AdminImageUpload
          key={ingredient?._id ?? "new"}
          currentImage={ingredient?.image}
          currentImageAlt={ingredient?.name}
          error={hasImageError || Boolean(imageErrorMessage)}
          helperText={imageHelperText}
          onImageChange={handleImageChange}
        />

        <AdminFormActions
          isCreateMode={isCreateMode}
          isSaving={isSaving}
          isDeleting={isDeleting}
          isSubmitDisabled={isSaving || !isValid || hasImageError}
          onDeleteClick={onDeleteClick}
        />
      </Stack>
    </Paper>
  );
};
