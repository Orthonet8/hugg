import { useMemo } from "react";
import { useAppStore } from "../context/useAppStore";

export const useUnreadNotificationsCount = (): number => {
  const notifications = useAppStore((state) => state.notifications);

  return useMemo(
    () => notifications.filter((notification) => !notification.read).length,
    [notifications],
  );
};
