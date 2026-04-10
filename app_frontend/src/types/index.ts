export type Department = "ትምህርት" | "መዝሙር" | "ልማት" | "አባላት ጉዳይ" | "ፋይናንስ";

export type NotificationType = "news" | "event";

export interface DonationAccount {
  bankName: string;
  accountNumber: string;
  accountHolder: string;
}

export interface UserProfile {
  id: string;
  fullName: string;
  christianName: string;
  campus: string;
  dorm: string;
  languages: string[];
  talents: string[];
  services: string[];
  avatar: string;
  email: string;
  phone: string;
  telegram: string;
  donationAccounts: DonationAccount[];
}

export interface Post {
  id: string;
  title: string;
  content: string;
  department: Department;
  author: string;
  publishedAt: string;
  imageUrls: string[];
}

export interface EventItem {
  id: string;
  title: string;
  description: string;
  department: Department;
  date: string;
  time: string;
  location: string;
}

export interface FamilyMember {
  id: string;
  name: string;
  role: "መሪ" | "አባል";
  service: Department;
  contact: string;
  note?: string;
}

export interface FamilyGroup {
  groupName: string;
  leaderId: string;
  members: FamilyMember[];
}

export interface AppNotification {
  id: string;
  type: NotificationType;
  message: string;
  timestamp: string;
  read: boolean;
  referenceId?: string;
}
