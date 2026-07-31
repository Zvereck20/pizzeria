import { useMemo, useState, type FC } from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  Link,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import { AdminPageHeader } from "@/admin/ui/common/AdminPageHeader";
import { AdminPageState } from "@/admin/ui/common/AdminPageState";
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
      <AdminPageHeader title="Banners" createPath="/admin/banners/new" />
      <Paper sx={{ p: 2 }}>
        <TextField
          label="Search by banner name"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          fullWidth
        />
      </Paper>
      <AdminPageState
        isLoading={isLoading}
        isError={isError}
        isEmpty={filteredBanners.length === 0}
        loadingText="Loading banners..."
        errorText="Failed to load banners"
        emptyText="No banners found"
      />
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
