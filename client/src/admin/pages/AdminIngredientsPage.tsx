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
import { useGetAdminIngredientsQuery } from "@/features/ingredients";

export const AdminIngredientsPage: FC = () => {
  const [search, setSearch] = useState("");
  const { data: ingredients = [], isLoading, isError } = useGetAdminIngredientsQuery();

  const filteredIngredients = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return ingredients.filter((ingredient) =>
      ingredient.name.toLowerCase().includes(normalizedSearch),
    );
  }, [ingredients, search]);

  return (
    <Stack spacing={3}>
      <AdminPageHeader title="Ingredients" createPath="/admin/ingredients/new" />

      <Paper sx={{ p: 2 }}>
        <TextField
          label="Search by ingredient name"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          fullWidth
        />
      </Paper>

      <AdminPageState
        isLoading={isLoading}
        isError={isError}
        isEmpty={filteredIngredients.length === 0}
        loadingText="Loading ingredients..."
        errorText="Failed to load ingredients"
        emptyText="No ingredients found"
      />

      {!isLoading && !isError && filteredIngredients.length > 0 && (
        <Paper>
          <Table sx={{ tableLayout: "fixed" }}>
            <TableHead>
              <TableRow>
                <TableCell size="medium" sx={{ width: "70%" }}>
                  Name
                </TableCell>
                <TableCell size="small" align="right" sx={{ width: "30%" }}>
                  Price
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredIngredients.map((ingredient) => (
                <TableRow key={ingredient._id}>
                  <TableCell size="medium" sx={{ width: "70%" }}>
                    <Link
                      component={RouterLink}
                      to={`/admin/ingredients/${ingredient._id}`}
                      underline="hover"
                    >
                      {ingredient.name}
                    </Link>
                  </TableCell>
                  <TableCell size="small" align="right" sx={{ width: "30%" }}>
                    {ingredient.price}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      )}
    </Stack>
  );
};
