---
name: rtk-query-endpoint
description: Use this skill when adding or refactoring Redux Toolkit RTK Query endpoints.
---

When working with RTK Query:

- Use the existing shared createApi.
- Add endpoints through injectEndpoints.
- Do not create duplicate API layers for admin and client.
- Type request and response data with TypeScript interfaces.
- Use query for data fetching.
- Use mutation for create/update/delete/send actions.
- Add providesTags and invalidatesTags when cache invalidation is needed.
- Keep endpoints grouped by entity when possible.
