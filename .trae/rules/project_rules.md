Please adapt the globs depending on your project structure.

---
name: project_rules.md
description: Best practices for Next.js applications and routing
globs: **/*.{ts,tsx}
---

- Use the App Router for better performance and organization.
- Implement proper error boundaries to handle errors gracefully.
- Optimize data fetching patterns using React Suspense and SWR.
- Utilize middleware for authentication and authorization.

---
name: typescript-best-practices.mdc 
description: TypeScript coding standards and type safety guidelines
globs: **/*.{ts,tsx}
---

- Enable strict mode in `tsconfig.json` for better type safety.
- Prefer using interfaces over type aliases for object shapes.
- Use type guards and assertions to ensure type safety at runtime.
- Implement proper type inference to reduce redundancy.

---
name: react-hook-form-best-practices.mdc
description: Best practices for using React Hook Form
globs: **/*.{ts,tsx}
---

- Use `useForm` with default values for better performance.
- Leverage `Controller` for integrating with UI libraries.
- Implement validation using `yup` or `zod` for schema-based validation.
- Use `reset` and `setValue` for dynamic form management.

---
name: tanstack-query-best-practices.mdc
description: Best practices for using TanStack Query (React Query)
globs: **/*.{ts,tsx}
---

- Use `useQuery` and `useMutation` hooks for data fetching and mutations.
- Implement query invalidation for stale data management.
- Use `queryClient` for global state management and caching.
- Leverage `React Query Devtools` for debugging and performance monitoring.

---
name: drizzle-orm-best-practices.mdc
description: Best practices for using Drizzle ORM
globs: **/*.{ts,tsx}
---

- Use migrations for schema changes to maintain database integrity.
- Implement type-safe queries to leverage TypeScript benefits.
- Use `drizzle-kit` for generating types and migrations automatically.
- Keep database interactions modular for better maintainability.

---
name: tailwindcss-best-practices.mdc
description: Best practices for using Tailwind CSS
globs: **/*.{ts,tsx,css}
---

- Use utility-first classes for rapid UI development.
- Leverage `@apply` for reusable styles in custom CSS.
- Implement responsive design using Tailwind's responsive utilities.
- Use `tailwind-merge` to handle conditional class names effectively.

---
name: zod-best-practices.mdc
description: Best practices for using Zod for validation
globs: **/*.{ts,tsx}
---

- Define schemas for data validation to ensure type safety.
- Use `refine` for custom validation logic.
- Leverage `merge` for combining multiple schemas.
- Implement error handling to provide user-friendly feedback.

---
name: prettier-best-practices.mdc
description: Best practices for using Prettier
globs: **/*.{ts,tsx,js,jsx,mdx}
---

- Use a consistent configuration file for team-wide standards.
- Integrate with ESLint for a seamless development experience.
- Set up pre-commit hooks to enforce formatting on code commits.
- Use `prettier-plugin-tailwindcss` for automatic Tailwind class sorting.