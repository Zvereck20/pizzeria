import { useState, type FC } from "react";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { useNavigate, useParams } from "react-router-dom";
import { Stack, Typography } from "@mui/material";
import { AdminConfirmDialog } from "@/admin/ui/common/AdminConfirmDialog";
import { BannerDetailsForm } from "@/admin/ui/banner/BannerDetailsForm";
import { buildBannerFormData, type BannerFormValues } from "@/admin/utils";
import {
  useCreateBannerMutation,
  useDeleteBannerMutation,
  useGetBannerByIdQuery,
  useUpdateBannerMutation,
} from "@/features/banners";

interface ApiErrorData { message?: string; }

const getImageErrorMessage = (error: unknown) => {
  const queryError = error as FetchBaseQueryError;
  const data = queryError.data as ApiErrorData | undefined;

  return data?.message || "";
};

export const AdminBannerDetailsPage: FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isCreateMode = id === "new";
  const bannerId = isCreateMode ? undefined : id;
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [imageErrorMessage, setImageErrorMessage] = useState("");
  const { data: banner, isLoading, isError } = useGetBannerByIdQuery(bannerId || "", {
    skip: !bannerId,
  });
  const [createBanner, { isLoading: isCreating }] = useCreateBannerMutation();
  const [updateBanner, { isLoading: isUpdating }] = useUpdateBannerMutation();
  const [deleteBanner, { isLoading: isDeleting }] = useDeleteBannerMutation();

  const handleSubmit = async (values: BannerFormValues, image: File | null) => {
    const body = buildBannerFormData({ values, image });
    setImageErrorMessage("");
    try {
      if (isCreateMode) {
        const response = await createBanner(body).unwrap();
        navigate(`/admin/banners/${response._id}`);
        return;
      }
      if (bannerId) await updateBanner({ id: bannerId, body }).unwrap();
    } catch (error: unknown) {
      setImageErrorMessage(getImageErrorMessage(error));
      console.error("Banner save error:", error);
    }
  };

  const handleDeleteBanner = async () => {
    if (!bannerId) return;
    try {
      await deleteBanner(bannerId).unwrap();
      navigate("/admin/banners");
    } catch (error) {
      console.error("Banner delete error:", error);
    }
  };

  if (!id) return <Typography color="error">Banner id is missing</Typography>;
  if (isLoading) return <Typography>Loading banner...</Typography>;
  if (isError || (!isCreateMode && !banner)) {
    return <Typography color="error">Failed to load banner</Typography>;
  }

  return (
    <Stack spacing={3}>
      <Typography component="h1" variant="h4">
        {isCreateMode ? "Create banner" : banner?.name}
      </Typography>
      <BannerDetailsForm
        banner={banner}
        isCreateMode={isCreateMode}
        isSaving={isCreating || isUpdating}
        isDeleting={isDeleting}
        imageErrorMessage={imageErrorMessage}
        onSubmit={handleSubmit}
        onImageChange={() => setImageErrorMessage("")}
        onDeleteClick={() => setIsDeleteDialogOpen(true)}
      />
      {!isCreateMode && (
        <AdminConfirmDialog
          open={isDeleteDialogOpen}
          title="Delete banner?"
          description="This action cannot be undone."
          confirmText="Delete"
          isLoading={isDeleting}
          onClose={() => setIsDeleteDialogOpen(false)}
          onConfirm={handleDeleteBanner}
        />
      )}
    </Stack>
  );
};
