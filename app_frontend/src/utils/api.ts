import type {
  Post,
  EventItem,
  FamilyGroup,
  AppNotification,
  UserProfile,
} from "../types";

export interface SignupApiPayload {
  full_name: string;
  username: string;
  password: string;
  password_confirmation: string;
  christian_name?: string;
  mobile?: string;
  email_or_username?: string;
  gender?: string;
  age?: string;
}

const API_BASE = import.meta.env.VITE_API_BASE || "";

/** Generic API caller with JSON serialization */
async function api<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const url = `${API_BASE}${endpoint}`;
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json", ...options.headers },
    ...options,
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(error.message || "API request failed");
  }
  return res.json() as Promise<T>;
}

/* ------------------------------------------------------------------ */
/*  Auth API (mock now, real later)                                   */
/* ------------------------------------------------------------------ */

export interface LoginPayload {
  username: string;
  password: string;
}

export interface LoginResponse {
  user: UserProfile;
  token?: string;
}

export interface SignupResponse {
  user: UserProfile;
  token?: string;
}

export const authApi = {
  login: (payload: LoginPayload) =>
    api<LoginResponse>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  signup: (payload: SignupApiPayload) =>
    api<SignupResponse>("/api/auth/signup", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  logout: () => api<void>("/api/auth/logout", { method: "POST" }),

  getMe: () => api<UserProfile>("/api/auth/me"),
};

/* ------------------------------------------------------------------ */
/*  Posts / News API                                                  */
/* ------------------------------------------------------------------ */

export const postsApi = {
  getAll: () => api<Post[]>("/api/posts"),
  getById: (id: string) => api<Post>(`/api/posts/${id}`),
  getByDepartment: (dept: string) =>
    api<Post[]>(`/api/posts?department=${encodeURIComponent(dept)}`),
};

/* ------------------------------------------------------------------ */
/*  Events API                                                         */
/* ------------------------------------------------------------------ */

export const eventsApi = {
  getAll: () => api<EventItem[]>("/api/events"),
  getByDate: (date: string) => api<EventItem[]>(`/api/events?date=${date}`),
  getByDepartment: (dept: string) =>
    api<EventItem[]>(`/api/events?department=${encodeURIComponent(dept)}`),
};

/* ------------------------------------------------------------------ */
/*  Family API                                                         */
/* ------------------------------------------------------------------ */

export const familyApi = {
  getGroup: () => api<FamilyGroup>("/api/family"),
};

/* ------------------------------------------------------------------ */
/*  Notifications API                                                  */
/* ------------------------------------------------------------------ */

export const notificationsApi = {
  getAll: () => api<AppNotification[]>("/api/notifications"),
  markRead: (id: string) =>
    api<AppNotification>(`/api/notifications/${id}/read`, { method: "PATCH" }),
  markAllRead: () => api<AppNotification[]>("/api/notifications/read-all", { method: "PATCH" }),
};

/* ------------------------------------------------------------------ */
/*  Users API                                                          */
/* ------------------------------------------------------------------ */

export const usersApi = {
  getAll: () => api<UserProfile[]>("/api/users"),
  getById: (id: string) => api<UserProfile>(`/api/users/${id}`),
  updateProfile: (id: string, data: Partial<UserProfile>) =>
    api<UserProfile>(`/api/users/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),
};

/* ------------------------------------------------------------------ */
/*  Mock data fetcher (falls back to local JSON when no API server)   */
/* ------------------------------------------------------------------ */

const mockFetch = async <T>(path: string): Promise<T> => {
  // When VITE_API_BASE is set, this will hit the real server.
  // Otherwise, fall back to the bundled JSON files.
  const res = await fetch(path);
  if (!res.ok) throw new Error(`Failed to fetch ${path}`);
  return res.json() as Promise<T>;
};

export const mockApi = {
  posts: () => mockFetch<Post[]>("/data/posts.json"),
  events: () => mockFetch<EventItem[]>("/data/events.json"),
  family: () => mockFetch<FamilyGroup>("/data/family.json"),
  notifications: () => mockFetch<AppNotification[]>("/data/notifications.json"),
  users: () => mockFetch<UserProfile[]>("/data/users.json"),
};
