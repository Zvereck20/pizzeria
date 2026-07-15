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
import { useGetIngredientsQuery } from "@/features/ingredients";

export const AdminIngredientsPage: FC = () => {
  const [search, setSearch] = useState("");
  const { data: ingredients = [], isLoading, isError } = useGetIngredientsQuery();

  const filteredIngredients = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return ingredients.filter((ingredient) =>
      ingredient.name.toLowerCase().includes(normalizedSearch),
    );
  }, [ingredients, search]);

  return (
    <Stack spacing={3}>
      <Stack
        direction="row"
        spacing={2}
        alignItems="center"
        justifyContent="space-between"
      >
        <Typography component="h1" variant="h4">
          Ingredients
        </Typography>
        <Button component={RouterLink} to="/admin/ingredients/new" variant="contained">
          +
        </Button>
      </Stack>

      <Paper sx={{ p: 2 }}>
        <TextField
          label="Search by ingredient name"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          fullWidth
        />
      </Paper>

      {isLoading && <Typography>Loading ingredients...</Typography>}
      {isError && <Typography color="error">Failed to load ingredients</Typography>}

      {!isLoading && !isError && filteredIngredients.length === 0 && (
        <Typography color="text.secondary">No ingredients found</Typography>
      )}

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
