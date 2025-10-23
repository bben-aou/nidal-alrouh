import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff } from 'lucide-react';
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
import { createAuthSchemas, type LoginFormData } from '@/lib/validations/auth';

interface LoginFormProps {
  onSubmit: (data: LoginFormData) => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

export function LoginForm({ onSubmit, isLoading, error }: LoginFormProps) {
  const t = useTranslations('auth');
  const [showPassword, setShowPassword] = useState(false);

  const { loginSchema } = createAuthSchemas(t);

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: 'onChange',
    defaultValues: {
      email: '',
      password: '',
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
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  type="email"
                  placeholder={t('login.email')}
                  className="bg-background/50 h-11 sm:h-12"
                  autoComplete="email"
                  aria-describedby={
                    form.formState.errors.email ? 'email-error' : undefined
                  }
                  {...field}
                />
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
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    placeholder={t('login.password')}
                    className="bg-background/50 ltr:pr-10 rtl:pl-10 h-11 sm:h-12"
                    autoComplete="current-password"
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
                        ? t('login.hidePassword')
                        : t('login.showPassword')
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

        <div className="flex items-center justify-end">
          <Link
            href="/forgot-password"
            className="text-xs sm:text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            {t('login.forgotPassword')}
          </Link>
        </div>

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
          {isLoading ? t('login.signingIn') : t('login.signIn')}
        </Button>

        <div className="text-center text-xs sm:text-sm">
          <span className="text-muted-foreground">{t('login.noAccount')} </span>
          <Link
            href="/register"
            className="font-medium text-primary hover:text-primary-dark transition-colors"
          >
            {t('login.signUp')}
          </Link>
        </div>
      </form>
    </Form>
  );
}
