"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type UserRole = "admin" | "operator" | "viewer";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  initials: string;
  avatarColor: string;
  site?: string;
}

const MOCK_USERS: Record<string, { user: AuthUser; password: string }> = {
  "admin@triconos.com": {
    password: "admin123",
    user: {
      id: "u-001",
      name: "Carlos Mendoza",
      email: "admin@triconos.com",
      role: "admin",
      initials: "CM",
      avatarColor: "from-purple-500 to-indigo-600",
    },
  },
  "operator@triconos.com": {
    password: "op123",
    user: {
      id: "u-002",
      name: "Ana Rodriguez",
      email: "operator@triconos.com",
      role: "operator",
      initials: "AR",
      avatarColor: "from-emerald-500 to-teal-600",
      site: "Site Alpha - Northern Territory",
    },
  },
  "viewer@triconos.com": {
    password: "view123",
    user: {
      id: "u-003",
      name: "Roberto Silva",
      email: "viewer@triconos.com",
      role: "viewer",
      initials: "RS",
      avatarColor: "from-orange-400 to-red-500",
      site: "Site Beta - Western Ridge",
    },
  },
};

interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,

      login: async (email: string, password: string) => {
        await new Promise((r) => setTimeout(r, 800));
        const record = MOCK_USERS[email.toLowerCase()];
        if (record && record.password === password) {
          set({ user: record.user, isAuthenticated: true });
          return true;
        }
        return false;
      },

      logout: () => {
        set({ user: null, isAuthenticated: false });
      },
    }),
    {
      name: "triconos-auth",
    }
  )
);
