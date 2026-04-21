import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { UserProfile } from "../types";
import type { RegistrationForm } from "../pages/RegistrationPage";

interface AuthState {
  user: UserProfile | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (emailOrUsername: string, password: string) => Promise<boolean>;
  loginWithToken: (token: string) => Promise<boolean>;
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

const buildApiUrl = (path: string): string => {
  const base = API_BASE.replace(/\/+$/, "");

  if (base.endsWith("/api") && path.startsWith("/api/")) {
    return `${base}${path.slice(4)}`;
  }

  return `${base}${path}`;
};

const api = async <T>(path: string, body: unknown, token?: string, method = "POST"): Promise<T> => {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
    "X-Requested-With": "XMLHttpRequest",
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(buildApiUrl(path), {
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

  const res = await fetch(buildApiUrl(path), { headers });
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

      loginWithToken: async (token: string) => {
        const data = await apiGet<{ member: UserProfile }>("/api/auth/me", token);
        set({ user: data.member, token, isAuthenticated: true });
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

        const formData = new FormData();
        const appendIfPresent = (key: string, value: string | null | undefined) => {
          if (value !== undefined && value !== null && value !== "") {
            formData.append(key, value);
          }
        };

        appendIfPresent("full_name", data.fullName);
        appendIfPresent("christian_name", data.christianName);
        appendIfPresent("gender", data.gender);
        appendIfPresent("age", data.age);
        appendIfPresent("campus", data.campus);
        appendIfPresent("field_of_study", data.fieldOfStudy);
        appendIfPresent("dorm", data.dorm);
        appendIfPresent("region", data.region);
        appendIfPresent("zone", data.zone);
        appendIfPresent("woreda", data.woreda);
        appendIfPresent("native_language", data.nativeLanguage);
        appendIfPresent("extra_languages", data.extraLanguages);
        appendIfPresent("previous_participation", data.previousParticipation);
        appendIfPresent("local_church", data.localChurch);
        appendIfPresent("ordination", data.ordination);
        appendIfPresent("ordination_year", data.ordinationYear);
        appendIfPresent("diocese", data.diocese);
        appendIfPresent("bishop", data.bishop);
        appendIfPresent("talent_description", data.talentDescription);
        appendIfPresent("mobile", data.mobile);
        appendIfPresent("telegram", data.telegram);

        data.serviceDepartments.forEach((item) => formData.append("service_departments[]", item));
        data.talents.forEach((item) => formData.append("talents[]", item));

        if (data.profilePhotoFile) {
          formData.append("profile_photo", data.profilePhotoFile);
        }

        const res = await fetch(buildApiUrl(`/api/members/${state.user.id}/profile`), {
          method: "PATCH",
          headers: {
            Accept: "application/json",
            "X-Requested-With": "XMLHttpRequest",
            Authorization: `Bearer ${state.token}`,
          },
          body: formData,
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
          throw new Error(firstFieldErrors?.[0] ?? payload.message ?? "Request failed");
        }

        const response = json as { member: UserProfile };
        set({ user: response.member });
        return true;
      },

      logout: async () => {
        const token = get().token;
        try {
          await api("/api/auth/logout", {}, token ?? undefined, "POST");
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
