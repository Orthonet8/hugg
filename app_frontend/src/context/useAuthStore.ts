import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { UserProfile } from "../types";

interface AuthState {
  user: UserProfile | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (data: SignupData) => Promise<boolean>;
  logout: () => void;
}

export interface SignupData {
  email: string;
  password: string;
  fullName: string;
  christianName?: string;
  mobile?: string;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,

      login: async (email: string, password: string) => {
        try {
          // TODO: Replace with actual API call
          // const res = await fetch(`${API_BASE}/api/auth/login`, {
          //   method: "POST",
          //   headers: { "Content-Type": "application/json" },
          //   body: JSON.stringify({ email, password }),
          // });
          // const data = await res.json();
          // if (!res.ok) throw new Error(data.message);
          // set({ user: data.user, isAuthenticated: true });
          // return true;

          // Mock login — simulate server delay
          await new Promise((r) => setTimeout(r, 600));

          // Read users from JSON mock "API"
          const usersRes = await fetch("/api/users.json");
          const users: UserProfile[] = await usersRes.json();
          const found = users.find(
            (u) => u.email === email || u.phone === email,
          );

          if (!found) {
            // Check localStorage for registered users (mock signup storage)
            const registeredRaw = localStorage.getItem("hugg_registered_users");
            if (registeredRaw) {
              const registered: Array<SignupData & { registeredAt: string }> =
                JSON.parse(registeredRaw);
              const match = registered.find(
                (u) =>
                  (u.email === email || u.mobile === email) &&
                  u.password === password,
              );
              if (match) {
                const mockUser: UserProfile = {
                  id: `user-${Date.now()}`,
                  fullName: match.fullName,
                  christianName: match.christianName || "",
                  campus: "",
                  dorm: "",
                  languages: [],
                  talents: [],
                  services: [],
                  avatar: "",
                  email: match.email,
                  phone: match.mobile || "",
                  telegram: "",
                  donationAccounts: [],
                };
                set({ user: mockUser, isAuthenticated: true });
                return true;
              }
            }
            return false;
          }

          set({ user: found, isAuthenticated: true });
          return true;
        } catch {
          return false;
        }
      },

      signup: async (data: SignupData) => {
        try {
          // TODO: Replace with actual API call
          // const res = await fetch(`${API_BASE}/api/auth/signup`, {
          //   method: "POST",
          //   headers: { "Content-Type": "application/json" },
          //   body: JSON.stringify(data),
          // });
          // const json = await res.json();
          // if (!res.ok) throw new Error(json.message);
          // set({ user: json.user, isAuthenticated: true });
          // return true;

          // Mock signup — store in localStorage for later login
          await new Promise((r) => setTimeout(r, 500));

          const registeredRaw = localStorage.getItem("hugg_registered_users");
          const registered: Array<SignupData & { registeredAt: string }> =
            registeredRaw ? JSON.parse(registeredRaw) : [];

          const alreadyExists = registered.some(
            (u) => u.email === data.email || u.mobile === data.mobile,
          );
          if (alreadyExists) return false;

          registered.push({ ...data, registeredAt: new Date().toISOString() });
          localStorage.setItem(
            "hugg_registered_users",
            JSON.stringify(registered),
          );

          const mockUser: UserProfile = {
            id: `user-${Date.now()}`,
            fullName: data.fullName,
            christianName: data.christianName || "",
            campus: "",
            dorm: "",
            languages: [],
            talents: [],
            services: [],
            avatar: "",
            email: data.email,
            phone: data.mobile || "",
            telegram: "",
            donationAccounts: [],
          };
          set({ user: mockUser, isAuthenticated: true });
          return true;
        } catch {
          return false;
        }
      },

      logout: () => {
        set({ user: null, isAuthenticated: false });
      },
    }),
    {
      name: "hugg-auth-store",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);
