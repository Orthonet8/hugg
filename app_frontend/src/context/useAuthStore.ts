import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { UserProfile } from "../types";

interface AuthState {
  user: UserProfile | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (emailOrUsername: string, password: string) => Promise<boolean>;
  signup: (data: SignupPayload) => Promise<boolean>;
  logout: () => Promise<void>;
}

export interface SignupPayload {
  fullName: string;
  emailOrUsername: string;
  password: string;
  passwordConfirmation: string;
  christianName?: string;
  mobile?: string;
  gender?: string;
  age?: string;
}

const API_BASE = import.meta.env.VITE_API_BASE ?? "";

const api = async <T>(path: string, body: unknown, token?: string): Promise<T> => {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });

  const json = await res.json();
  if (!res.ok) throw new Error(json.message ?? "Request failed");
  return json;
};

const apiGet = async <T>(path: string, token?: string): Promise<T> => {
  const headers: Record<string, string> = {};
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${path}`, { headers });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message ?? "Request failed");
  return json;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      login: async (emailOrUsername: string, password: string) => {
        try {
          const data = await api<{ member: UserProfile; token: string }>("/api/auth/login", {
            email_or_username: emailOrUsername,
            password,
          });
          set({ user: data.member, token: data.token, isAuthenticated: true });
          return true;
        } catch {
          return false;
        }
      },

      signup: async (data: SignupPayload) => {
        try {
          const payload = {
            full_name: data.fullName,
            email_or_username: data.emailOrUsername,
            password: data.password,
            password_confirmation: data.passwordConfirmation,
            christian_name: data.christianName,
            mobile: data.mobile,
            gender: data.gender,
            age: data.age,
          };

          const res = await api<{ member: UserProfile; token: string }>("/api/auth/register", payload);
          set({ user: res.member, token: res.token, isAuthenticated: true });
          return true;
        } catch {
          return false;
        }
      },

      logout: async () => {
        const token = get().token;
        try {
          await apiGet("/api/auth/logout", token ?? undefined);
        } catch {
          // ignore logout errors
        }
        set({ user: null, token: null, isAuthenticated: false });
      },
    }),
    {
      name: "hugg-auth-store",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);
