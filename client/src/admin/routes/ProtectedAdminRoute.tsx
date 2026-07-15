import type { FC } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { Box, CircularProgress, Typography } from "@mui/material";
import { useGetAdminMeQuery } from "@/admin/auth";

export const ProtectedAdminRoute: FC = () => {
  const location = useLocation();
  const { data: admin, isLoading, isError } = useGetAdminMeQuery();

  if (isLoading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box sx={{ textAlign: "center" }}>
          <CircularProgress />
          <Typography sx={{ mt: 2 }}>Checking admin session...</Typography>
        </Box>
      </Box>
    );
  }

  if (isError || !admin) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};
