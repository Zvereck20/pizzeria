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
import { useGetAdminVacanciesQuery } from "@/features/vacancies";

export const AdminVacanciesPage: FC = () => {
  const [search, setSearch] = useState("");
  const { data: vacancies = [], isLoading, isError } = useGetAdminVacanciesQuery();
  const filteredVacancies = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return vacancies.filter((vacancy) => vacancy.name.toLowerCase().includes(normalizedSearch));
  }, [search, vacancies]);

  return (
    <Stack spacing={3}>
      <AdminPageHeader title="Vacancies" createPath="/admin/vacancies/new" />
      <Paper sx={{ p: 2 }}>
        <TextField
          label="Search by vacancy name"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          fullWidth
        />
      </Paper>
      <AdminPageState
        isLoading={isLoading}
        isError={isError}
        isEmpty={filteredVacancies.length === 0}
        loadingText="Loading vacancies..."
        errorText="Failed to load vacancies"
        emptyText="No vacancies found"
      />
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
