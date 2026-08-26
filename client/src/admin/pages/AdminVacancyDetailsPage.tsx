import { useState, type FC } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Stack, Typography } from "@mui/material";
import { AdminConfirmDialog } from "@/admin/ui/common/AdminConfirmDialog";
import { AdminPageHeader } from "@/admin/ui/common/AdminPageHeader";
import { VacancyDetailsForm } from "@/admin/ui/vacancy/VacancyDetailsForm";
import {
  useCreateVacancyMutation,
  useDeleteVacancyMutation,
  useGetAdminVacancyByIdQuery,
  useUpdateVacancyMutation,
  type VacancyRequest,
} from "@/features/vacancies";

export const AdminVacancyDetailsPage: FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isCreateMode = id === "new";
  const vacancyId = isCreateMode ? undefined : id;
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const { data: vacancy, isLoading, isError } = useGetAdminVacancyByIdQuery(vacancyId || "", {
    skip: !vacancyId,
  });
  const [createVacancy, { isLoading: isCreating }] = useCreateVacancyMutation();
  const [updateVacancy, { isLoading: isUpdating }] = useUpdateVacancyMutation();
  const [deleteVacancy, { isLoading: isDeleting }] = useDeleteVacancyMutation();

  const handleSubmit = async (values: VacancyRequest) => {
    try {
      if (isCreateMode) {
        const response = await createVacancy(values).unwrap();
        navigate(`/admin/vacancies/${response._id}`);
        return;
      }
      if (vacancyId) await updateVacancy({ id: vacancyId, body: values }).unwrap();
    } catch (error) {
      console.error("Vacancy save error:", error);
    }
  };

  const handleDeleteVacancy = async () => {
    if (!vacancyId) return;
    try {
      await deleteVacancy(vacancyId).unwrap();
      navigate("/admin/vacancies");
    } catch (error) {
      console.error("Vacancy delete error:", error);
    }
  };

  if (!id) return <Typography color="error">Vacancy id is missing</Typography>;
  if (isLoading) return <Typography>Loading vacancy...</Typography>;
  if (isError || (!isCreateMode && !vacancy)) {
    return <Typography color="error">Failed to load vacancy</Typography>;
  }

  return (
    <Stack spacing={3}>
      <AdminPageHeader title={isCreateMode ? "Create vacancy" : vacancy?.name} />
      <VacancyDetailsForm
        vacancy={vacancy}
        isCreateMode={isCreateMode}
        isSaving={isCreating || isUpdating}
        isDeleting={isDeleting}
        onSubmit={handleSubmit}
        onDeleteClick={() => setIsDeleteDialogOpen(true)}
      />
      {!isCreateMode && (
        <AdminConfirmDialog
          open={isDeleteDialogOpen}
          title="Delete vacancy?"
          description="This action cannot be undone."
          confirmText="Delete"
          isLoading={isDeleting}
          onClose={() => setIsDeleteDialogOpen(false)}
          onConfirm={handleDeleteVacancy}
        />
      )}
    </Stack>
  );
};
