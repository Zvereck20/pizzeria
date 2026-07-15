import { useEffect, useState, type FC } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { Box, Button, Link, Stack, SvgIcon, Typography } from "@mui/material";
import { useGetAdminMeQuery } from "@/admin/auth";

interface AdminNavItem {
  path: string;
  label: string;
}

const navItems: AdminNavItem[] = [
  { path: "/admin/products", label: "Products" },
  { path: "/admin/ingredients", label: "Ingredients" },
  { path: "/admin/orders", label: "Orders" },
  { path: "/admin/stores", label: "Stores" },
  { path: "/admin/banners", label: "Banners" },
  { path: "/admin/vacancies", label: "Vacancies" },
];

const UserIcon: FC = () => {
  return (
    <SvgIcon fontSize="small" viewBox="0 0 24 24">
      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4Zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4Z" />
    </SvgIcon>
  );
};

export const AdminHeader: FC = () => {
  const [currentTime, setCurrentTime] = useState(() => new Date());
  const { data: admin } = useGetAdminMeQuery();
  const navigate = useNavigate();
  const login = admin?.login || "menedger";

  useEffect(() => {
    const timerId = window.setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => {
      window.clearInterval(timerId);
    };
  }, []);

  return (
    <Box
      component="header"
      sx={{
        display: "grid",
        gridTemplateColumns: "minmax(140px, 1fr) auto minmax(140px, 1fr)",
        alignItems: "center",
        gap: 2,
        px: 3,
        py: 2,
        borderBottom: "1px solid",
        borderColor: "divider",
        bgcolor: "background.paper",
      }}
    >
      <Stack direction="row" spacing={2} alignItems="center">
        <Typography variant="body2" color="text.secondary">
          {currentTime.toLocaleTimeString()}
        </Typography>
      </Stack>

      <Stack
        component="nav"
        direction="row"
        spacing={2}
        flexWrap="wrap"
        justifyContent="center"
      >
        {navItems.map((item) => (
          <Link
            key={item.path}
            component={RouterLink}
            to={item.path}
            underline="hover"
            color="text.primary"
            sx={{ fontSize: 14, fontWeight: 500 }}
          >
            {item.label}
          </Link>
        ))}
      </Stack>

      <Stack direction="row" spacing={1} alignItems="center" justifyContent="flex-end">
        <UserIcon />
        <Typography variant="body2" fontWeight={500}>
          {login}
        </Typography>
      </Stack>
    </Box>
  );
};
