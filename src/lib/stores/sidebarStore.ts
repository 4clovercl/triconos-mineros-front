"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface SidebarState {
  isCollapsed: boolean;
  isMobileOpen: boolean;
  toggleCollapsed: () => void;
  setCollapsed: (val: boolean) => void;
  toggleMobile: () => void;
  closeMobile: () => void;
}

export const useSidebarStore = create<SidebarState>()(
  persist(
    (set) => ({
      isCollapsed: false,
      isMobileOpen: false,

      toggleCollapsed: () =>
        set((state) => ({ isCollapsed: !state.isCollapsed })),

      setCollapsed: (val: boolean) => set({ isCollapsed: val }),

      toggleMobile: () =>
        set((state) => ({ isMobileOpen: !state.isMobileOpen })),

      closeMobile: () => set({ isMobileOpen: false }),
    }),
    {
      name: "triconos-sidebar",
      partialize: (state) => ({ isCollapsed: state.isCollapsed }),
    }
  )
);
