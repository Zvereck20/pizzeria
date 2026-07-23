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
import { useGetStoresQuery } from "@/features/stores";

export const AdminStoresPage: FC = () => {
  const [search, setSearch] = useState("");
  const { data: stores = [], isLoading, isError } = useGetStoresQuery();

  const filteredStores = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return stores.filter((store) =>
      `${store.name} ${store.address}`.toLowerCase().includes(normalizedSearch),
    );
  }, [search, stores]);

  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
        <Typography component="h1" variant="h4">
          Stores
        </Typography>
        <Button component={RouterLink} to="/admin/stores/new" variant="contained">
          +
        </Button>
      </Stack>

      <Paper sx={{ p: 2 }}>
        <TextField
          label="Search by store name or address"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          fullWidth
        />
      </Paper>

      {isLoading && <Typography>Loading stores...</Typography>}
      {isError && <Typography color="error">Failed to load stores</Typography>}

      {!isLoading && !isError && filteredStores.length === 0 && (
        <Typography color="text.secondary">No stores found</Typography>
      )}

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
