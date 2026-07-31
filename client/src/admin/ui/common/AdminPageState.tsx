import type { FC } from "react";
import { Typography } from "@mui/material";

interface AdminPageStateProps {
  isLoading: boolean;
  isError: boolean;
  isEmpty: boolean;
  loadingText: string;
  errorText: string;
  emptyText: string;
}

export const AdminPageState: FC<AdminPageStateProps> = ({
  isLoading,
  isError,
  isEmpty,
  loadingText,
  errorText,
  emptyText,
}) => {
  if (isLoading) {
    return <Typography>{loadingText}</Typography>;
  }

  if (isError) {
    return <Typography color="error">{errorText}</Typography>;
  }

  if (isEmpty) {
    return <Typography color="text.secondary">{emptyText}</Typography>;
  }

  return null;
};
