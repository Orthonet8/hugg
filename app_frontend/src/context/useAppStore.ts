import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { initialNotifications } from "../data";
import type { AppNotification } from "../types";

const toggleInArray = (items: string[], id: string): string[] =>
  items.includes(id) ? items.filter((item) => item !== id) : [...items, id];

const todayIso = new Date().toISOString().split("T")[0];

interface AppStoreState {
  likedPosts: string[];
  savedPosts: string[];
  selectedDate: string;
  notifications: AppNotification[];
  toggleLikePost: (postId: string) => void;
  toggleSavePost: (postId: string) => void;
  setSelectedDate: (dateIso: string) => void;
  markNotificationRead: (notificationId: string) => void;
  markAllNotificationsRead: () => void;
}

export const useAppStore = create<AppStoreState>()(
  persist(
    (set) => ({
      likedPosts: [],
      savedPosts: [],
      selectedDate: todayIso,
      notifications: initialNotifications,
      toggleLikePost: (postId: string) =>
        set((state) => ({
          likedPosts: toggleInArray(state.likedPosts, postId),
        })),
      toggleSavePost: (postId: string) =>
        set((state) => ({
          savedPosts: toggleInArray(state.savedPosts, postId),
        })),
      setSelectedDate: (dateIso: string) => set({ selectedDate: dateIso }),
      markNotificationRead: (notificationId: string) =>
        set((state) => ({
          notifications: state.notifications.map((notification) =>
            notification.id === notificationId
              ? { ...notification, read: true }
              : notification,
          ),
        })),
      markAllNotificationsRead: () =>
        set((state) => ({
          notifications: state.notifications.map((notification) => ({
            ...notification,
            read: true,
          })),
        })),
    }),
    {
      name: "church-student-pwa-store",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        likedPosts: state.likedPosts,
        savedPosts: state.savedPosts,
        selectedDate: state.selectedDate,
        notifications: state.notifications,
      }),
      merge: (persistedState, currentState) => {
        const typedPersisted = persistedState as Partial<AppStoreState>;

        return {
          ...currentState,
          ...typedPersisted,
          notifications:
            typedPersisted.notifications &&
            typedPersisted.notifications.length > 0
              ? typedPersisted.notifications
              : currentState.notifications,
        };
      },
    },
  ),
);
