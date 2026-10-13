const Order = require("../models/Order");
const User = require("../models/User");
const { generateInvoicePdf } = require("../services/invoice.service");

exports.downloadInvoice = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("products.product", "title")
      .populate("user", "username email");

    if (!order) return res.status(404).json({ message: "Order not found" });

    const ownerId = String(order.user?._id || order.user);
    const isOwner = ownerId === String(req.user.userId);
    if (!isOwner && !req.user.isAdmin) {
      return res.status(403).json({ message: "Not allowed to download this invoice" });
    }

    const customer = order.user?.username
      ? order.user
      : await User.findById(ownerId).select("username email");

    const pdf = await generateInvoicePdf(order.toObject(), customer);
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=autofixhub-invoice-${String(order._id).slice(-8)}.pdf`
    );
    res.send(pdf);
  } catch (error) {
    console.error("Invoice error:", error);
    res.status(500).json({ message: "Failed to generate invoice" });
  }
};
