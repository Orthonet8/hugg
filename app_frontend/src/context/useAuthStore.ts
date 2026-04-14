import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { UserProfile } from "../types";
import type { RegistrationForm } from "../pages/RegistrationPage";

interface AuthState {
  user: UserProfile | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (emailOrUsername: string, password: string) => Promise<boolean>;
  signup: (data: SignupPayload) => Promise<boolean>;
  updateProfile: (data: RegistrationForm) => Promise<boolean>;
  logout: () => Promise<void>;
}

export interface SignupPayload {
  fullName: string;
  emailOrUsername: string;
  password: string;
  passwordConfirmation: string;
  christianName?: string;
  mobile?: string;
  telegram?: string;
  gender?: string;
  age?: string;
}

const API_BASE = import.meta.env.VITE_API_BASE ?? "";

const api = async <T>(path: string, body: unknown, token?: string, method = "POST"): Promise<T> => {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
    "X-Requested-With": "XMLHttpRequest",
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: method !== "GET" ? JSON.stringify(body) : undefined,
  });

  const json = await res.json();
  if (!res.ok) {
    const payload = json as {
      message?: string;
      errors?: Record<string, string[] | undefined>;
    };

    const firstFieldErrors = payload.errors
      ? Object.values(payload.errors).find((messages) => Array.isArray(messages) && messages.length > 0)
      : undefined;

    const msg = firstFieldErrors?.[0] ?? payload.message;
    throw new Error(msg ?? "Request failed");
  }
  return json;
};

const apiGet = async <T>(path: string, token?: string): Promise<T> => {
  const headers: Record<string, string> = {
    Accept: "application/json",
    "X-Requested-With": "XMLHttpRequest",
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${path}`, { headers });
  const json = await res.json();
  if (!res.ok) {
    const payload = json as {
      message?: string;
      errors?: Record<string, string[] | undefined>;
    };
    const firstFieldErrors = payload.errors
      ? Object.values(payload.errors).find((messages) => Array.isArray(messages) && messages.length > 0)
      : undefined;

    throw new Error(firstFieldErrors?.[0] ?? payload.message ?? "Request failed");
  }
  return json;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      login: async (emailOrUsername: string, password: string) => {
        const data = await api<{ member: UserProfile; token: string }>("/api/auth/login", {
          email_or_username: emailOrUsername,
          password,
        });
        set({ user: data.member, token: data.token, isAuthenticated: true });
        return true;
      },

      signup: async (data: SignupPayload) => {
        const payload = {
          full_name: data.fullName,
          email_or_username: data.emailOrUsername,
          password: data.password,
          password_confirmation: data.passwordConfirmation,
          christian_name: data.christianName,
          mobile: data.mobile,
          telegram: data.telegram,
          gender: data.gender,
          age: data.age,
        };

        const res = await api<{ member: UserProfile; token: string }>("/api/auth/register", payload);
        set({ user: res.member, token: res.token, isAuthenticated: true });
        return true;
      },

      updateProfile: async (data: RegistrationForm) => {
        const state = get();
        if (!state.user || !state.token) return false;

        const payload = {
          full_name: data.fullName,
          christian_name: data.christianName,
          gender: data.gender,
          age: data.age,
          campus: data.campus,
          field_of_study: data.fieldOfStudy,
          dorm: data.dorm,
          region: data.region,
          zone: data.zone,
          woreda: data.woreda,
          native_language: data.nativeLanguage,
          extra_languages: data.extraLanguages,
          previous_participation: data.previousParticipation,
          local_church: data.localChurch,
          ordination: data.ordination,
          ordination_year: data.ordinationYear,
          diocese: data.diocese,
          bishop: data.bishop,
          service_departments: data.serviceDepartments,
          talents: data.talents,
          talent_description: data.talentDescription,
          mobile: data.mobile,
          telegram: data.telegram,
        };

        const res = await api<{ member: UserProfile }>(
          `/api/members/${state.user.id}/profile`,
          payload,
          state.token,
          "PATCH",
        );
        set({ user: res.member });
        return true;
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
