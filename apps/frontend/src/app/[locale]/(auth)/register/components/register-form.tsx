import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, Mail, Lock, User } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Link } from '@/i18n/navigation';
import {
  createAuthSchemas,
  type RegisterFormData,
} from '@/lib/validations/auth';

interface RegisterFormProps {
  onSubmit: (data: RegisterFormData) => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

export function RegisterForm({
  onSubmit,
  isLoading,
  error,
}: RegisterFormProps) {
  const t = useTranslations('auth');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { registerSchema } = createAuthSchemas(t);

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: 'onChange',
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4 sm:space-y-6"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="relative">
                  <User className="absolute ltr:left-3 rtl:right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder={t('register.name')}
                    className="bg-background/50 ltr:pl-10 rtl:pr-10 h-11 sm:h-12"
                    autoComplete="name"
                    aria-describedby={
                      form.formState.errors.name ? 'name-error' : undefined
                    }
                    {...field}
                  />
                </div>
              </FormControl>
              <FormMessage className="text-xs sm:text-sm" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="relative">
                  <Mail className="absolute ltr:left-3 rtl:right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="email"
                    placeholder={t('register.email')}
                    className="bg-background/50 ltr:pl-10 rtl:pr-10 h-11 sm:h-12"
                    autoComplete="email"
                    aria-describedby={
                      form.formState.errors.email ? 'email-error' : undefined
                    }
                    {...field}
                  />
                </div>
              </FormControl>
              <FormMessage className="text-xs sm:text-sm" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="relative">
                  <Lock className="absolute ltr:left-3 rtl:right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    placeholder={t('register.password')}
                    className="bg-background/50 ltr:pl-10 ltr:pr-10 rtl:pr-10 rtl:pl-10 h-11 sm:h-12"
                    autoComplete="new-password"
                    aria-describedby={
                      form.formState.errors.password
                        ? 'password-error'
                        : undefined
                    }
                    {...field}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute ltr:right-0 rtl:left-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={
                      showPassword
                        ? t('register.hidePassword')
                        : t('register.showPassword')
                    }
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
              </FormControl>
              <FormMessage className="text-xs sm:text-sm" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="relative">
                  <Lock className="absolute ltr:left-3 rtl:right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder={t('register.confirmPassword')}
                    className="bg-background/50 ltr:pl-10 ltr:pr-10 rtl:pr-10 rtl:pl-10 h-11 sm:h-12"
                    autoComplete="new-password"
                    aria-describedby={
                      form.formState.errors.confirmPassword
                        ? 'confirm-error'
                        : undefined
                    }
                    {...field}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute ltr:right-0 rtl:left-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    aria-label={
                      showConfirmPassword
                        ? t('register.hidePassword')
                        : t('register.showPassword')
                    }
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
              </FormControl>
              <FormMessage className="text-xs sm:text-sm" />
            </FormItem>
          )}
        />

        {error && (
          <p className="text-xs sm:text-sm text-destructive" id="form-error">
            {error}
          </p>
        )}

        <Button
          type="submit"
          className="w-full bg-primary hover:bg-primary-dark text-white h-11 sm:h-12 text-sm sm:text-base"
          disabled={isLoading}
        >
          {isLoading ? t('register.signingUp') : t('register.submit')}
        </Button>

        <div className="text-center text-xs sm:text-sm">
          <span className="text-muted-foreground">
            {t('register.hasAccount')}{' '}
          </span>
          <Link
            href="/login"
            className="font-medium text-primary hover:text-primary-dark transition-colors"
          >
            {t('register.signIn')}
          </Link>
        </div>
      </form>
    </Form>
  );
}
