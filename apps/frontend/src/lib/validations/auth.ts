import * as z from 'zod';

// Function to create validation schemas with translations
export const createAuthSchemas = (t: (key: string) => string) => {
  // Register form schema
  const registerSchema = z
    .object({
      name: z
        .string()
        .min(1, t('validation.nameRequired'))
        .min(2, t('validation.nameMinLength'))
        .max(50, t('validation.nameMaxLength'))
        .regex(/^[a-zA-Z\s]+$/, t('validation.nameInvalid')),
      email: z
        .string()
        .min(1, t('validation.emailRequired'))
        .email(t('validation.emailInvalid')),
      password: z
        .string()
        .min(1, t('validation.passwordRequired'))
        .min(8, t('validation.passwordMinLength'))
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, t('validation.passwordWeak')),
      confirmPassword: z
        .string()
        .min(1, t('validation.confirmPasswordRequired')),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t('validation.passwordsNotMatch'),
      path: ['confirmPassword'],
    });

  // Login form schema
  const loginSchema = z.object({
    email: z
      .string()
      .min(1, t('validation.emailRequired'))
      .email(t('validation.emailInvalid')),
    password: z.string().min(1, t('validation.passwordRequired')),
  });

  // Forgot password form schema
  const forgotPasswordSchema = z.object({
    email: z
      .string()
      .min(1, t('validation.emailRequired'))
      .email(t('validation.emailInvalid')),
  });

  return {
    registerSchema,
    loginSchema,
    forgotPasswordSchema,
  };
};

// Fallback schemas with English messages (for cases where translations aren't available)
export const registerSchema = z
  .object({
    name: z
      .string()
      .min(1, 'Name is required')
      .min(2, 'Name must be at least 2 characters')
      .max(50, 'Name must be at most 50 characters')
      .regex(/^[a-zA-Z\s]+$/, 'Name can only contain letters and spaces'),
    email: z
      .string()
      .min(1, 'Email is required')
      .email('Please enter a valid email address'),
    password: z
      .string()
      .min(1, 'Password is required')
      .min(8, 'Password must be at least 8 characters')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        'Password must contain at least one uppercase letter, one lowercase letter, and one number'
      ),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
});

// Type exports
export type RegisterFormData = z.infer<typeof registerSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
