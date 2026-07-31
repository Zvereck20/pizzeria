import { useMemo, useState, type FC } from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  Box,
  Link,
  Paper,
  MenuItem,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { AdminPageHeader } from "@/admin/ui/common/AdminPageHeader";
import { AdminPageState } from "@/admin/ui/common/AdminPageState";
import { useGetProductsQuery, type Product } from "@/features/products";

interface ProductsByCategory {
  category: Product["category"];
  products: Product[];
}

type PriceSort = "standard" | "priceDesc" | "priceAsc";

const sortProductsByPrice = (products: Product[], priceSort: PriceSort) => {
  if (priceSort === "priceDesc") {
    return [...products].sort(
      (firstProduct, secondProduct) => secondProduct.price - firstProduct.price,
    );
  }

  if (priceSort === "priceAsc") {
    return [...products].sort(
      (firstProduct, secondProduct) => firstProduct.price - secondProduct.price,
    );
  }

  return products;
};

export const AdminProductsPage: FC = () => {
  const [search, setSearch] = useState("");
  const [priceSort, setPriceSort] = useState<PriceSort>("standard");
  const { data: products = [], isLoading, isError } = useGetProductsQuery();

  const productsByCategory = useMemo<ProductsByCategory[]>(() => {
    const normalizedSearch = search.trim().toLowerCase();
    const filteredProducts = products.filter((product) => {
      const matchesName = product.name.toLowerCase().includes(normalizedSearch);

      return matchesName;
    });

    const groupedProducts = filteredProducts.reduce<
      Partial<Record<Product["category"], Product[]>>
    >((groups, product) => {
      const category = product.category;

      if (!groups[category]) {
        groups[category] = [];
      }

      groups[category].push(product);

      return groups;
    }, {});

    return (Object.keys(groupedProducts) as Product["category"][]).map((category) => ({
      category,
      products: sortProductsByPrice(groupedProducts[category] ?? [], priceSort),
    }));
  }, [priceSort, products, search]);

  return (
    <Stack spacing={3}>
      <AdminPageHeader title="Products" createPath="/admin/products/new" />

      <Paper sx={{ p: 2 }}>
        <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
          <TextField
            label="Search by product name"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            fullWidth
          />
          <Select
            value={priceSort}
            onChange={(event) => setPriceSort(event.target.value as PriceSort)}
            sx={{ minWidth: 220 }}
          >
            <MenuItem value="standard">Standard</MenuItem>
            <MenuItem value="priceDesc">Price: high to low</MenuItem>
            <MenuItem value="priceAsc">Price: low to high</MenuItem>
          </Select>
        </Stack>
      </Paper>

      <AdminPageState
        isLoading={isLoading}
        isError={isError}
        isEmpty={productsByCategory.length === 0}
        loadingText="Loading products..."
        errorText="Failed to load products"
        emptyText="No products found"
      />

      {productsByCategory.map(({ category, products: categoryProducts }) => (
        <Box key={category}>
          <Typography component="h2" variant="h6" sx={{ mb: 1 }}>
            {category}
          </Typography>
          <Paper>
            <Table sx={{ tableLayout: "fixed" }}>
              <TableHead>
                <TableRow>
                  <TableCell size="medium" sx={{ width: "40%" }}>
                    Name
                  </TableCell>
                  <TableCell size="medium" sx={{ width: "40%" }}>
                    Description
                  </TableCell>
                  <TableCell size="small" align="right" sx={{ width: "20%" }}>
                    Price
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {categoryProducts.map((product) => (
                  <TableRow key={product._id}>
                    <TableCell size="medium" sx={{ width: "40%" }}>
                      <Link
                        component={RouterLink}
                        to={`/admin/products/${product._id}`}
                        underline="hover"
                      >
                        {product.name}
                      </Link>
                    </TableCell>
                    <TableCell size="medium" sx={{ width: "40%" }}>
                      {product.description}
                    </TableCell>
                    <TableCell size="small" align="right" sx={{ width: "20%" }}>
                      {product.price}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        </Box>
      ))}
    </Stack>
  );
};
