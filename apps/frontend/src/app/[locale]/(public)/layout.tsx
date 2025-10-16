import { ReactNode } from 'react';

import { Header } from '@/components/Header';

interface PublicLayoutProps {
  children: ReactNode;
}

export default function PublicLayout({ children }: PublicLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">{children}</main>

      {/* Footer */}
      <footer className="bg-muted border-t mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-muted-foreground">
            <p>&copy; 2024 Nidal Alrouh. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
