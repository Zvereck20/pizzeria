import { useMemo, useState, type FC } from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  FormControl,
  InputLabel,
  Link,
  MenuItem,
  Paper,
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
import { useGetOrdersQuery } from "@/features/orders";

const orderStatuses = ["pending", "confirmed", "delivering", "done", "canceled"];
const orderTypes = ["delivery", "pickup"];
const paymentMethods = ["cash", "online", "card"];

export const AdminOrdersPage: FC = () => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [orderTypeFilter, setOrderTypeFilter] = useState("");
  const [paymentMethodFilter, setPaymentMethodFilter] = useState("");
  const { data: orders = [], isLoading, isError } = useGetOrdersQuery();

  const filteredOrders = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return orders.filter((order) => {
      const matchesSearch =
        normalizedSearch.length === 0 ||
        String(order.number).includes(normalizedSearch) ||
        order.customer.phone.toLowerCase().includes(normalizedSearch) ||
        order.customer.fullName.toLowerCase().includes(normalizedSearch);
      const matchesStatus = !statusFilter || order.status === statusFilter;
      const matchesOrderType =
        !orderTypeFilter || order.orderDetails.orderType === orderTypeFilter;
      const matchesPaymentMethod =
        !paymentMethodFilter || order.orderDetails.paymentMethod === paymentMethodFilter;

      return matchesSearch && matchesStatus && matchesOrderType && matchesPaymentMethod;
    });
  }, [orders, orderTypeFilter, paymentMethodFilter, search, statusFilter]);

  return (
    <Stack spacing={3}>
      <Typography component="h1" variant="h4">
        Orders
      </Typography>

      <Paper sx={{ p: 2 }}>
        <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
          <TextField
            label="Search by number, phone, or name"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            fullWidth
          />
          <FormControl sx={{ minWidth: 180 }}>
            <InputLabel id="order-status-filter-label">Status</InputLabel>
            <Select
              labelId="order-status-filter-label"
              label="Status"
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
            >
              <MenuItem value="">All statuses</MenuItem>
              {orderStatuses.map((status) => (
                <MenuItem key={status} value={status}>
                  {status}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl sx={{ minWidth: 180 }}>
            <InputLabel id="order-type-filter-label">Order type</InputLabel>
            <Select
              labelId="order-type-filter-label"
              label="Order type"
              value={orderTypeFilter}
              onChange={(event) => setOrderTypeFilter(event.target.value)}
            >
              <MenuItem value="">All types</MenuItem>
              {orderTypes.map((orderType) => (
                <MenuItem key={orderType} value={orderType}>
                  {orderType}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl sx={{ minWidth: 180 }}>
            <InputLabel id="payment-method-filter-label">Payment</InputLabel>
            <Select
              labelId="payment-method-filter-label"
              label="Payment"
              value={paymentMethodFilter}
              onChange={(event) => setPaymentMethodFilter(event.target.value)}
            >
              <MenuItem value="">All payments</MenuItem>
              {paymentMethods.map((paymentMethod) => (
                <MenuItem key={paymentMethod} value={paymentMethod}>
                  {paymentMethod}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>
      </Paper>

      {isLoading && <Typography>Loading orders...</Typography>}
      {isError && <Typography color="error">Failed to load orders</Typography>}

      {!isLoading && !isError && filteredOrders.length === 0 && (
        <Typography color="text.secondary">No orders found</Typography>
      )}

      {!isLoading && !isError && filteredOrders.length > 0 && (
        <Paper>
          <Table sx={{ tableLayout: "fixed" }}>
            <TableHead>
              <TableRow>
                <TableCell>Phone</TableCell>
                <TableCell>Number</TableCell>
                <TableCell>Customer name</TableCell>
                <TableCell align="right">Total price</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Order type</TableCell>
                <TableCell>Payment method</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredOrders.map((order) => (
                <TableRow key={order._id}>
                  <TableCell>{order.customer.phone}</TableCell>
                  <TableCell>
                    <Link
                      component={RouterLink}
                      to={`/admin/orders/${order._id}`}
                      underline="hover"
                    >
                      {order.number}
                    </Link>
                  </TableCell>
                  <TableCell>{order.customer.fullName}</TableCell>
                  <TableCell align="right">{order.totalPrice}</TableCell>
                  <TableCell>{order.status}</TableCell>
                  <TableCell>{order.orderDetails.orderType}</TableCell>
                  <TableCell>{order.orderDetails.paymentMethod}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      )}
    </Stack>
  );
};
