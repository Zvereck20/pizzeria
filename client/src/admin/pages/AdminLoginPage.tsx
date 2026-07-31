import { useState, type FC } from "react";
import { useNavigate } from "react-router-dom";
import { useForm, type SubmitHandler } from "react-hook-form";
import { Box, Button, Paper, Stack, TextField, Typography } from "@mui/material";
import { useAdminLoginMutation, type AdminLoginRequest } from "@/admin/auth";

export const AdminLoginPage: FC = () => {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");
  const [adminLogin, { isLoading }] = useAdminLoginMutation();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AdminLoginRequest>({
    defaultValues: {
      login: "",
      password: "",
    },
  });

  const onSubmit: SubmitHandler<AdminLoginRequest> = async (values) => {
    setErrorMessage("");

    try {
      await adminLogin(values).unwrap();
      reset();
      navigate("/admin/products");
    } catch (error: unknown) {
      console.error("Admin login error:", error);
      setErrorMessage("Не верно введенные данные");
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "#f5f5f5",
        px: 2,
      }}
    >
      <Paper
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        elevation={3}
        sx={{ width: "100%", maxWidth: 420, p: 4 }}
      >
        <Stack spacing={3}>
          <Typography component="h1" variant="h5">
            Войдите в учетную запись
          </Typography>

          <TextField
            label="Login"
            autoComplete="username"
            error={Boolean(errors.login)}
            helperText={errors.login?.message}
            {...register("login", { required: "Login is required" })}
          />

          <TextField
            label="Password"
            type="password"
            autoComplete="current-password"
            error={Boolean(errors.password)}
            helperText={errors.password?.message}
            {...register("password", { required: "Password is required" })}
          />

          <Button type="submit" variant="contained" disabled={isLoading}>
            {isLoading ? "Ожидайте..." : "Вход"}
          </Button>

          {errorMessage && (
            <Typography color="error" variant="body2" textAlign="center">
              {errorMessage}
            </Typography>
          )}
        </Stack>
      </Paper>
    </Box>
  );
};
