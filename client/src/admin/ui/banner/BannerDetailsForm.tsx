import { useEffect, useState, type FC } from "react";
import { Controller, useForm, type SubmitHandler } from "react-hook-form";
import { Checkbox, FormControlLabel, Paper, Stack, TextField } from "@mui/material";
import { AdminFormActions, AdminImageUpload } from "@/admin/ui/common";
import { textValidation, type BannerFormValues } from "@/admin/utils";
import type { Banner } from "@/features/banners";

interface BannerDetailsFormProps {
  banner?: Banner;
  isCreateMode: boolean;
  isSaving: boolean;
  isDeleting: boolean;
  imageErrorMessage?: string;
  onSubmit: (values: BannerFormValues, image: File | null) => void;
  onImageChange?: () => void;
  onDeleteClick: () => void;
}

const defaultValues: BannerFormValues = {
  name: "",
  link: "",
  isActive: true,
};

const getBannerFormValues = (banner?: Banner): BannerFormValues =>
  banner
    ? { name: banner.name, link: banner.link, isActive: banner.isActive }
    : defaultValues;

export const BannerDetailsForm: FC<BannerDetailsFormProps> = ({
  banner,
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
  } = useForm<BannerFormValues>({ mode: "onChange", defaultValues });

  useEffect(() => {
    reset(getBannerFormValues(banner));
    setSelectedImage(null);
    void trigger();
  }, [banner, reset, trigger]);

  const hasImageError = isCreateMode && !selectedImage;
  const imageHelperText =
    imageErrorMessage || (hasImageError ? "Image is required" : undefined);

  const handleImageChange = (file: File | null) => {
    setSelectedImage(file);
    onImageChange?.();
  };

  const handleFormSubmit: SubmitHandler<BannerFormValues> = (values) => {
    if (!hasImageError) {
      onSubmit(values, selectedImage);
    }
  };

  return (
    <Paper component="form" onSubmit={handleSubmit(handleFormSubmit)} sx={{ p: 3 }}>
      <Stack spacing={3}>
        <TextField
          label="Name"
          error={Boolean(errors.name)}
          helperText={errors.name?.message}
          fullWidth
          {...register("name", textValidation)}
        />
        <TextField label="Link" fullWidth {...register("link")} />
        <Controller
          control={control}
          name="isActive"
          render={({ field }) => (
            <FormControlLabel
              control={
                <Checkbox
                  checked={field.value}
                  onChange={(_, checked) => field.onChange(checked)}
                />
              }
              label="Active"
            />
          )}
        />
        <AdminImageUpload
          key={banner?._id ?? "new"}
          currentImage={banner?.image}
          currentImageAlt={banner?.name}
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
