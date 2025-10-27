# Development Rules & Standards

## Project Overview

This is a full-stack TypeScript application with:

- **Frontend**: Next.js 15 + React 19 + TypeScript
- **Backend**: NestJS + Fastify + Prisma + TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **UI**: Radix UI + Tailwind CSS + shadcn/ui
- **State Management**: React Query (@tanstack/react-query) + React Context
- **Forms**: React Hook Form + Zod validation

## Core Principles

### 1. Single Responsibility Principle

- Each component, function, and module should have ONE clear responsibility
- Avoid "God components" or overly complex modules
- Separate business logic from UI components
- Keep functions small and focused

### 2. Type Safety First

- Everything must be properly typed with TypeScript
- Use strict TypeScript configuration
- Leverage Prisma's generated types for database operations
- Use Zod for runtime validation and type inference

### 3. Consistency Over Cleverness

- Follow established patterns within the codebase
- Prefer explicit over implicit code
- Use consistent naming conventions throughout

## Project Structure Standards

### Frontend Structure (`src/`)

```
src/
├── apis/              # API client functions and configurations
├── app/               # Next.js App Router pages and layouts
├── assets/            # Static assets (images, icons, fonts)
├── components/        # Reusable UI components
│   ├── auth/          # Authentication-related components
│   ├── community/     # Community feature components
│   ├── dashboard/     # Dashboard-specific components
│   ├── help/          # Help and support components
│   ├── journal/       # Journal feature components
│   ├── resources/     # Resources feature components
│   └── ui/            # Base UI components (shadcn/ui)
├── contexts/          # React Context providers
├── hooks/             # Custom React hooks
├── i18n/              # Internationalization configuration
├── lib/               # Utility libraries and configurations
├── messages/          # i18n message files
├── types/             # TypeScript type definitions
└── utils/             # Utility functions
```

### Backend Structure (`src/`)

```
src/
├── auth/              # Authentication module
├── common/            # Shared utilities and decorators
├── config/            # Configuration files
├── health/            # Health check endpoints
├── journal/           # Journal feature module
├── prisma/            # Prisma service and configurations
└── users/             # User management module
```

### Module Structure (Backend)

Each NestJS module should follow this structure:

```
module-name/
├── dto/               # Data Transfer Objects
├── entities/          # Database entities (if needed)
├── module-name.controller.ts
├── module-name.service.ts
├── module-name.module.ts
└── __tests__/         # Module-specific tests
```

## Naming Conventions

### Files and Directories

- **Directories**: `kebab-case` (e.g., `user-profile`, `auth-guard`)
- **Components**: `kebab-case.tsx` (e.g., `user-profile.tsx`, `create-reflection-dialog.tsx`)
- **Hooks**: `kebab-case.ts` starting with `use` (e.g., `use-auth.ts`, `use-local-storage.ts`)
- **Utilities**: `kebab-case.ts` (e.g., `format-date.ts`, `api-client.ts`)
- **Types**: `camelCase.ts` (e.g., `user.ts`, `journal.ts`, `dialog.ts`)
- **API routes**: `kebab-case` (e.g., `/api/user-profile`, `/api/auth/login`)

### Code Naming

- **Variables/Functions**: `camelCase` (e.g., `userName`, `handleSubmit`)
- **Constants**: `SCREAMING_SNAKE_CASE` (e.g., `API_BASE_URL`, `MAX_FILE_SIZE`)
- **Types/Interfaces**: `PascalCase` (e.g., `User`, `CreateReflectionPayload`)
- **Enums**: `PascalCase` with `PascalCase` values (e.g., `PrivacyOption.Public`)

### Component Naming

- Use descriptive, self-documenting names
- Prefix with feature area when needed (e.g., `JournalEntryCard`, `AuthLoginForm`)
- Avoid abbreviations unless widely understood

## Type Organization

### Type File Structure

- **Feature-based types**: Group related types in feature-specific files
  - `src/types/journal.ts` - Journal-related types
  - `src/types/auth.ts` - Authentication types
  - `src/types/dialog.ts` - Dialog component types
- **Shared types**: Common types used across features
  - `src/types/api.ts` - API response/request types
  - `src/types/common.ts` - Utility types

### Type Naming Patterns

- **Props interfaces**: `ComponentNameProps` (e.g., `CreateReflectionDialogProps`)
- **API types**: `ActionPayload` or `ActionResponse` (e.g., `CreateReflectionPayload`)
- **Form types**: `FormNameData` (e.g., `ReflectionFormData`)
- **Enum types**: Descriptive names (e.g., `PrivacyOption`, `MoodOption`)

## Component Architecture

### Component Organization

- **UI Components** (`src/components/ui/`): Base, reusable components (buttons, inputs, dialogs)
- **Feature Components** (`src/components/[feature]/`): Feature-specific components
- **Page Components** (`src/app/`): Next.js pages and layouts

### Component Structure

