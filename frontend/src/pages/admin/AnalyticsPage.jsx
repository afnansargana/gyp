import React, { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { apiClient } from "../../lib/api/client";
import { DashboardSkeleton } from "../../Components/ui";

export default function AnalyticsPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const { data: payload } = await apiClient.get("/analytics/overview");
        setData(payload);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-mesh-admin p-8">
        <DashboardSkeleton />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-mesh-admin p-6 lg:p-8 text-ink-100">
      <h1 className="font-display text-3xl font-bold text-ink-50">Analytics</h1>
      <p className="mt-1 text-sm text-ink-500">
        Revenue, demand, and mechanic workload.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          ["Revenue", `$${(data?.totals.revenue || 0).toFixed(0)}`],
          ["Orders", data?.totals.orders || 0],
          ["Appointments", data?.totals.appointments || 0],
          ["Mechanics", data?.totals.mechanics || 0],
        ].map(([label, value]) => (
          <div key={label} className="stat-card-blue">
            <p className="text-sm text-ink-400">{label}</p>
            <p className="mt-2 font-display text-3xl font-bold">{value}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="surface-card p-5">
          <h2 className="mb-4 font-display text-sm font-semibold">Monthly revenue</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data?.revenueByMonth || []}>
                <CartesianGrid stroke="rgba(148,163,184,0.15)" />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip />
                <Line type="monotone" dataKey="revenue" stroke="#22d3ee" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="surface-card p-5">
          <h2 className="mb-4 font-display text-sm font-semibold">Most requested services</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data?.topServices || []}>
                <CartesianGrid stroke="rgba(148,163,184,0.15)" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip />
                <Bar dataKey="count" fill="#10b981" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="surface-card p-5 lg:col-span-2">
          <h2 className="mb-4 font-display text-sm font-semibold">Mechanic workload</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data?.mechanicWorkload || []} layout="vertical">
                <CartesianGrid stroke="rgba(148,163,184,0.15)" />
                <XAxis type="number" stroke="#94a3b8" />
                <YAxis type="category" dataKey="name" stroke="#94a3b8" width={120} />
                <Tooltip />
                <Bar dataKey="jobs" fill="#8b5cf6" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
