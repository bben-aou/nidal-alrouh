import { ReactNode } from 'react';

interface AuthLayoutProps {
  children: ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted">
      <div className="w-full max-w-md mx-auto p-6">
        <div className="bg-card rounded-lg shadow-lg border p-8">
          {children}
        </div>
      </div>
    </div>
  );
}
