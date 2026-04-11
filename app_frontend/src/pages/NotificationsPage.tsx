import clsx from "clsx";
import { motion } from "framer-motion";
import { CheckCheck } from "lucide-react";
import { useMemo, useState } from "react";
import { Card } from "../components/common/Card";
import { PageHeader } from "../components/common/PageHeader";
import { useAppStore } from "../context/useAppStore";
import { notificationTypeLabel } from "../utils/theme";
import { useI18n } from "../i18n/I18nProvider";

export const NotificationsPage = () => {
  const { t } = useI18n();
  const [activeFilter, setActiveFilter] = useState<"all" | "unread">("all");

  const notifications = useAppStore((state) => state.notifications);
  const markNotificationRead = useAppStore((state) => state.markNotificationRead);
  const markAllNotificationsRead = useAppStore((state) => state.markAllNotificationsRead);

  const filteredNotifications = useMemo(() => {
    const byFilter =
      activeFilter === "unread"
        ? notifications.filter((notification) => !notification.read)
        : notifications;

    return [...byFilter].sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
    );
  }, [activeFilter, notifications]);

  return (
    <section className="space-y-4">
      <PageHeader
        title={t("notifications.title")}
        subtitle={t("notifications.subtitle")}
        hideNotification
        action={
          <button
            type="button"
            onClick={markAllNotificationsRead}
            className="app-subtle-panel inline-flex h-10 items-center gap-1 rounded-xl px-3 text-sm font-semibold text-[color:var(--primary)]"
          >
            <CheckCheck size={16} />
            {t("notifications.markAllRead")}
          </button>
        }
      />

      <Card className="p-4">
        <div className="app-subtle-panel flex gap-2 rounded-2xl p-1.5">
          <button
            type="button"
            data-active={activeFilter === "all"}
            onClick={() => setActiveFilter("all")}
            className="data-[active=true]:app-gradient flex-1 rounded-xl py-2 text-sm font-semibold text-[color:var(--text-muted)] data-[active=true]:text-[color:var(--on-primary)]"
          >
            {t("news.allNews")}
          </button>
          <button
            type="button"
            data-active={activeFilter === "unread"}
            onClick={() => setActiveFilter("unread")}
            className="data-[active=true]:app-gradient flex-1 rounded-xl py-2 text-sm font-semibold text-[color:var(--text-muted)] data-[active=true]:text-[color:var(--on-primary)]"
          >
            {t("notifications.unread")}
          </button>
        </div>
      </Card>

      <div className="space-y-3">
        {filteredNotifications.map((notification) => (
          <motion.button
            type="button"
            key={notification.id}
            onClick={() => markNotificationRead(notification.id)}
            whileTap={{ scale: 0.98 }}
            className={clsx(
              "w-full text-left",
              !notification.read && "ring-2 ring-[color:color-mix(in_srgb,var(--accent)_35%,transparent)]",
            )}
          >
            <Card className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <span className="app-subtle-panel rounded-full px-2.5 py-1 text-xs font-semibold text-[color:var(--primary)]">
                  {notificationTypeLabel[notification.type]}
                </span>
                {!notification.read ? (
                  <span className="h-2.5 w-2.5 rounded-full bg-[color:var(--status-unread)]" />
                ) : null}
              </div>

              <p className="text-sm text-[color:var(--text-primary)]">
                {notification.message}
              </p>
              <p className="text-xs text-[color:var(--text-muted)]">
                {new Date(notification.timestamp).toLocaleString("am-ET")}
              </p>
            </Card>
          </motion.button>
        ))}

        {filteredNotifications.length === 0 ? (
          <Card className="py-8 text-center">
            <p className="text-sm text-[color:var(--text-muted)]">
              {t("notifications.noNotifications")}
            </p>
          </Card>
        ) : null}
      </div>
    </section>
  );
};
