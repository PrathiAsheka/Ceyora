"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { soundEngine } from "@/lib/sound";

export interface SubNavItem {
  title: string;
  href: string;
  icon?: LucideIcon;
  badge?: string | number;
}

interface ModuleSubNavProps {
  items: SubNavItem[];
  className?: string;
}

export function ModuleSubNav({ items, className }: ModuleSubNavProps) {
  const pathname = usePathname();

  return (
    <div className={cn("flex items-center gap-1.5 p-1 rounded-2xl bg-muted/30 border border-border/40 w-fit max-w-full overflow-x-auto", className)}>
      {items.map((item) => {
        const isActive = pathname === item.href;
        const Icon = item.icon;

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => {
              try { soundEngine.playClick(); } catch {}
            }}
            className={cn(
              "relative flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap",
              isActive
                ? "text-primary font-bold"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
            )}
          >
            {isActive && (
              <motion.div
                layoutId="sub-nav-pill"
                className="absolute inset-0 rounded-xl bg-background shadow-sm border border-border/50"
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
              />
            )}
            {Icon && <Icon className={cn("h-3.5 w-3.5 relative z-10", isActive ? "text-primary" : "text-muted-foreground")} />}
            <span className="relative z-10">{item.title}</span>
            {item.badge !== undefined && (
              <span
                className={cn(
                  "relative z-10 px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "bg-muted text-muted-foreground"
                )}
              >
                {item.badge}
              </span>
            )}
          </Link>
        );
      })}
    </div>
  );
}
