import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Users,
  CalendarCheck2,
  ShoppingBag,
  TrendingUp,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { apiClient } from "../../lib/api/client";
// CardSkeleton used inline via skeleton-shimmer class
import { cn } from "../../lib/utils";

/* ── Animated Counter ── */
function AnimatedCount({ value, duration = 1.2 }) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = parseInt(value, 10) || 0;
    if (start === end) return;
    const step = end / (duration * 60);
    const timer = setInterval(() => {
      start += step;
      if (start >= end) {
        setDisplay(end);
        clearInterval(timer);
      } else {
        setDisplay(Math.floor(start));
      }
    }, 1000 / 60);
    return () => clearInterval(timer);
  }, [value, duration]);

  return <span>{display.toLocaleString()}</span>;
}

/* ── Stat Card ── */
function StatCard({ label, value, icon: Icon, gradient, trend, loading }) {
  if (loading) {
    return (
      <div className="stat-card bg-ink-900/40 h-32 animate-pulse" />
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className={cn("stat-card", gradient)}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 border border-white/10">
          <Icon className="h-5 w-5 text-ink-300" />
        </div>
        {trend !== undefined && (
          <span className="flex items-center gap-0.5 text-xs font-semibold text-accent-emerald">
            <ArrowUpRight className="h-3.5 w-3.5" />
            {trend}%
          </span>
        )}
      </div>
      <p className="font-display text-3xl font-bold text-ink-50">
        <AnimatedCount value={value} />
      </p>
      <p className="mt-1 text-sm text-ink-500">{label}</p>
    </motion.div>
  );
}

/* ── Status Badge ── */
function StatusBadge({ status }) {
  const map = {
    pending: { cls: "status-pending", icon: Clock, label: "Pending" },
    confirmed: { cls: "status-confirmed", icon: CheckCircle2, label: "Confirmed" },
    completed: { cls: "status-completed", icon: CheckCircle2, label: "Completed" },
    cancelled: { cls: "status-cancelled", icon: AlertCircle, label: "Cancelled" },
  };
  const s = map[status?.toLowerCase()] || map.pending;
  const Icon = s.icon;

  return (
    <span className={s.cls}>
      <Icon className="h-2.5 w-2.5" />
      {s.label}
    </span>
  );
}

/* ── Recent Table ── */
function RecentTable({ title, viewAllLink, headers, rows, loading, emptyMessage }) {
  return (
    <div className="surface-card overflow-hidden">
      <div className="flex items-center justify-between border-b border-ink-800 px-5 py-4">
        <h3 className="font-display text-sm font-semibold text-ink-100">{title}</h3>
        <Link
          to={viewAllLink}
          className="flex items-center gap-1 text-xs font-medium text-brand-400 hover:text-brand-300 transition"
        >
          View all <ArrowUpRight className="h-3 w-3" />
        </Link>
      </div>

      {loading ? (
        <div className="p-5 space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="skeleton-shimmer h-8 w-full" />
          ))}
        </div>
      ) : rows.length === 0 ? (
        <div className="py-10 text-center">
          <p className="text-sm text-ink-600">{emptyMessage}</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                {headers.map((h) => (
                  <th key={h}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <motion.tr
                  key={i}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.04 }}
                >
                  {row.map((cell, j) => (
                    <td key={j}>{cell}</td>
                  ))}
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

/* ── Main Dashboard ── */
const Dashboard = () => {
  const [data, setData] = useState({ users: [], appointments: [], orders: [] });
  const [counts, setCounts] = useState({ users: 0, appointments: 0, orders: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [uRes, aRes, oRes] = await Promise.all([
          apiClient.get("/users"),
          apiClient.get("/appointments"),
          apiClient.get("/orders"),
        ]);

        const users = uRes.data || [];
        const appts = aRes.data || [];
        const orders = oRes.data || [];

        setCounts({ users: users.length, appointments: appts.length, orders: orders.length });
        setData({
          users: users.slice(0, 5),
          appointments: appts.slice(0, 5),
          orders: orders.slice(0, 5),
        });
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const stats = [
    { label: "Total Users", value: counts.users, icon: Users, gradient: "stat-card-blue", trend: 12 },
    { label: "Appointments", value: counts.appointments, icon: CalendarCheck2, gradient: "stat-card-emerald", trend: 8 },
    { label: "Total Orders", value: counts.orders, icon: ShoppingBag, gradient: "stat-card-violet", trend: 5 },
    { label: "Revenue", value: data.orders.reduce((s, o) => s + (o.totalAmount || 0), 0).toFixed(0), icon: TrendingUp, gradient: "stat-card-amber", trend: 18 },
  ];

  return (
    <div className="min-h-screen bg-mesh-admin p-6 lg:p-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-8"
      >
        <h1 className="font-display text-2xl font-bold text-ink-50 sm:text-3xl">
          Admin Dashboard
        </h1>
        <p className="mt-1 text-sm text-ink-500">
          Welcome back — here's what's happening at AutoFixHub.
        </p>
      </motion.div>

      {/* Stats Grid */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((s) => (
          <StatCard key={s.label} {...s} loading={loading} />
        ))}
      </div>

      {/* Recent Tables */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent Appointments */}
        <RecentTable
          title="Recent Appointments"
          viewAllLink="/admin/appointments"
          headers={["Date", "Time", "Status"]}
          loading={loading}
          emptyMessage="No appointments yet."
          rows={data.appointments.map((a) => [
            new Date(a.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
            a.time || "—",
            <StatusBadge key={a._id} status={a.status} />,
          ])}
        />

        {/* Recent Users */}
        <RecentTable
          title="Recent Users"
          viewAllLink="/admin/users"
          headers={["Username", "Email", "Role"]}
          loading={loading}
          emptyMessage="No users yet."
          rows={data.users.map((u) => [
            <span key={u._id} className="font-medium text-ink-200">{u.username}</span>,
            <span className="text-ink-500 text-xs">{u.email}</span>,
            <span className={cn("status-badge", u.isAdmin ? "status-confirmed" : "status-pending")}>
              {u.isAdmin ? "Admin" : u.isMechanic ? "Mechanic" : "Customer"}
            </span>,
          ])}
        />

        {/* Recent Orders */}
        <RecentTable
          title="Recent Orders"
          viewAllLink="/admin/orders"
          headers={["Customer", "Amount", "Status"]}
          loading={loading}
          emptyMessage="No orders yet."
          rows={data.orders.map((o) => [
            <span key={o._id} className="font-medium text-ink-200">{o.user?.username || "Unknown"}</span>,
            <span className="font-semibold text-accent-emerald">${(o.totalAmount || 0).toFixed(2)}</span>,
            <StatusBadge key={o._id} status={o.status} />,
          ])}
        />

        {/* Quick Actions */}
        <div className="surface-card p-5">
          <h3 className="font-display text-sm font-semibold text-ink-100 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Add Service", to: "/admin/services", icon: CalendarCheck2 },
              { label: "Add Product", to: "/admin/products", icon: ShoppingBag },
              { label: "View Users", to: "/admin/users", icon: Users },
              { label: "Analytics", to: "/admin/analytics", icon: TrendingUp },
            ].map(({ label, to, icon: Icon }) => (
              <Link
                key={label}
                to={to}
                className="flex items-center gap-2.5 rounded-xl border border-ink-800 bg-ink-900/40 p-3.5 text-sm font-medium text-ink-300 transition hover:border-ink-700 hover:bg-ink-800/60 hover:text-ink-100"
              >
                <Icon className="h-4 w-4 text-brand-400" />
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
