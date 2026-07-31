import { useEffect, useMemo, useState, type FC, type ReactNode } from "react";
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useParams } from "react-router-dom";
import {
  useGetOrderByIdQuery,
  useUpdateOrderStatusMutation,
  type Order,
  type OrderAddress,
} from "@/features/orders";
import { useGetIngredientsQuery } from "@/features/ingredients";
import { useGetStoresQuery } from "@/features/stores";
import { AdminPageHeader } from "@/admin/ui/common/AdminPageHeader";

const orderStatuses: Order["status"][] = [
  "pending",
  "confirmed",
  "delivering",
  "done",
  "canceled",
];

interface DetailRowProps {
  label: string;
  value?: ReactNode;
}

const DetailRow: FC<DetailRowProps> = ({ label, value }) => (
  <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
    <Typography color="text.secondary" sx={{ minWidth: 180 }}>
      {label}
    </Typography>
    <Typography>{value || "-"}</Typography>
  </Stack>
);

const formatAddress = (address?: OrderAddress) => {
  if (!address) {
    return "";
  }

  return [
    address.city,
    address.street,
    address.building,
    address.appartment,
    address.entrance,
    address.floor,
    address.comment,
  ]
    .filter(Boolean)
    .join(", ");
};

const formatDateTime = (value?: string | null) => {
  if (!value) {
    return "";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("ru-RU", {
    timeZone: "Asia/Vladivostok",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

export const AdminOrderDetailsPage: FC = () => {
  const { id } = useParams();
  const {
    data: order,
    isLoading,
    isError,
  } = useGetOrderByIdQuery(id || "", {
    skip: !id,
  });
  const { data: ingredients = [] } = useGetIngredientsQuery();
  const { data: stores = [] } = useGetStoresQuery();
  const [updateOrderStatus, { isLoading: isUpdating }] =
    useUpdateOrderStatusMutation();
  const [status, setStatus] = useState<Order["status"]>("pending");

  useEffect(() => {
    if (order) {
      setStatus(order.status);
    }
  }, [order]);

  const address = useMemo(() => formatAddress(order?.address), [order?.address]);
  const storeAddress = useMemo(
    () => stores.find((store) => store._id === order?.store)?.address || order?.store,
    [order?.store, stores],
  );
  const ingredientNamesById = useMemo(
    () =>
      ingredients.reduce<Record<string, string>>((namesById, ingredient) => {
        namesById[ingredient._id] = ingredient.name;

        return namesById;
      }, {}),
    [ingredients],
  );

  const getIngredientNames = (ingredientIds?: string[]) => {
    if (!ingredientIds?.length) {
      return "-";
    }

    return ingredientIds
      .map((ingredientId) => ingredientNamesById[ingredientId] || ingredientId)
      .join(", ");
  };

  const handleSaveStatus = async () => {
    if (!id) {
      return;
    }

    try {
      await updateOrderStatus({ id, status }).unwrap();
    } catch (error: unknown) {
      console.error("Order status update error:", error);
    }
  };

  if (!id) {
    return <Typography color="error">Order id is missing</Typography>;
  }

  if (isLoading) {
    return <Typography>Loading order...</Typography>;
  }

  if (isError || !order) {
    return <Typography color="error">Failed to load order</Typography>;
  }

  return (
    <Stack spacing={3}>
      <AdminPageHeader title={`Order ${order.number}`} />

      <Paper sx={{ p: 3 }}>
        <Stack spacing={2}>
          <DetailRow label="Number" value={order.number} />
          <DetailRow label="Customer name" value={order.customer.fullName} />
          <DetailRow label="Phone" value={order.customer.phone} />
          <DetailRow label="Total price" value={order.totalPrice} />
          <DetailRow label="Order type" value={order.orderDetails.orderType} />
          <DetailRow
            label="Payment method"
            value={order.orderDetails.paymentMethod}
          />
          <DetailRow label="Persons" value={order.orderDetails.persons} />
          <DetailRow
            label="Scheduled time"
            value={formatDateTime(order.orderDetails.scheduledTime)}
          />
          <DetailRow label="Comment" value={order.orderDetails.comment} />
          <DetailRow label="Address" value={address} />
          <DetailRow label="Store" value={storeAddress} />
          <DetailRow label="Created at" value={formatDateTime(order.createdAt)} />
          <DetailRow label="Updated at" value={formatDateTime(order.updatedAt)} />
        </Stack>
      </Paper>

      <Paper sx={{ p: 3 }}>
        <Stack spacing={2} alignItems="flex-start">
          <FormControl sx={{ minWidth: 220 }}>
            <InputLabel id="order-status-label">Status</InputLabel>
            <Select
              labelId="order-status-label"
              label="Status"
              value={status}
              onChange={(event) => setStatus(event.target.value as Order["status"])}
            >
              {orderStatuses.map((orderStatus) => (
                <MenuItem key={orderStatus} value={orderStatus}>
                  {orderStatus}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button
            variant="contained"
            disabled={isUpdating || status === order.status}
            onClick={handleSaveStatus}
          >
            {isUpdating ? "Saving..." : "Save status"}
          </Button>
        </Stack>
      </Paper>

      <Paper>
        <Table sx={{ tableLayout: "fixed" }}>
          <TableHead>
            <TableRow>
              <TableCell>Item</TableCell>
              <TableCell>Ingredients</TableCell>
              <TableCell align="right">Quantity</TableCell>
              <TableCell align="right">Unit price</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {order.items.map((item, index) => (
              <TableRow key={`${item.productId}-${item.name}-${index}`}>
                <TableCell>{item.name}</TableCell>
                <TableCell>{getIngredientNames(item.ingredients)}</TableCell>
                <TableCell align="right">{item.quantity}</TableCell>
                <TableCell align="right">{item.unitPrice}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Stack>
  );
};
