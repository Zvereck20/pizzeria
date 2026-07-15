import { useState, type FC } from "react";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { useNavigate, useParams } from "react-router-dom";
import { Stack, Typography } from "@mui/material";
import { AdminConfirmDialog } from "@/admin/ui/common/AdminConfirmDialog";
import { IngredientDetailsForm } from "@/admin/ui/ingredient/IngredientDetailsForm";
import {
  buildIngredientFormData,
  type IngredientFormValues,
} from "@/admin/utils";
import {
  useCreateIngredientMutation,
  useDeleteIngredientMutation,
  useGetIngredientByIdQuery,
  useUpdateIngredientMutation,
} from "@/features/ingredients";

interface ApiErrorData {
  message?: string;
}

const getImageErrorMessage = (error: unknown) => {
  const queryError = error as FetchBaseQueryError;
  const data = queryError.data as ApiErrorData | undefined;

  return data?.message || "";
};

export const AdminIngredientDetailsPage: FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const isCreateMode = id === "new";
  const ingredientId = isCreateMode ? undefined : id;

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [imageErrorMessage, setImageErrorMessage] = useState("");

  const {
    data: ingredient,
    isLoading,
    isError,
  } = useGetIngredientByIdQuery(ingredientId || "", {
    skip: !ingredientId,
  });

  const [createIngredient, { isLoading: isCreating }] =
    useCreateIngredientMutation();
  const [updateIngredient, { isLoading: isUpdating }] =
    useUpdateIngredientMutation();
  const [deleteIngredient, { isLoading: isDeleting }] =
    useDeleteIngredientMutation();

  const isSaving = isCreating || isUpdating;

  const handleSubmit = async (
    values: IngredientFormValues,
    image: File | null,
  ) => {
    const body = buildIngredientFormData({ values, image });
    setImageErrorMessage("");

    try {
      if (isCreateMode) {
        const response = await createIngredient(body).unwrap();
        navigate(`/admin/ingredients/${response._id}`);
        return;
      }

      if (!ingredientId) {
        return;
      }

      await updateIngredient({ id: ingredientId, body }).unwrap();
    } catch (error: unknown) {
      setImageErrorMessage(getImageErrorMessage(error));
      console.error("Ingredient save error:", error);
    }
  };

  const handleDeleteIngredient = async () => {
    if (!ingredientId) {
      return;
    }

    try {
      await deleteIngredient(ingredientId).unwrap();
      navigate("/admin/ingredients");
    } catch (error: unknown) {
      console.error("Ingredient delete error:", error);
    }
  };

  if (!id) {
    return <Typography color="error">Ingredient id is missing</Typography>;
  }

  if (isLoading) {
    return <Typography>Loading ingredient...</Typography>;
  }

  if (isError || (!isCreateMode && !ingredient)) {
    return <Typography color="error">Failed to load ingredient</Typography>;
  }

  return (
    <Stack spacing={3}>
      <Typography component="h1" variant="h4">
        {isCreateMode ? "Create ingredient" : ingredient?.name}
      </Typography>

      <IngredientDetailsForm
        ingredient={ingredient}
        isCreateMode={isCreateMode}
        isSaving={isSaving}
        isDeleting={isDeleting}
        imageErrorMessage={imageErrorMessage}
        onSubmit={handleSubmit}
        onImageChange={() => setImageErrorMessage("")}
        onDeleteClick={() => setIsDeleteDialogOpen(true)}
      />

      {!isCreateMode && (
        <AdminConfirmDialog
          open={isDeleteDialogOpen}
          title="Delete ingredient?"
          description="This action cannot be undone."
          confirmText="Delete"
          isLoading={isDeleting}
          onClose={() => setIsDeleteDialogOpen(false)}
          onConfirm={handleDeleteIngredient}
        />
      )}
    </Stack>
  );
};
