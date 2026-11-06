import type { Supporter, SupportTicket, SupportChatMessage } from "../types/support";

const API_BASE = import.meta.env.VITE_API_BASE ?? "";

const buildApiUrl = (path: string): string => {
  const base = API_BASE.replace(/\/+$/, "");
  if (base.endsWith("/api") && path.startsWith("/api/")) {
    return `${base}${path.slice(4)}`;
  }
  return `${base}${path}`;
};

export const supportApi = {
  getSupporters: async (sector?: string): Promise<{ supporters: Supporter[] }> => {
    const url = sector
      ? `/api/support/supporters?sector=${encodeURIComponent(sector)}`
      : "/api/support/supporters";
    const res = await fetch(buildApiUrl(url), {
      headers: { Accept: "application/json" },
    });
    if (!res.ok) throw new Error("Failed to load supporters");
    return res.json();
  },

  getTickets: async (token: string): Promise<{ tickets: SupportTicket[] }> => {
    const res = await fetch(buildApiUrl("/api/support/tickets"), {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) throw new Error("Failed to load support requests");
    return res.json();
  },

  getTicket: async (ticketId: number, token: string): Promise<{ ticket: SupportTicket }> => {
    const res = await fetch(buildApiUrl(`/api/support/tickets/${ticketId}`), {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) throw new Error("Failed to load ticket details");
    return res.json();
  },

  createTicket: async (
    data: {
      subject: string;
      sector: string;
      message?: string;
      assigned_user_id?: number;
      attachment?: File;
    },
    token: string,
  ): Promise<{ ticket: SupportTicket }> => {
    const formData = new FormData();
    formData.append("subject", data.subject);
    formData.append("sector", data.sector);
    if (data.message) formData.append("message", data.message);
    if (data.assigned_user_id) formData.append("assigned_user_id", String(data.assigned_user_id));
    if (data.attachment) formData.append("attachment", data.attachment);

    const res = await fetch(buildApiUrl("/api/support/tickets"), {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ message: "Failed to create ticket" }));
      throw new Error(err.message || "Failed to submit request");
    }
    return res.json();
  },

  sendMessage: async (
    ticketId: number,
    data: {
      message?: string;
      attachment?: File;
    },
    token: string,
  ): Promise<{ chat_message: SupportChatMessage }> => {
    const formData = new FormData();
    if (data.message) formData.append("message", data.message);
    if (data.attachment) formData.append("attachment", data.attachment);

    const res = await fetch(buildApiUrl(`/api/support/tickets/${ticketId}/messages`), {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ message: "Failed to send message" }));
      throw new Error(err.message || "Failed to send message");
    }
    return res.json();
  },
};
