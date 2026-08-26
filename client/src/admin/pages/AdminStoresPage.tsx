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
import { useGetAdminStoresQuery } from "@/features/stores";

export const AdminStoresPage: FC = () => {
  const [search, setSearch] = useState("");
  const { data: stores = [], isLoading, isError } = useGetAdminStoresQuery();

  const filteredStores = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return stores.filter((store) =>
      `${store.name} ${store.address}`.toLowerCase().includes(normalizedSearch),
    );
  }, [search, stores]);

  return (
    <Stack spacing={3}>
      <AdminPageHeader title="Stores" createPath="/admin/stores/new" />

      <Paper sx={{ p: 2 }}>
        <TextField
          label="Search by store name or address"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          fullWidth
        />
      </Paper>

      <AdminPageState
        isLoading={isLoading}
        isError={isError}
        isEmpty={filteredStores.length === 0}
        loadingText="Loading stores..."
        errorText="Failed to load stores"
        emptyText="No stores found"
      />

      {!isLoading && !isError && filteredStores.length > 0 && (
        <Paper>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Address</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Active</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredStores.map((store) => (
                <TableRow key={store._id}>
                  <TableCell>
                    <Link component={RouterLink} to={`/admin/stores/${store._id}`} underline="hover">
                      {store.name}
                    </Link>
                  </TableCell>
                  <TableCell>{store.address}</TableCell>
                  <TableCell>{store.phone}</TableCell>
                  <TableCell>{store.isActive ? "Yes" : "No"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      )}
    </Stack>
  );
};
