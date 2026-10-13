import React, { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { apiClient } from "../../lib/api/client";
import { useAuthStore } from "../../store/useAuthStore";
import { EmptyState } from "../ui";

const MechanicDashboard = () => {
  const userId = useAuthStore((s) => s.userId);
  const [appointments, setAppointments] = useState([]);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const [jobs, analytics] = await Promise.all([
          apiClient.get(`/appointments/mechanic/${userId}`),
          apiClient.get("/analytics/mechanic"),
        ]);
        setAppointments(jobs.data || []);
        setStats(analytics.data);
      } catch (error) {
        console.error("Error fetching mechanic dashboard:", error);
      }
    };
    if (userId) load();
  }, [userId]);

  const handleUpdateStatus = async (appointmentId, newStatus) => {
    try {
      await apiClient.put(`/appointments/${appointmentId}/update-status`, {
        status: newStatus,
      });
      setAppointments((prev) =>
        prev.map((appointment) =>
          appointment._id === appointmentId
            ? { ...appointment, status: newStatus }
            : appointment
        )
      );
    } catch (error) {
      console.error("Error updating appointment status:", error);
    }
  };

  return (
    <div className="min-h-screen bg-mesh-admin p-6 lg:p-8 text-ink-100">
      <h1 className="font-display text-3xl font-bold text-ink-50">
        Mechanic dashboard
      </h1>
      <p className="mt-1 text-sm text-ink-500">Assigned jobs and workload.</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {[
          ["Assigned", stats?.totals.assigned || appointments.length],
          ["In progress", stats?.totals.assignedStatus || 0],
          ["Completed", stats?.totals.completed || 0],
        ].map(([label, value]) => (
          <div key={label} className="stat-card-emerald">
            <p className="text-sm text-ink-400">{label}</p>
            <p className="mt-2 font-display text-3xl font-bold">{value}</p>
          </div>
        ))}
      </div>

      {stats?.byService?.length > 0 && (
        <div className="surface-card mt-8 p-5">
          <h2 className="mb-4 font-display text-sm font-semibold">Jobs by service</h2>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.byService}>
                <CartesianGrid stroke="rgba(148,163,184,0.15)" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" />
                <Tooltip />
                <Bar dataKey="count" fill="#22d3ee" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      <div className="surface-card mt-8 overflow-hidden">
        {appointments.length === 0 ? (
          <EmptyState
            title="No jobs assigned"
            description="When an admin assigns an appointment, it will appear here live."
          />
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Service</th>
                <th>Date</th>
                <th>Time</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((appointment) => (
                <tr key={appointment._id}>
                  <td>{appointment.service?.name || "Service"}</td>
                  <td>{new Date(appointment.date).toLocaleDateString()}</td>
                  <td>{appointment.time}</td>
                  <td>{appointment.status}</td>
                  <td className="space-x-2">
                    <button
                      type="button"
                      className="btn-secondary px-3 py-1.5 text-xs"
                      onClick={() => handleUpdateStatus(appointment._id, "Assigned")}
                    >
                      In progress
                    </button>
                    <button
                      type="button"
                      className="btn-primary px-3 py-1.5 text-xs"
                      onClick={() => handleUpdateStatus(appointment._id, "Completed")}
                    >
                      Complete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default MechanicDashboard;
