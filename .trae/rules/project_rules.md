version: 1

rules:

- when: "working on frontend code"
  then: |
  Follow these frontend architecture and coding standards:

  ## Tech Stack
  - Next.js 15 + React 19 + TypeScript
  - Tailwind CSS + Radix UI + shadcn/ui
  - React Query + React Hook Form + Zod

  ## Folder Structure

  Use this structure strictly:

  ```
  src/
  ├── apis/              # API client functions
  ├── app/               # Next.js App Router
  ├── assets/            # Images, icons, fonts
  ├── components/        # Reusable UI components
  │   ├── auth/
  │   ├── community/
  │   ├── dashboard/
  │   ├── ui/
  ├── contexts/          # React Context providers
  ├── hooks/             # Custom hooks
  ├── i18n/              # Internationalization
  ├── lib/               # Utils/configs
  ├── messages/          # i18n message files
  ├── types/             # Type definitions
  └── utils/             # Helper functions
  ```

  ## Component Rules
  - Apply **Single Responsibility Principle**
  - Use **TypeScript with full type safety**
  - Maintain consistent naming conventions
  - Structure React components like:
    1. Imports
    2. Types/interfaces
    3. Component definition
    4. Hooks/state
    5. Event handlers
    6. Effects
    7. Render return
  - File naming: `kebab-case.tsx`
  - Props interface: `ComponentNameProps`

  ## Styling
  - Use Tailwind utility classes
  - Maintain consistent spacing, colors, and dark mode support
  - Create custom components for repeated patterns
  - Follow mobile-first design

  ## State Management
  - Use React Query for server state
  - Use Context only for local/global UI state
  - Handle errors and loading states gracefully

  ## Testing
  - Use React Testing Library for component tests
  - Tests named `*.test.ts` or `*.spec.ts`
  - Place tests in `__tests__/` or co-located with components

- when: "working on backend code"
  then: |
  Follow these backend architecture and code standards:

  ## Tech Stack
  - NestJS + Fastify + Prisma + PostgreSQL + TypeScript

  ## Module Structure

  ```
  module-name/
  ├── dto/
  ├── entities/
  ├── module-name.controller.ts
  ├── module-name.service.ts
  ├── module-name.module.ts
  └── __tests__/
  ```

  ## Principles
  - Apply **Single Responsibility Principle**
  - Use **class-validator** for DTO validation
  - Ensure consistent error response format
  - Use proper HTTP status codes

  ## Prisma & Database
  - Use PascalCase for models and camelCase for fields
  - Centralize PrismaService
  - Use Prisma transactions for multi-operations
  - Ensure indexing on frequently queried fields
  - Use Prisma-generated types everywhere

  ## API Standards
  - RESTful routes only
  - Consistent response structure:
    ```ts
    interface ApiResponse<T> {
      data: T;
      message?: string;
      meta?: { pagination?: PaginationMeta; timestamp: string };
    }
    interface ApiError {
      error: { code: string; message: string; details?: unknown };
      timestamp: string;
    }
    ```
  - Document endpoints using Swagger decorators

- when: "writing any TypeScript code"
  then: |

  ## TypeScript Standards
  - Enforce strict typing; no `any`
  - Use Zod or DTOs for runtime validation
  - Organize types by feature in `src/types/[feature].ts`
  - Naming patterns:
    - Variables/Functions: camelCase
    - Constants: SCREAMING_SNAKE_CASE
    - Types/Interfaces: PascalCase
    - Enums: PascalCase
    - File names: kebab-case
  - Example:
    ```ts
    export interface CreateReflectionPayload { ... }
    export enum PrivacyOption { Public, Private }
    ```

- when: "editing or creating tests"
  then: |

  ## Testing Rules
  - Follow **unit**, **component**, **integration**, and **E2E** hierarchy
  - Use descriptive test names
  - Prefer React Testing Library (frontend)
  - Prefer Jest (backend)
  - Test files should be inside `__tests__/` directories

- when: "handling version control or commits"
  then: |

  ## Git Workflow
  - Use feature branches from `main`
  - Follow Conventional Commits
  - Keep commits small and focused
  - Submit PRs for review
  - Run ESLint, Prettier, and TypeScript checks before committing

- when: "working on performance or security"
  then: |

  ## Performance
  - Use code splitting in Next.js
  - Use React.memo when necessary
  - Optimize Prisma queries
  - Cache expensive operations

  ## Security
  - Use HTTPS and secure JWT handling
  - Validate all inputs (frontend and backend)
  - Do not log sensitive information
  - Follow OWASP security best practices
  - Store secrets in `.env` (never commit them)

- when: "writing documentation or comments"
  then: |

  ## Documentation Standards
  - Document all complex logic using JSDoc
  - Keep README and API docs up to date
  - Document enums and complex type definitions
  - Add examples for API endpoints

- when: "developing new features"
  then: |
  Before considering the feature complete, ensure:
  - [ ] Proper TypeScript types defined
  - [ ] Single Responsibility Principle respected
  - [ ] Naming conventions followed
  - [ ] RESTful API conventions used
  - [ ] Database operations follow Prisma best practices
  - [ ] Error handling implemented
  - [ ] Tests written
  - [ ] Documentation updated
  - [ ] Security & performance reviewed
