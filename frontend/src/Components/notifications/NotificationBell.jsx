import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Bell } from "lucide-react";
import { Dropdown } from "../ui";
import { useNotificationStore } from "../../store/useNotificationStore";

export function NotificationBell({ collapsed }) {
  const items = useNotificationStore((s) => s.items);
  const unread = useNotificationStore((s) => s.unread);
  const markAllRead = useNotificationStore((s) => s.markAllRead);
  const [openHint] = useState(true);

  if (collapsed) {
    return (
      <div className="relative flex justify-center py-2">
        <Bell className="h-4 w-4 text-ink-400" />
        {unread > 0 && <span className="notification-dot">{unread > 9 ? "9+" : unread}</span>}
      </div>
    );
  }

  return (
    <Dropdown
      label={
        <span className="relative inline-flex items-center gap-2">
          <Bell className="h-4 w-4" />
          Notifications
          {unread > 0 && (
            <span className="rounded-full bg-accent-rose px-1.5 text-[10px] font-bold text-white">
              {unread}
            </span>
          )}
        </span>
      }
      className="w-full"
    >
      <div className="max-h-72 w-72 overflow-y-auto p-1">
        <button
          type="button"
          onClick={markAllRead}
          className="mb-1 w-full rounded-lg px-2 py-1 text-left text-[11px] text-ink-500 hover:bg-white/5"
        >
          Mark all read
        </button>
        {items.length === 0 && (
          <p className="px-3 py-6 text-center text-xs text-ink-500">
            Live alerts will appear here.
          </p>
        )}
        {items.map((n) => (
          <Link
            key={n.id}
            to={n.href || "/admin/dashboard"}
            className="block rounded-lg px-3 py-2 hover:bg-white/5"
          >
            <p className="text-xs font-semibold text-ink-100">{n.title}</p>
            <p className="text-[11px] text-ink-400">{n.message}</p>
          </Link>
        ))}
      </div>
    </Dropdown>
  );
}

export default NotificationBell;
