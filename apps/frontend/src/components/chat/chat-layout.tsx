'use client';
import { useTranslations } from 'next-intl';
import { useState, type ReactNode } from 'react';

interface ChatLayoutProps {
  sidebar: ReactNode;
  children: ReactNode;
}

export default function ChatLayout({
  sidebar,
  children,
}: Readonly<ChatLayoutProps>) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const t = useTranslations('chat');

  return (
    <div className="w-full h-[calc(100svh-6rem)] flex flex-col overflow-hidden">
      {/* Mobile top bar */}
      <div className="md:hidden sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex items-center justify-between p-3">
          <button
            type="button"
            aria-label="Toggle sidebar"
            className="px-3 py-2 text-sm rounded-md border hover:bg-muted"
            onClick={() => setSidebarOpen((v) => !v)}
          >
            {t('layout.roomsButton')}
          </button>
          <div className="text-sm font-medium">{t('layout.title')}</div>
          <div className="w-16" />
        </div>
        {sidebarOpen && (
          <div className="border-t max-h-[calc(100svh-4rem)] overflow-y-auto">
            {sidebar}
          </div>
        )}
      </div>

      {/* Desktop grid */}
      <div className="flex flex-1 min-h-0 md:grid md:grid-cols-[320px_1fr]">
        <aside className="hidden md:block border-r overflow-y-auto">
          {sidebar}
        </aside>
        <main className="h-full overflow-hidden flex flex-col">{children}</main>
      </div>
    </div>
  );
}
