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
  emailOrUsername?: string;
  gender?: string;
  age?: string;
  campus: string;
  dorm: string;
  languages: string[];
  talents: string[];
  services: string[];
  avatar: string;
  email: string;
  phone: string;
  telegram: string;
  sectionId?: string | number | null;
  section?: {
    id: string | number;
    name: string;
  } | null;
  isActive?: boolean;
  donationAccounts: DonationAccount[];
  region?: string;
  zone?: string;
  woreda?: string;
  fieldOfStudy?: string;
  previousParticipation?: string;
  localChurch?: string;
  ordination?: string;
  ordinationYear?: string;
  diocese?: string;
  bishop?: string;
  talentDescription?: string;
  password?: string; // Optional — only used during auth flow, never persisted to UI state
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
