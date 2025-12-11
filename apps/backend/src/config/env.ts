import { z } from 'zod';

export const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'test', 'production'])
    .default('development'),
  PORT: z.coerce.number().int().min(1).max(65535).default(8080),
  API_PREFIX: z.string().min(1).default('api'),
  LOG_LEVEL: z
    .enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace', 'silent'])
    .default('info'),
  DATABASE_URL: z.string().url(),
  NEXT_PUBLIC_APP_URL: z.string().url().optional(),
  FRONTEND_URL: z.string().url().optional(),
  // CORS configuration
  CORS_ALLOWED_ORIGINS: z
    .string()
    .min(1)
    .transform((val) =>
      val
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)
    )
    .refine((origins) => origins.length > 0, {
      message: 'At least one CORS origin must be specified',
    }),
  CORS_ALLOWED_METHODS: z
    .string()
    .min(1)
    .default('GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS')
    .transform((val) => val.split(',').map((s) => s.trim()))
    .refine((methods) => methods.length > 0, {
      message: 'At least one CORS method must be specified',
    }),
  CORS_CREDENTIALS: z.coerce.boolean().default(true),
  // Security headers via Helmet
  HELMET_ENABLED: z.coerce.boolean().default(true),
  // JWT configuration
  JWT_ACCESS_SECRET: z.string().min(32),
  JWT_REFRESH_SECRET: z.string().min(32),
  JWT_ACCESS_TTL: z.string().default('15m'),
  JWT_REFRESH_TTL: z.string().default('7d'),
  // Cookie configuration
  COOKIE_DOMAIN: z.string().optional(),
  COOKIE_SECURE: z.coerce.boolean().default(false),
});

export type Env = z.infer<typeof envSchema>;

export function validateEnv(config: Record<string, unknown>): Env {
  const result = envSchema.safeParse(config);
  if (!result.success) {
    const formatted = result.error.issues
      .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
      .join('; ');
    throw new Error(`Invalid environment configuration: ${formatted}`);
  }
  return result.data;
}
