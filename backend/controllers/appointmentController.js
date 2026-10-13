// controllers/appointmentController.js
const Appointment = require("../models/Appointment");
const User = require("../models/User");
const { emitStaff, emitMechanic } = require("../utils/notify");

exports.createAppointment = async (req, res) => {
  try {
    const { service, date, time } = req.body;

    // Check how many appointments are already booked for the same service, date, and time
    const existingAppointments = await Appointment.find({
      service,
      date,
      time,
    });

    // If there are already 4 appointments, return an error
    if (existingAppointments.length >= 4) {
      return res
        .status(400)
        .json({ message: "No time slots available for this time and day." });
    }

    const appointment = new Appointment({
      ...req.body,
      user: req.body.user || req.user.userId,
      status: "Pending",
    });

    await appointment.save();
    await User.findByIdAndUpdate(appointment.user, {
      $push: { appointments: appointment._id },
    });
    const populated = await Appointment.findById(appointment._id).populate(
      "user service"
    );
    emitStaff(req, "notification", {
      type: "appointment",
      title: "New appointment booked",
      message: `${populated?.user?.username || "A customer"} booked a service`,
      createdAt: new Date().toISOString(),
      href: "/admin/appointments",
    });
    res.status(201).json(populated || appointment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getAppointment = async (req, res) => {
  try {
    const appointments = await Appointment.find().populate(
      "user service assignedMechanic"
    );
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateAppointment = async (req, res) => {
  try {
    const updatedAppointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { ...req.body, status: "Assigned" }, // Set status as 'Assigned' when updating
      { new: true }
    );
    res.json(updatedAppointment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// New method to assign an appointment to a mechanic
exports.assignMechanic = async (req, res) => {
  try {
    const { mechanicId } = req.body;
    console.log("Received mechanicId:", mechanicId);

    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      console.log("Appointment not found");
      return res.status(404).json({ message: "Appointment not found" });
    }

    console.log("Assigning mechanic to appointment:", appointment);

    appointment.assignedMechanic = mechanicId;
    appointment.status = "Assigned";

    await appointment.save();
    await appointment.populate("assignedMechanic");
    emitMechanic(req, mechanicId, "notification", {
      type: "assignment",
      title: "New job assigned",
      message: "An appointment was assigned to you",
      createdAt: new Date().toISOString(),
      href: "/mechanic/dashboard",
    });
    res.status(200).json(appointment);
  } catch (error) {
    console.error("Error in assigning mechanic:", error.message);
    res.status(500).json({ message: error.message });
  }
};

exports.getMechanicAppointments = async (req, res) => {
  try {
    const { mechanicId } = req.params;

    const appointments = await Appointment.find({
      assignedMechanic: mechanicId,
    }).populate("service user");

    res.status(200).json(appointments);
  } catch (error) {
    console.error("Error fetching appointments for mechanic:", error);
    res.status(500).json({ message: "Server error" });
  }
};
exports.updateAppointmentStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    res.status(200).json(appointment);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};
