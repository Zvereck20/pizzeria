mkdir -p .agents/skills/admin-frontend-crud

## cat > .agents/skills/admin-frontend-crud/SKILL.md <<'EOF'

name: admin-frontend-crud
description: Use this skill when creating or refactoring the Pizzeria admin frontend: login, admin layout, MUI pages, forms, filters, CRUD tables, FormData mutations, and RTK Query integration.

---

When working on the admin frontend for the Pizzeria project:

## Project location

- Admin frontend code should live inside `client/src/admin`.
- Reuse existing entity code from `client/src/features`.
- Do not create a separate admin app unless explicitly requested.
- Do not create a separate RTK Query API layer for admin.

## Stack

- React
- TypeScript
- MUI
- Redux Toolkit
- RTK Query
- react-hook-form
- SCSS only where custom styling is needed

## General rules

- Keep the solution simple and practical.
- Prefer reusable admin components, but do not over-abstract too early.
- Prefer `interface` over `type` unless there is a clear reason.
- Do not use `any` when a normal interface can be described.
- Do not add new libraries unless explicitly requested.
- Do not use CSS-in-JS outside standard MUI component props and `sx`.
- Do not use `module.scss`.
- Explain larger structural changes before making them.

## Admin API rules

- Use the existing shared RTK Query `api` from `client/src/app/api.ts`.
- Add or reuse endpoints through `api.injectEndpoints`.
- Use `query` for get requests.
- Use `mutation` for create, update, delete, login, and other write actions.
- Use existing entity API files when possible, for example:
  - `client/src/features/products/productsApi.ts`
  - `client/src/features/ingredients/ingredientsApi.ts`
- Do not duplicate entity types in admin if they already exist in `features`.
- Use `providesTags` and `invalidatesTags` when cache invalidation is needed.
- Keep `credentials: "include"` behavior for session cookie requests.
- Do not change API `baseUrl` strategy unless the task explicitly asks for it.

## Forms

- Use `react-hook-form` for admin forms.
- Many entities may include image upload, so create/update requests should support `FormData`.
- Validate form data at the form level before building `FormData`.
- Keep form validation simple and readable.
- Do not add a new validation library.
- If an entity has image/file upload, send multipart data through `FormData`.
- Keep file fields optional on update unless the backend requires otherwise.
- Prefer reusable form helpers only when duplication becomes obvious.

## MUI UI rules

- Use MUI components for admin UI.
- Since MUI DataGrid is not installed, do not use DataGrid.
- Use standard MUI components such as:
  - `Box`
  - `Stack`
  - `Paper`
  - `Typography`
  - `Button`
  - `TextField`
  - `Select`
  - `MenuItem`
  - `Checkbox`
  - `Dialog`
  - `Table`
  - `TableHead`
  - `TableBody`
  - `TableRow`
  - `TableCell`
  - `TablePagination`
- Prefer simple reusable components:
  - `AdminLayout`
  - `AdminSidebar`
  - `AdminHeader`
  - `AdminPageHeader`
  - `AdminTable`
  - `AdminFormDialog`
  - `AdminConfirmDialog`
  - `AdminFilters`
- Do not build a universal CRUD framework before at least 2-3 admin pages reveal real repeated patterns.

## Filters

- For products, ingredients, and orders, prefer frontend filtering when the full list is already loaded and cached by RTK Query.
- Do not add backend filtering just to filter data that is already available on the frontend.
- Keep filters local to the page unless URL query params are explicitly requested.
- Do not create Redux slices only for temporary filter state unless there is a clear reason.
- Use local state for search, category, store, status, price, and similar filters by default.
- Keep filter logic readable and close to the page or extract a small utility when duplicated.

## Admin auth

- First admin task is login.
- Admin auth uses backend session and httpOnly cookie.
- Login should call an admin auth mutation.
- Do not store sensitive tokens in localStorage.
- Use session cookie flow with `credentials: "include"`.
- Implement protected admin routes only after login/check-session endpoints are confirmed.
- If session check endpoint is missing, identify it as a backend dependency instead of inventing frontend-only security.

## CRUD pages

When creating an admin CRUD page:

1. Reuse entity API hooks from `features`.
2. Fetch list with RTK Query.
3. Store filters locally.
4. Render data with MUI Table, not DataGrid.
5. Use Dialog for create/edit form unless a full page form is requested.
6. Use ConfirmDialog for delete.
7. Use mutations for create/update/delete.
8. Show loading and error states.
9. Invalidate tags after mutations.
10. Keep code split into page + small reusable components.

## First implementation priority

Start with:

1. Admin login page.
2. Admin layout.
3. Protected admin routing.
4. Products CRUD.
5. Ingredients CRUD.
6. Stores CRUD.
7. Orders management.

Do not start with a large generic CRUD abstraction.
Build reusable components gradually after the first real pages.

## When using Codex

Before editing multiple files:

- Inspect existing structure.
- Identify which files will be changed.
- Explain the minimal plan.
- Do not change frontend API architecture unless explicitly requested.
- Show the diff after edits.
- Run or suggest relevant checks:
  - `docker compose exec client npm run build`
  - `docker compose logs client`
  - `docker compose logs server`

If Codex is unavailable, provide a manual fallback using bash, GitHub, and explicit file edits.
EOF
