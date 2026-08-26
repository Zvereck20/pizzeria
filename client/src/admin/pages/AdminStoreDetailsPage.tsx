import { useState, type FC, type FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Button,
  FormControlLabel,
  Paper,
  Stack,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import { AdminConfirmDialog } from "@/admin/ui/common/AdminConfirmDialog";
import { AdminPageHeader } from "@/admin/ui/common/AdminPageHeader";
import {
  useCreateStoreMutation,
  useDeleteStoreMutation,
  useGetAdminStoreByIdQuery,
  useUpdateStoreMutation,
  type StoreRequest,
} from "@/features/stores";

export const AdminStoreDetailsPage: FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isCreateMode = id === "new";
  const storeId = isCreateMode ? undefined : id;
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const {
    data: store,
    isLoading,
    isError,
  } = useGetAdminStoreByIdQuery(storeId || "", {
    skip: !storeId,
  });
  const [createStore, { isLoading: isCreating }] = useCreateStoreMutation();
  const [updateStore, { isLoading: isUpdating }] = useUpdateStoreMutation();
  const [deleteStore, { isLoading: isDeleting }] = useDeleteStoreMutation();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const body: StoreRequest = {
      name: String(formData.get("name")),
      address: String(formData.get("address")),
      operating_mode: String(formData.get("operating_mode")),
      phone: String(formData.get("phone")),
      menu: String(formData.get("menu")),
      geo: {
        lat: Number(formData.get("lat")),
        lan: Number(formData.get("lan")),
      },
      isActive: formData.get("isActive") === "on",
    };

    try {
      if (isCreateMode) {
        const response = await createStore(body).unwrap();
        navigate(`/admin/stores/${response._id}`);
        return;
      }

      if (storeId) {
        await updateStore({ id: storeId, body }).unwrap();
      }
    } catch (error) {
      console.error("Store save error:", error);
    }
  };

  const handleDelete = async () => {
    if (!storeId) return;

    try {
      await deleteStore(storeId).unwrap();
      navigate("/admin/stores");
    } catch (error) {
      console.error("Store delete error:", error);
    }
  };

  if (!id) return <Typography color="error">Store id is missing</Typography>;
  if (isLoading) return <Typography>Loading store...</Typography>;
  if (isError || (!isCreateMode && !store)) {
    return <Typography color="error">Failed to load store</Typography>;
  }

  return (
    <Stack spacing={3}>
      <AdminPageHeader title={isCreateMode ? "Create store" : store?.name} />

      <Paper component="form" onSubmit={handleSubmit} sx={{ p: 3 }}>
        <Stack spacing={2}>
          <TextField
            label="Name"
            name="name"
            defaultValue={store?.name}
            required
            fullWidth
          />
          <TextField
            label="Address"
            name="address"
            defaultValue={store?.address}
            required
            fullWidth
          />
          <TextField
            label="Operating mode"
            name="operating_mode"
            defaultValue={store?.operating_mode}
            required
            fullWidth
          />
          <TextField
            label="Phone"
            name="phone"
            defaultValue={store?.phone}
            required
            fullWidth
          />
          <TextField
            label="Menu"
            name="menu"
            defaultValue={store?.menu}
            required
            fullWidth
          />
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <TextField
              label="Latitude"
              name="lat"
              type="number"
              inputProps={{ step: "any" }}
              defaultValue={store?.geo.lat}
              required
              fullWidth
            />
            <TextField
              label="Longitude"
              name="lan"
              type="number"
              inputProps={{ step: "any" }}
              defaultValue={store?.geo.lan}
              required
              fullWidth
            />
          </Stack>
          <FormControlLabel
            control={<Switch name="isActive" defaultChecked={store?.isActive ?? true} />}
            label="Active"
          />
          <Stack direction="row" spacing={2}>
            <Button type="submit" variant="contained" disabled={isCreating || isUpdating}>
              Save
            </Button>
            {!isCreateMode && (
              <Button
                color="error"
                disabled={isDeleting}
                onClick={() => setIsDeleteDialogOpen(true)}
              >
                Delete
              </Button>
            )}
          </Stack>
        </Stack>
      </Paper>

      {!isCreateMode && (
        <AdminConfirmDialog
          open={isDeleteDialogOpen}
          title="Delete store?"
          description="This action cannot be undone."
          confirmText="Delete"
          isLoading={isDeleting}
          onClose={() => setIsDeleteDialogOpen(false)}
          onConfirm={handleDelete}
        />
      )}
    </Stack>
  );
};
