import eventsData from "./events.json";
import familyData from "./family.json";
import notificationsData from "./notifications.json";
import postsData from "./posts.json";
import usersData from "./users.json";
import { registrationSlides } from "./registrationSlides";
import type {
  AppNotification,
  EventItem,
  FamilyGroup,
  Post,
  UserProfile,
} from "../types";

export const users = usersData as UserProfile[];
export const posts = postsData as Post[];
export const events = eventsData as EventItem[];
export const familyGroup = familyData as FamilyGroup;
export const initialNotifications = notificationsData as AppNotification[];
export { registrationSlides };
