import { useEffect, useState, type FC } from "react";
import { Controller, useForm, type SubmitHandler } from "react-hook-form";
import {
  Box,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormHelperText,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { AdminFormActions, AdminImageUpload, AdminNumberField } from "@/admin/ui/common";
import { numericValidation, textValidation, type ProductFormValues } from "@/admin/utils";
import { categoryLabels, type Product } from "@/features/products";
import type { Ingredient } from "@/features";
import { ProductInformationFields } from "./ProductInformationFields";
import { ProductIngredientsEditor } from "./ProductIngredientsEditor";

interface ProductDetailsFormProps {
  product?: Product;
  ingredients: Ingredient[];
  isCreateMode: boolean;
  isSaving: boolean;
  isDeleting: boolean;
  imageErrorMessage?: string;
  onSubmit: (
    values: ProductFormValues,
    ingredientIds: string[],
    image: File | null,
  ) => void;
  onImageChange?: () => void;
  onDeleteClick: () => void;
}

const defaultValues: ProductFormValues = {
  name: "",
  description: "",
  price: 0,
  category: "pizza",
  available: true,
  information: {
    weight: 0,
    energy: 0,
    proteins: 0,
    fats: 0,
    carbohydrates: 0,
  },
};

const getProductFormValues = (product?: Product): ProductFormValues => {
  if (!product) {
    return defaultValues;
  }

  return {
    name: product.name,
    description: product.description,
    price: product.price,
    category: product.category,
    available: product.available,
    information: product.information,
  };
};

export const ProductDetailsForm: FC<ProductDetailsFormProps> = ({
  product,
  ingredients,
  isCreateMode,
  isSaving,
  isDeleting,
  imageErrorMessage,
  onSubmit,
  onImageChange,
  onDeleteClick,
}) => {
  const [selectedIngredientIds, setSelectedIngredientIds] = useState<string[]>([]);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  const {
    register,
    control,
    handleSubmit,
    reset,
    trigger,
    formState: { errors, isValid },
  } = useForm<ProductFormValues>({
    mode: "onChange",
    defaultValues,
  });

  useEffect(() => {
    reset(getProductFormValues(product));
    setSelectedIngredientIds(
      product ? product.ingredients.map((ingredient) => ingredient._id) : [],
    );
    setSelectedImage(null);
    void trigger();
  }, [product, reset, trigger]);

  const hasIngredientError = selectedIngredientIds.length === 0;
  const hasImageError = isCreateMode && !selectedImage;
  const imageHelperText =
    imageErrorMessage || (hasImageError ? "Image is required" : undefined);

  const handleImageChange = (file: File | null) => {
    setSelectedImage(file);
    onImageChange?.();
  };

  const handleFormSubmit: SubmitHandler<ProductFormValues> = (values) => {
    if (hasIngredientError || hasImageError) {
      return;
    }

    onSubmit(values, selectedIngredientIds, selectedImage);
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
          <Controller
            control={control}
            name="category"
            rules={textValidation}
            render={({ field }) => (
              <FormControl error={Boolean(errors.category)} sx={{ minWidth: 180 }}>
                <InputLabel id="product-category-label">Category</InputLabel>
                <Select {...field} labelId="product-category-label" label="Category">
                  {categoryLabels.map((category) => (
                    <MenuItem key={category.id} value={category.id}>
                      {category.label}
                    </MenuItem>
                  ))}
                </Select>
                {errors.category?.message && (
                  <FormHelperText>{errors.category.message}</FormHelperText>
                )}
              </FormControl>
            )}
          />
        </Stack>

        <TextField
          label="Description"
          multiline
          minRows={3}
          error={Boolean(errors.description)}
          helperText={errors.description?.message}
          fullWidth
          {...register("description", textValidation)}
        />

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
          key={product?._id ?? "new"}
          currentImage={product?.image}
          currentImageAlt={product?.name}
          error={hasImageError || Boolean(imageErrorMessage)}
          helperText={imageHelperText}
          onImageChange={handleImageChange}
        />

        <Box>
          <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
            Information
          </Typography>
          <ProductInformationFields errors={errors} register={register} />
        </Box>

        <ProductIngredientsEditor
          ingredients={ingredients}
          selectedIngredientIds={selectedIngredientIds}
          hasError={hasIngredientError}
          onSelectedIngredientIdsChange={setSelectedIngredientIds}
        />

        <AdminFormActions
          isCreateMode={isCreateMode}
          isSaving={isSaving}
          isDeleting={isDeleting}
          isSubmitDisabled={isSaving || !isValid || hasIngredientError || hasImageError}
          onDeleteClick={onDeleteClick}
        />
      </Stack>
    </Paper>
  );
};
