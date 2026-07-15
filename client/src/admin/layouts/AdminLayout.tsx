import type { FC } from "react";
import { Outlet } from "react-router-dom";
import { Box } from "@mui/material";
import { AdminHeader } from "@/admin/components";

export const AdminLayout: FC = () => {
  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f6f7f9" }}>
      <AdminHeader />
      <Box component="main" sx={{ p: 3 }}>
        <Outlet />
      </Box>
    </Box>
  );
};
