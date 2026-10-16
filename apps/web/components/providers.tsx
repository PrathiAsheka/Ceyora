"use client";

import { ThemeProvider } from "@/components/layout/theme-provider";
import { I18nProvider } from "@/lib/i18n";
import { Toaster } from "react-hot-toast";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <I18nProvider>
        {children}
        <Toaster position="top-right" />
      </I18nProvider>
    </ThemeProvider>
  );
}
