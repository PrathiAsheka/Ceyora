"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronRight, Home, ArrowLeft } from "lucide-react";
import { soundEngine } from "@/lib/sound";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  showBackButton?: boolean;
}

export function Breadcrumbs({ items, showBackButton = true }: BreadcrumbsProps) {
  const router = useRouter();

  return (
    <nav className="flex items-center gap-2 text-xs text-muted-foreground mb-3 flex-wrap">
      {showBackButton && (
        <button
          onClick={() => {
            try { soundEngine.playClick(); } catch {}
            router.back();
          }}
          className="flex items-center gap-1 px-2.5 py-1 rounded-lg border border-border/40 hover:bg-muted/40 hover:text-foreground transition-all mr-1"
          title="Go back to previous page"
        >
          <ArrowLeft className="h-3 w-3" />
          <span>Back</span>
        </button>
      )}

      <Link
        href="/"
        onClick={() => {
          try { soundEngine.playClick(); } catch {}
        }}
        className="flex items-center gap-1 hover:text-foreground transition-colors p-1 rounded-md hover:bg-muted/40"
        title="Dashboard Overview"
      >
        <Home className="h-3.5 w-3.5" />
      </Link>

      {items.map((item, idx) => {
        const isLast = idx === items.length - 1;
        return (
          <div key={idx} className="flex items-center gap-2">
            <ChevronRight className="h-3 w-3 text-muted-foreground/40 shrink-0" />
            {item.href && !isLast ? (
              <Link
                href={item.href}
                onClick={() => {
                  try { soundEngine.playClick(); } catch {}
                }}
                className="hover:text-foreground hover:underline transition-colors max-w-[200px] truncate"
              >
                {item.label}
              </Link>
            ) : (
              <span className="font-semibold text-foreground max-w-[240px] truncate">
                {item.label}
              </span>
            )}
          </div>
        );
      })}
    </nav>
  );
}
