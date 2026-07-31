import type { FC, ReactNode } from "react";
import { Link as RouterLink } from "react-router-dom";
import { Button, Stack, Typography } from "@mui/material";

interface AdminPageHeaderProps {
  title: ReactNode;
  createPath?: string;
}

export const AdminPageHeader: FC<AdminPageHeaderProps> = ({ title, createPath }) => (
  <Stack
    direction="row"
    spacing={2}
    alignItems="center"
    justifyContent="space-between"
  >
    <Typography component="h1" variant="h4">
      {title}
    </Typography>
    {createPath && (
      <Button component={RouterLink} to={createPath} variant="contained">
        +
      </Button>
    )}
  </Stack>
);
