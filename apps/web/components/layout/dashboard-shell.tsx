"use client";

import { useState } from "react";
import { FloatingCommandDock } from "./floating-command-dock";
import { LiveActivityDrawer } from "./live-activity-drawer";

interface DashboardShellProps {
  children: React.ReactNode;
}

export function DashboardShell({ children }: DashboardShellProps) {
  const [isActivityDrawerOpen, setIsActivityDrawerOpen] = useState(false);

  return (
    <>
      {/* Radiant Atmospheric Glow Mesh in Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 opacity-40 dark:opacity-60">
        <div className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-primary/10 blur-[128px]" />
        <div className="absolute top-1/3 -right-40 h-96 w-96 rounded-full bg-violet-600/10 blur-[128px]" />
        <div className="absolute -bottom-40 left-1/3 h-96 w-96 rounded-full bg-cyan-500/10 blur-[128px]" />
      </div>

      {/* Main Content Area with bottom dock clearance */}
      <div className="relative z-10 pb-20">
        {children}
      </div>

      {/* Bottom Floating Command Dock */}
      <FloatingCommandDock
        isActivityDrawerOpen={isActivityDrawerOpen}
        onToggleActivityDrawer={() => setIsActivityDrawerOpen((prev) => !prev)}
      />

      {/* Slide-over Live Activity Drawer */}
      <LiveActivityDrawer
        isOpen={isActivityDrawerOpen}
        onClose={() => setIsActivityDrawerOpen(false)}
      />
    </>
  );
}
