export type AdminRole = "admin" | "manager";

export interface AdminLoginRequest {
  login: string;
  password: string;
}

export interface AdminLoginResponse {
  role: AdminRole;
}

export interface AdminUser {
  login: string;
  role: AdminRole;
}
