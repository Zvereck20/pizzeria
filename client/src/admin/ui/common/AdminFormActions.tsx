import type { FC } from "react";
import { Button, Stack } from "@mui/material";

interface AdminFormActionsProps {
  isCreateMode: boolean;
  isSaving: boolean;
  isDeleting: boolean;
  isSubmitDisabled: boolean;
  onDeleteClick: () => void;
}

export const AdminFormActions: FC<AdminFormActionsProps> = ({
  isCreateMode,
  isSaving,
  isDeleting,
  isSubmitDisabled,
  onDeleteClick,
}) => (
  <Stack direction="row" spacing={2}>
    <Button type="submit" variant="contained" disabled={isSubmitDisabled}>
      {isSaving ? "Saving..." : "Save"}
    </Button>
    {!isCreateMode && (
      <Button
        type="button"
        variant="outlined"
        color="error"
        disabled={isDeleting}
        onClick={onDeleteClick}
      >
        Delete
      </Button>
    )}
  </Stack>
);
