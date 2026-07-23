import { useEffect, type FC } from "react";
import { Controller, useForm, type SubmitHandler } from "react-hook-form";
import { Checkbox, FormControlLabel, Paper, Stack, TextField } from "@mui/material";
import { AdminFormActions } from "@/admin/ui/common";
import { textValidation } from "@/admin/utils";
import type { Vacancy, VacancyRequest } from "@/features/vacancies";

interface VacancyDetailsFormProps {
  vacancy?: Vacancy;
  isCreateMode: boolean;
  isSaving: boolean;
  isDeleting: boolean;
  onSubmit: (values: VacancyRequest) => void;
  onDeleteClick: () => void;
}

const defaultValues: VacancyRequest = {
  name: "",
  description: "",
  isActive: true,
};

const getVacancyFormValues = (vacancy?: Vacancy): VacancyRequest =>
  vacancy
    ? {
        name: vacancy.name,
        description: vacancy.description,
        isActive: vacancy.isActive,
      }
    : defaultValues;

export const VacancyDetailsForm: FC<VacancyDetailsFormProps> = ({
  vacancy,
  isCreateMode,
  isSaving,
  isDeleting,
  onSubmit,
  onDeleteClick,
}) => {
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<VacancyRequest>({ mode: "onChange", defaultValues });

  useEffect(() => {
    reset(getVacancyFormValues(vacancy));
  }, [vacancy, reset]);

  const handleFormSubmit: SubmitHandler<VacancyRequest> = (values) => onSubmit(values);

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
        <TextField
          label="Description"
          error={Boolean(errors.description)}
          helperText={errors.description?.message}
          minRows={4}
          multiline
          fullWidth
          {...register("description", {
            required: "Field is required",
            minLength: { value: 10, message: "Minimum 10 characters" },
          })}
        />
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
        <AdminFormActions
          isCreateMode={isCreateMode}
          isSaving={isSaving}
          isDeleting={isDeleting}
          isSubmitDisabled={isSaving || !isValid}
          onDeleteClick={onDeleteClick}
        />
      </Stack>
    </Paper>
  );
};
