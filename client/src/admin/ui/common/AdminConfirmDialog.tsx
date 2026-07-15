import type { FC } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";

interface AdminConfirmDialogProps {
  open: boolean;
  title: string;
  description: string;
  confirmText: string;
  isLoading?: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const AdminConfirmDialog: FC<AdminConfirmDialogProps> = ({
  open,
  title,
  description,
  confirmText,
  isLoading = false,
  onClose,
  onConfirm,
}) => (
  <Dialog open={open} onClose={onClose}>
    <DialogTitle>{title}</DialogTitle>
    <DialogContent>
      <DialogContentText>{description}</DialogContentText>
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose}>Cancel</Button>
      <Button color="error" variant="contained" disabled={isLoading} onClick={onConfirm}>
        {confirmText}
      </Button>
    </DialogActions>
  </Dialog>
);
