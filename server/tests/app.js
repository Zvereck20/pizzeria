import { vi } from "vitest";

process.env.NODE_ENV = "test";
process.env.MONGO_URI_TEST = "mongodb://mongo:27017/pizza-db-test";
process.env.SESSION_SECRET = "integration-test-session-secret";
process.env.CLIENT_ORIGIN = "http://localhost:5173";
process.env.ADMIN_LOGIN = "test-admin";
process.env.ADMIN_PASSWORD = "test-admin-password";
process.env.MANAGER_LOGIN = "test-manager";
process.env.MANAGER_PASSWORD = "test-manager-password";

vi.mock("../utils/mail.js", () => ({
  sendOrderNotification: vi.fn().mockResolvedValue(undefined),
  sendVacancyNotification: vi.fn().mockResolvedValue(undefined),
}));

const appModule = await import("../app.js");

export const { MONGO_URI, sessionStore } = appModule;
export default appModule.default;
