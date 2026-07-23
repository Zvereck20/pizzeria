import { useMemo, useState, type FC } from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  Button,
  Link,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { useGetBannersQuery } from "@/features/banners";

export const AdminBannersPage: FC = () => {
  const [search, setSearch] = useState("");
  const { data: banners = [], isLoading, isError } = useGetBannersQuery();
  const filteredBanners = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return banners.filter((banner) => banner.name.toLowerCase().includes(normalizedSearch));
  }, [banners, search]);

  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
        <Typography component="h1" variant="h4">Banners</Typography>
        <Button component={RouterLink} to="/admin/banners/new" variant="contained">+</Button>
      </Stack>
      <Paper sx={{ p: 2 }}>
        <TextField
          label="Search by banner name"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          fullWidth
        />
      </Paper>
      {isLoading && <Typography>Loading banners...</Typography>}
      {isError && <Typography color="error">Failed to load banners</Typography>}
      {!isLoading && !isError && filteredBanners.length === 0 && (
        <Typography color="text.secondary">No banners found</Typography>
      )}
      {!isLoading && !isError && filteredBanners.length > 0 && (
        <Paper>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Link</TableCell>
                <TableCell>Active</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredBanners.map((banner) => (
                <TableRow key={banner._id}>
                  <TableCell>
                    <Link component={RouterLink} to={`/admin/banners/${banner._id}`} underline="hover">
                      {banner.name}
                    </Link>
                  </TableCell>
                  <TableCell>{banner.link}</TableCell>
                  <TableCell>{banner.isActive ? "Yes" : "No"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      )}
    </Stack>
  );
};
