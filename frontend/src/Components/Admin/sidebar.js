import React, { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Wrench,
  LayoutDashboard,
  Users,
  CalendarCheck2,
  ShoppingBag,
  ChevronRight,
  LogOut,
  User,
  Bell,
  BarChart3,
  Stethoscope,
  ClipboardList,
} from "lucide-react";
import { cn } from "../../lib/utils";
import { useAuthStore } from "../../store/useAuthStore";

/* ── Navigation config ── */
const adminNavGroups = [
  {
    label: "Overview",
    items: [
      { to: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
      { to: "/admin/analytics", label: "Analytics", icon: BarChart3 },
    ],
  },
  {
    label: "Management",
    items: [
      { to: "/admin/users", label: "Users", icon: Users },
      {
        label: "Appointments",
        icon: CalendarCheck2,
        children: [
          { to: "/admin/appointments", label: "All Appointments" },
          { to: "/admin/services", label: "Manage Services" },
        ],
      },
      {
        label: "Shop",
        icon: ShoppingBag,
        children: [
          { to: "/admin/orders", label: "Orders" },
          { to: "/admin/products", label: "Products" },
        ],
      },
    ],
  },
  {
    label: "Tools",
    items: [
      { to: "/ai-diagnostics", label: "AI Diagnostics", icon: Stethoscope },
    ],
  },
];

const mechanicNavGroups = [
  {
    label: "Overview",
    items: [
      { to: "/mechanic/dashboard", label: "Dashboard", icon: LayoutDashboard },
    ],
  },
  {
    label: "Work",
    items: [
      { to: "/mechanic/appointments", label: "My Appointments", icon: CalendarCheck2 },
      { to: "/mechanic/worklog", label: "Work Log", icon: ClipboardList },
    ],
  },
];

/* ── Sidebar Nav Item ── */
function SidebarItem({ item, collapsed }) {
  const [open, setOpen] = useState(false);
  const hasChildren = !!item.children;
  const Icon = item.icon;

  if (hasChildren) {
    return (
      <div>
        <button
          onClick={() => setOpen((o) => !o)}
          className={cn(
            "sidebar-link w-full justify-between",
            open && "text-ink-200"
          )}
        >
          <span className="flex items-center gap-3">
            <Icon className="h-4 w-4 flex-shrink-0" />
            {!collapsed && <span>{item.label}</span>}
          </span>
          {!collapsed && (
            <motion.span
              animate={{ rotate: open ? 90 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronRight className="h-3.5 w-3.5 text-ink-600" />
            </motion.span>
          )}
        </button>

        <AnimatePresence initial={false}>
          {open && !collapsed && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.22, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <div className="ml-7 mt-1 space-y-0.5 border-l border-ink-800 pl-3">
                {item.children.map((child) => (
                  <NavLink
                    key={child.to}
                    to={child.to}
                    className={({ isActive }) =>
                      cn(
                        "block rounded-lg px-3 py-2 text-xs font-medium transition-colors duration-150",
                        isActive
                          ? "text-brand-300 bg-brand-500/10"
                          : "text-ink-500 hover:text-ink-200 hover:bg-white/5"
                      )
                    }
                  >
                    {child.label}
                  </NavLink>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <NavLink
      to={item.to}
      className={({ isActive }) =>
        cn(isActive ? "sidebar-link-active" : "sidebar-link", collapsed && "justify-center px-0")
      }
      title={collapsed ? item.label : undefined}
    >
      {({ isActive }) => (
        <>
          {isActive && (
            <motion.span
              layoutId="active-pill"
              className="absolute inset-0 rounded-xl bg-brand-500/10"
              transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
            />
          )}
          <Icon className={cn("h-4 w-4 flex-shrink-0 relative z-10", isActive && "text-brand-400")} />
          {!collapsed && <span className="relative z-10">{item.label}</span>}
          {isActive && !collapsed && (
            <span className="ml-auto h-1.5 w-1.5 rounded-full bg-brand-400 relative z-10" />
          )}
        </>
      )}
    </NavLink>
  );
}

/* ── Main Sidebar ── */
const Sidebar = ({ profileImage, username }) => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const { clearSession, role } = useAuthStore();

  const navGroups = role === "admin" ? adminNavGroups : mechanicNavGroups;

  const handleLogout = () => {
    clearSession();
    navigate("/login");
  };

  return (
    <motion.aside
      animate={{ width: collapsed ? 72 : 260 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className="fixed left-0 top-0 z-40 flex h-screen flex-col bg-sidebar-gradient border-r border-ink-800/60 overflow-hidden"
    >
      {/* ── Top: Logo + Collapse Toggle ── */}
      <div className={cn("flex h-16 items-center border-b border-ink-800/60 px-4 flex-shrink-0", collapsed ? "justify-center" : "justify-between")}>
        <AnimatePresence mode="wait">
          {!collapsed ? (
            <motion.div
              key="full-logo"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <Link to={role === "admin" ? "/admin/dashboard" : "/mechanic/dashboard"} className="flex items-center gap-2.5">
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-brand-500/20 text-brand-400">
                  <Wrench className="h-4 w-4" strokeWidth={2.25} />
                </span>
                <span className="font-display text-base font-bold tracking-tight text-white">
                  AutoFixHub
                </span>
              </Link>
            </motion.div>
          ) : (
            <motion.div
              key="icon-logo"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-brand-500/20 text-brand-400">
                <Wrench className="h-4 w-4" strokeWidth={2.25} />
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {!collapsed && (
          <button
            onClick={() => setCollapsed(true)}
            className="rounded-lg p-1.5 text-ink-600 hover:bg-white/5 hover:text-ink-300 transition"
            title="Collapse sidebar"
          >
            <ChevronRight className="h-4 w-4 rotate-180" />
          </button>
        )}
      </div>

      {/* ── Scrollable Nav ── */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden py-4 px-2 space-y-5">
        {collapsed && (
          <button
            onClick={() => setCollapsed(false)}
            className="flex w-full items-center justify-center rounded-xl py-2 text-ink-600 hover:bg-white/5 hover:text-ink-300 transition"
            title="Expand sidebar"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        )}

        {navGroups.map((group) => (
          <div key={group.label}>
            {!collapsed && (
              <p className="sidebar-section-label mb-1">{group.label}</p>
            )}
            <div className="space-y-0.5">
              {group.items.map((item) => (
                <SidebarItem key={item.label} item={item} collapsed={collapsed} />
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* ── Bottom: Profile + Logout ── */}
      <div className="flex-shrink-0 border-t border-ink-800/60 p-3 space-y-1">
        {/* Notification Bell */}
        {!collapsed && (
          <Link
            to="/profile"
            className="sidebar-link"
          >
            <Bell className="h-4 w-4 flex-shrink-0" />
            <span>Notifications</span>
          </Link>
        )}

        {/* Profile link */}
        <Link
          to="/profile"
          className={cn("sidebar-link", collapsed && "justify-center px-0")}
          title={collapsed ? username || "Profile" : undefined}
        >
          {profileImage ? (
            <img
              src={profileImage}
              alt="Profile"
              className="h-6 w-6 rounded-full object-cover ring-1 ring-ink-700 flex-shrink-0"
            />
          ) : (
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-ink-800 text-ink-400 flex-shrink-0">
              <User className="h-3.5 w-3.5" />
            </span>
          )}
          {!collapsed && (
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-semibold text-ink-200">
                {username || "Account"}
              </p>
              <p className="text-[10px] text-ink-600 capitalize">{role}</p>
            </div>
          )}
        </Link>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className={cn("sidebar-link text-accent-rose/70 hover:text-accent-rose hover:bg-accent-rose/10", collapsed && "justify-center px-0")}
          title={collapsed ? "Sign out" : undefined}
        >
          <LogOut className="h-4 w-4 flex-shrink-0" />
          {!collapsed && <span>Sign out</span>}
        </button>
      </div>
    </motion.aside>
  );
};

export default Sidebar;