```typescript
// 1. Imports (external libraries first, then internal)
import React from 'react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/useAuth'
import type { ComponentProps } from '@/types/component'

// 2. Types/Interfaces
interface ComponentProps {
  // props definition
}

// 3. Component implementation
export function Component({ prop1, prop2 }: ComponentProps) {
  // 4. Hooks and state
  const { user } = useAuth()
  const [state, setState] = useState()

  // 5. Event handlers
  const handleClick = () => {
    // implementation
  }

  // 6. Effects
  useEffect(() => {
    // side effects
  }, [])

  // 7. Render
  return (
    <div>
      {/* JSX */}
    </div>
  )
}
```

## API Standards

### Frontend API Layer

- **Location**: `src/apis/`
- **Structure**: Feature-based API files (e.g., `journalApi.ts`, `authApi.ts`)
- **Pattern**: Use React Query for data fetching and caching
- **Error Handling**: Consistent error handling with proper TypeScript types

### Backend API Standards

- **RESTful conventions**: Use proper HTTP methods and status codes
- **Validation**: Use class-validator for DTO validation
- **Error Handling**: Consistent error response format
- **Documentation**: Use Swagger/OpenAPI decorators

### API Response Format

```typescript
// Success Response
interface ApiResponse<T> {
  data: T;
  message?: string;
  meta?: {
    pagination?: PaginationMeta;
    timestamp: string;
  };
}

// Error Response
interface ApiError {
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
  timestamp: string;
}
```

## Database & Prisma Standards

### Schema Organization

- Use descriptive model names in `PascalCase`
- Use `camelCase` for field names
- Include proper relations and constraints
- Add indexes for frequently queried fields

### Prisma Service Pattern

- Create a centralized `PrismaService` in NestJS
- Use transactions for multi-model operations
- Implement proper error handling for database operations
- Use Prisma's generated types throughout the application

## State Management

### React Query Usage

- Use for server state management
- Implement proper cache invalidation
- Use optimistic updates where appropriate
- Handle loading and error states consistently

### React Context Usage

- Use for client-side global state (theme, user preferences)
- Keep contexts focused and small
- Provide proper TypeScript types for context values

## Styling Standards

### Tailwind CSS Usage

- Use utility classes for styling
- Create custom components for repeated patterns
- Use CSS variables for theme values
- Follow mobile-first responsive design

### Component Styling

- Co-locate styles with components when using CSS modules
- Use consistent spacing scale (Tailwind's spacing system)
- Implement proper dark mode support

## Testing Standards

### Testing Structure

- **Unit Tests**: For utilities and pure functions
- **Component Tests**: For React components using React Testing Library
- **Integration Tests**: For API endpoints and database operations
- **E2E Tests**: For critical user flows

### Testing Conventions

- Test files should be named `*.test.ts` or `*.spec.ts`
- Place tests in `__tests__` directories or co-located with source files
- Use descriptive test names that explain the expected behavior

## Development Workflow

### Git Workflow

- Use conventional commit messages
- Create feature branches from `main`
- Use pull requests for code review
- Keep commits atomic and focused

### Code Quality

- Use ESLint and Prettier for code formatting
- Run type checking before commits
- Use pre-commit hooks for quality checks
- Maintain high test coverage

### Performance Considerations

- Implement proper code splitting in Next.js
- Use React.memo for expensive components
- Optimize database queries with proper indexing
- Implement proper caching strategies

## Security Best Practices

### Authentication & Authorization

- Use secure JWT token handling
- Implement proper CORS configuration
- Validate all inputs on both client and server
- Use HTTPS in production

### Data Protection

- Never log sensitive information
- Use environment variables for secrets
- Implement proper error handling that doesn't leak information
- Follow OWASP security guidelines

## Documentation Standards

### Code Documentation

- Use JSDoc for complex functions
- Write clear README files for each major feature
- Document API endpoints with proper examples
- Keep documentation up to date with code changes

### Type Documentation

- Use descriptive type names
- Add comments for complex type definitions
- Document enum values when not self-explanatory

## Deployment & Environment

### Environment Configuration

- Use `.env` files for environment variables
- Never commit secrets to version control
- Use different configurations for development, staging, and production
- Document all required environment variables

### Build & Deployment

- Ensure builds are reproducible
- Use proper error monitoring in production
- Implement health checks for services
- Use proper logging levels

---

## Quick Reference Checklist

When creating new features, ensure:

- [ ] Proper TypeScript types are defined
- [ ] Components follow single responsibility principle
- [ ] Naming conventions are followed
- [ ] API endpoints follow RESTful conventions
- [ ] Database operations use proper Prisma patterns
- [ ] Error handling is implemented
- [ ] Tests are written for new functionality
- [ ] Documentation is updated
- [ ] Security considerations are addressed
- [ ] Performance implications are considered

---

_This document should be referenced for all development work and updated as the project evolves._
