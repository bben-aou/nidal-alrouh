import Link from "next/link";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

export const Header = () => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <h1 className="font-arabic text-2xl font-bold text-primary">
            نضال الروح
          </h1>
          <span className="hidden sm:inline text-sm text-muted-foreground">
            / Nidal Al-Rouh
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link
            href="/about"
            className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
          >
            À propos
          </Link>
          <Link
            href="/resources"
            className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
          >
            Ressources
          </Link>
          <Link
            href="/forum"
            className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
          >
            Communauté
          </Link>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <LanguageSwitcher />
          <Link href="/auth">
            <Button
              variant="ghost"
              size="sm"
              className="text-sm font-medium"
            >
              Se connecter
            </Button>
          </Link>
          <Button size="icon" variant="ghost" className="md:hidden">
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
};
