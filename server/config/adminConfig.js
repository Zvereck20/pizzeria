export const getAdminsConfig = (login, password) => {
  const admin = {
    login: process.env.ADMIN_LOGIN,
    password: process.env.ADMIN_PASSWORD,
    role: "admin",
  };

  const manager = {
    login: process.env.MANAGER_LOGIN,
    password: process.env.MANAGER_PASSWORD,
    role: "manager",
  };

  switch (login) {
    case admin.login:
      if (admin.password === password) {
        return {
          role: admin.role,
          login: admin.login,
        };
      }
      break;

    case manager.login:
      if (manager.password === password) {
        return {
          role: manager.role,
          login: manager.login,
        };
      }
      break;
    default:
      return null;
  }
};
