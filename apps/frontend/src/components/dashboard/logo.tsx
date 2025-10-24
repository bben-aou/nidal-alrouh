'use client';

import { Link } from '@/i18n/navigation';

export function Logo() {
  return (
    <Link
      href="/dashboard"
      className="flex items-center gap-3 transition duration-300 ease-in-out hover:opacity-80"
    >
      <h1 className="font-arabic text-2xl font-bold bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent">
        نضال الروح
      </h1>
      <span className="hidden sm:inline text-sm font-medium text-muted-foreground">
        / Nidal Al-Rouh
      </span>
    </Link>
  );
}
