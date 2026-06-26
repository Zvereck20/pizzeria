---
name: express-admin-route
description: Use this skill when creating or refactoring admin Express routes in the pizzeria backend.
---

When working with backend admin routes:

- Use Express routes.
- Do not introduce controllers or services unless explicitly requested.
- Keep logic in routes or utils.
- Validate request body with Joi.
- Use authMiddleware for protected admin routes.
- Use adminMiddleware when role checking is required.
- Use Multer for file uploads.
- Keep error responses clear and consistent.
- Do not store sessions in memory.
