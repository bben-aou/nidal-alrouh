import { Home, User, Settings, LogOut } from 'lucide-react';
import { ReactNode } from 'react';

import { Button } from '@/components/ui/button';
import { Link } from '@/i18n/navigation';

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-card border-r min-h-screen p-4">
          <div className="space-y-4">
            <div className="px-3 py-2">
              <h2 className="mb-2 px-4 text-lg font-semibold">Dashboard</h2>
            </div>

            <nav className="space-y-2">
              <Button asChild variant="ghost" className="w-full justify-start">
                <Link href="/dashboard">
                  <Home className="mr-2 h-4 w-4" />
                  Dashboard
                </Link>
              </Button>

              <Button asChild variant="ghost" className="w-full justify-start">
                <Link href="/profile">
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </Link>
              </Button>

              <Button asChild variant="ghost" className="w-full justify-start">
                <Link href="/settings">
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </Link>
              </Button>
            </nav>

            <div className="pt-4 border-t">
              <Button
                variant="ghost"
                className="w-full justify-start text-destructive"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
