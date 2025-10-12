"use client";

import { useState } from "react";
import { Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export type Language = "ar" | "fr";

export const LanguageSwitcher = () => {
  const [currentLang, setCurrentLang] = useState<Language>("fr");

  const switchLanguage = (lang: Language) => {
    setCurrentLang(lang);
    document.documentElement.setAttribute("dir", lang === "ar" ? "rtl" : "ltr");
    document.documentElement.setAttribute("lang", lang);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2">
          <Globe className="h-4 w-4" />
          <span className="font-medium">{currentLang === "ar" ? "عربي" : "Français"}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-card border-border">
        <DropdownMenuItem
          onClick={() => switchLanguage("ar")}
          className="cursor-pointer font-arabic"
        >
          العربية (Arabic)
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => switchLanguage("fr")}
          className="cursor-pointer"
        >
          Français (French)
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
