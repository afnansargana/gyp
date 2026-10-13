const express = require("express");
const authenticateToken = require("../middleware/authMiddleware");
const {
  requireAdmin,
  requireStaff,
} = require("../middleware/rbac.middleware");
const appointmentController = require("../controllers/appointmentController");
const Appointment = require("../models/Appointment");

const router = express.Router();

// Customer: create booking
router.post("/", authenticateToken, appointmentController.createAppointment);

// Public-ish availability check (used by booking form)
router.get("/check-availability", async (req, res) => {
  const { service, date } = req.query;

  try {
    const appointments = await Appointment.find({ service, date });
    const bookedSlots = appointments.map((appointment) => appointment.time);
    res.status(200).json({ bookedSlots });
  } catch (error) {
    res.status(500).json({ message: "Error fetching available slots" });
  }
});

// Mechanic: own appointments
router.get(
  "/mechanic/:mechanicId",
  authenticateToken,
  requireStaff,
  appointmentController.getMechanicAppointments
);

// Staff: list / update
router.get(
  "/",
  authenticateToken,
  requireStaff,
  appointmentController.getAppointment
);

router.put(
  "/:id",
  authenticateToken,
  requireStaff,
  appointmentController.updateAppointment
);

router.put(
  "/:id/assign",
  authenticateToken,
  requireAdmin,
  appointmentController.assignMechanic
);

router.put(
  "/:id/update-status",
  authenticateToken,
  requireStaff,
  appointmentController.updateAppointmentStatus
);

module.exports = router;
