"use client";

import { create } from "zustand";

interface UIState {
  mobileSidebarOpen: boolean;
  desktopCollapsed: boolean;
  openMobileSidebar: () => void;
  closeMobileSidebar: () => void;
  toggleDesktopCollapsed: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  mobileSidebarOpen: false,
  desktopCollapsed: false,
  openMobileSidebar: () => set({ mobileSidebarOpen: true }),
  closeMobileSidebar: () => set({ mobileSidebarOpen: false }),
  toggleDesktopCollapsed: () => set((s) => ({ desktopCollapsed: !s.desktopCollapsed })),
}));
