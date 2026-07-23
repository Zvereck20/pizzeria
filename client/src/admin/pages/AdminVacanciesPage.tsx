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
import { useGetVacanciesQuery } from "@/features/vacancies";

export const AdminVacanciesPage: FC = () => {
  const [search, setSearch] = useState("");
  const { data: vacancies = [], isLoading, isError } = useGetVacanciesQuery();
  const filteredVacancies = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return vacancies.filter((vacancy) => vacancy.name.toLowerCase().includes(normalizedSearch));
  }, [search, vacancies]);

  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
        <Typography component="h1" variant="h4">Vacancies</Typography>
        <Button component={RouterLink} to="/admin/vacancies/new" variant="contained">+</Button>
      </Stack>
      <Paper sx={{ p: 2 }}>
        <TextField
          label="Search by vacancy name"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          fullWidth
        />
      </Paper>
      {isLoading && <Typography>Loading vacancies...</Typography>}
      {isError && <Typography color="error">Failed to load vacancies</Typography>}
      {!isLoading && !isError && filteredVacancies.length === 0 && (
        <Typography color="text.secondary">No vacancies found</Typography>
      )}
      {!isLoading && !isError && filteredVacancies.length > 0 && (
        <Paper>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Active</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredVacancies.map((vacancy) => (
                <TableRow key={vacancy._id}>
                  <TableCell>
                    <Link component={RouterLink} to={`/admin/vacancies/${vacancy._id}`} underline="hover">
                      {vacancy.name}
                    </Link>
                  </TableCell>
                  <TableCell>{vacancy.description}</TableCell>
                  <TableCell>{vacancy.isActive ? "Yes" : "No"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      )}
    </Stack>
  );
};
