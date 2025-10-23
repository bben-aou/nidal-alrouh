import { ReactNode } from 'react';

import { AuthHeader } from '@/components/auth/header';

interface AuthLayoutProps {
  children: ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="h-screen bg-background flex flex-col">
      <AuthHeader />
      <main className="flex-1 flex overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 flex w-full 2xl:max-w-[95rem]">
          {children}
        </div>
      </main>
    </div>
  );
}
