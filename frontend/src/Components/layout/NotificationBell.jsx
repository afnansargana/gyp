import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Bell } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useNotificationStore } from "../../store/useNotificationStore";
import { cn } from "../../lib/utils";

export function NotificationBell({ collapsed = false }) {
  const { items, unread, markAllRead } = useNotificationStore();
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => {
          setOpen((v) => !v);
          markAllRead();
        }}
        className={cn("sidebar-link", collapsed && "justify-center px-0")}
      >
        <span className="relative">
          <Bell className="h-4 w-4" />
          {unread > 0 && <span className="notification-dot">{unread > 9 ? "9+" : unread}</span>}
        </span>
        {!collapsed && <span>Notifications</span>}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.96 }}
            className="absolute bottom-12 left-0 z-50 w-72 rounded-xl border border-ink-700 bg-ink-900/95 p-2 shadow-glass backdrop-blur-xl"
          >
            {items.length === 0 ? (
              <p className="px-3 py-6 text-center text-xs text-ink-500">
                No live alerts yet.
              </p>
            ) : (
              items.slice(0, 8).map((n) => (
                <Link
                  key={n.id}
                  to={n.href || "/"}
                  onClick={() => setOpen(false)}
                  className="block rounded-lg px-3 py-2 hover:bg-white/5"
                >
                  <p className="text-xs font-semibold text-ink-100">{n.title}</p>
                  <p className="text-[11px] text-ink-400">{n.message}</p>
                </Link>
              ))
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default NotificationBell;
