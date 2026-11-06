export interface Supporter {
  id: number;
  name: string;
  photo: string | null;
  phone: string | null;
  telegram_username: string | null;
  email: string | null;
  support_sectors: string[];
  support_bio: string | null;
}

export interface SupportChatMessage {
  id: number;
  sender_type: "member" | "user";
  message: string | null;
  attachment_url: string | null;
  attachment_type: "image" | "audio" | "video" | "file" | null;
  attachment_name: string | null;
  created_at: string;
}

export interface SupportTicket {
  id: number;
  subject: string;
  sector: string;
  status: "open" | "in_progress" | "resolved" | "closed";
  priority: "low" | "medium" | "high" | "urgent";
  created_at: string;
  last_message_at: string | null;
  supporter: Supporter | null;
  messages: SupportChatMessage[];
}
