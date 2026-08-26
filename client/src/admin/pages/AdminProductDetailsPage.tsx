import { useState, type FC } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Stack, Typography } from "@mui/material";
import { AdminConfirmDialog } from "@/admin/ui/common/AdminConfirmDialog";
import { AdminPageHeader } from "@/admin/ui/common/AdminPageHeader";
import { ProductDetailsForm } from "@/admin/ui/product/ProductDetailsForm";
import {
  buildProductFormData,
  type ProductFormValues,
} from "@/admin/utils/buildProductFormData";
import { getApiErrorMessage } from "@/admin/utils/getApiErrorMessage";
import { useGetAdminIngredientsQuery } from "@/features/ingredients";
import {
  useCreateProductMutation,
  useDeleteProductMutation,
  useGetAdminProductByIdQuery,
  useUpdateProductMutation,
} from "@/features/products";

export const AdminProductDetailsPage: FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const isCreateMode = id === "new";
  const productId = isCreateMode ? undefined : id;

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [imageErrorMessage, setImageErrorMessage] = useState("");

  const {
    data: product,
    isLoading: isProductLoading,
    isError: isProductError,
  } = useGetAdminProductByIdQuery(productId || "", {
    skip: !productId,
  });
  const {
    data: ingredients = [],
    isLoading: isIngredientsLoading,
    isError: isIngredientsError,
  } = useGetAdminIngredientsQuery();

  const [createProduct, { isLoading: isCreating }] = useCreateProductMutation();
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();
  const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductMutation();

  const isSaving = isCreating || isUpdating;

  const handleSubmit = async (
    values: ProductFormValues,
    ingredientIds: string[],
    image: File | null,
  ) => {
    const body = buildProductFormData({ values, ingredientIds, image });
    setImageErrorMessage("");

    try {
      if (isCreateMode) {
        const response = await createProduct(body).unwrap();
        navigate(`/admin/products/${response._id}`);
        return;
      }

      if (!productId) {
        return;
      }

      await updateProduct({ id: productId, body }).unwrap();
    } catch (error: unknown) {
      setImageErrorMessage(getApiErrorMessage(error, "image"));
      console.error("Product save error:", error);
    }
  };

  const handleDeleteProduct = async () => {
    if (!productId) {
      return;
    }

    try {
      await deleteProduct(productId).unwrap();

      navigate("/admin/products");
    } catch (error: unknown) {
      console.error("Product delete error:", error);
    }
  };

  if (!id) {
    return <Typography color="error">Product id is missing</Typography>;
  }

  if (isProductLoading || isIngredientsLoading) {
    return <Typography>Loading product...</Typography>;
  }

  if (isProductError || isIngredientsError || (!isCreateMode && !product)) {
    return <Typography color="error">Failed to load product</Typography>;
  }

  return (
    <Stack spacing={3}>
      <AdminPageHeader title={isCreateMode ? "Create product" : product?.name} />

      <ProductDetailsForm
        product={product}
        ingredients={ingredients}
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
          title="Delete product?"
          description="This action cannot be undone."
          confirmText="Delete"
          isLoading={isDeleting}
          onClose={() => setIsDeleteDialogOpen(false)}
          onConfirm={handleDeleteProduct}
        />
      )}
    </Stack>
  );
};
