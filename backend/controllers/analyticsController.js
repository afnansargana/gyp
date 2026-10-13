const Order = require("../models/Order");
const Appointment = require("../models/Appointment");
const User = require("../models/User");
const Service = require("../models/Service");

function monthKey(date) {
  const d = new Date(date);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

exports.getOverview = async (req, res) => {
  try {
    const [orders, appointments, users, services] = await Promise.all([
      Order.find().populate("user", "username").lean(),
      Appointment.find()
        .populate("service", "name")
        .populate("assignedMechanic", "username")
        .lean(),
      User.find().select("isAdmin isMechanic createdAt").lean(),
      Service.find().select("name").lean(),
    ]);

    const paidOrders = orders.filter(
      (o) => o.paymentStatus === "paid" || o.status === "Completed" || o.totalAmount
    );

    const revenueByMonthMap = {};
    paidOrders.forEach((o) => {
      const key = monthKey(o.createdAt);
      revenueByMonthMap[key] = (revenueByMonthMap[key] || 0) + (o.totalAmount || 0);
    });
    const revenueByMonth = Object.entries(revenueByMonthMap)
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-6)
      .map(([month, revenue]) => ({ month, revenue }));

    const serviceCounts = {};
    appointments.forEach((a) => {
      const name = a.service?.name || "Unknown";
      serviceCounts[name] = (serviceCounts[name] || 0) + 1;
    });
    const topServices = Object.entries(serviceCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);

    const workload = {};
    appointments.forEach((a) => {
      const name = a.assignedMechanic?.username || "Unassigned";
      workload[name] = (workload[name] || 0) + 1;
    });
    const mechanicWorkload = Object.entries(workload)
      .map(([name, jobs]) => ({ name, jobs }))
      .sort((a, b) => b.jobs - a.jobs);

    const totalRevenue = paidOrders.reduce((s, o) => s + (o.totalAmount || 0), 0);

    res.json({
      totals: {
        users: users.length,
        mechanics: users.filter((u) => u.isMechanic).length,
        appointments: appointments.length,
        orders: orders.length,
        services: services.length,
        revenue: totalRevenue,
      },
      revenueByMonth,
      topServices,
      mechanicWorkload,
    });
  } catch (error) {
    console.error("Analytics error:", error);
    res.status(500).json({ message: "Failed to load analytics" });
  }
};

exports.getMechanicOverview = async (req, res) => {
  try {
    const mechanicId = req.user.userId;
    const appointments = await Appointment.find({
      assignedMechanic: mechanicId,
    })
      .populate("service", "name")
      .lean();

    const byStatus = appointments.reduce((acc, a) => {
      acc[a.status] = (acc[a.status] || 0) + 1;
      return acc;
    }, {});

    const byService = {};
    appointments.forEach((a) => {
      const name = a.service?.name || "Unknown";
      byService[name] = (byService[name] || 0) + 1;
    });

    res.json({
      totals: {
        assigned: appointments.length,
        pending: byStatus.Pending || 0,
        assignedStatus: byStatus.Assigned || 0,
        completed: byStatus.Completed || 0,
      },
      byService: Object.entries(byService).map(([name, count]) => ({
        name,
        count,
      })),
    });
  } catch (error) {
    console.error("Mechanic analytics error:", error);
    res.status(500).json({ message: "Failed to load workload" });
  }
};
