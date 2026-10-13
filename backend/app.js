require("dotenv").config();

const express = require("express");
const http = require("http");
const cors = require("cors");
const path = require("path");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const mongoSanitize = require("express-mongo-sanitize");
const { Server } = require("socket.io");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const Order = require("./models/Order");

const app = express();
const server = http.createServer(app);

// ── Database ──
const db = require("./conn/conn");

// ── Middleware imports ──
const authenticateToken = require("./middleware/authMiddleware");
const authenticateAdmin = require("./middleware/adminAuthMiddleware");

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SECURITY MIDDLEWARE
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

// Helmet — secure HTTP headers
app.use(
  helmet({
    crossOriginEmbedderPolicy: false, // allow images from other origins
    contentSecurityPolicy: false,     // disable strict CSP for dev; enable in prod
  })
);

// CORS — restrict to frontend origin
const corsOptions = {
  origin: process.env.FRONTEND_URL || "http://localhost:3001",
  credentials: true,
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));
app.use(cookieParser());

// MongoDB query sanitization — prevent NoSQL injection
app.use(mongoSanitize());

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// RATE LIMITING
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

// Global limiter — 200 req per 15 min per IP
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many requests, please try again later." },
});
app.use(globalLimiter);

// Auth-specific limiter — 10 req per 15 min (brute force protection)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many login attempts, please wait 15 minutes." },
});

// AI limiter — 5 req per minute
const aiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  message: { message: "AI rate limit reached. Please wait a moment." },
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// BODY PARSERS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

// Raw body for Stripe webhooks (must be before express.json)
app.use("/api/webhooks/stripe", express.raw({ type: "application/json" }));

// JSON + URL-encoded
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SOCKET.IO — Real-time notifications
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3001",
    methods: ["GET", "POST"],
  },
});

// Attach io to every request so controllers can emit events
app.use((req, _res, next) => {
  req.io = io;
  next();
});

io.on("connection", (socket) => {
  socket.on("join-room", (room) => {
    const allowed = ["admin", "staff", "customer"];
    if (allowed.includes(room) || String(room).startsWith("mechanic-")) {
      socket.join(room);
    }
  });

  socket.on("disconnect", () => {
    console.log(`Socket disconnected: ${socket.id}`);
  });
});

// Export io for use in services
module.exports.io = io;

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// ROUTES
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/ProductRoutes");
const appointmentRoutes = require("./routes/appointmentRoutes");
const orderRoutes = require("./routes/orderRoutes");
const contactRoutes = require("./routes/contactRoutes");
const cartRoutes = require("./routes/cartRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const serviceRoutes = require("./routes/serviceRoutes");
const adminRoutes = require("./routes/adminRoutes");
const aiRoutes = require("./routes/aiRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");

// Apply auth rate limiter to signup/login endpoints
app.use("/api/users/register", authLimiter);
app.use("/api/users/login", authLimiter);
app.use("/api/users/verify-otp", authLimiter);
app.use("/api/users/resend-otp", authLimiter);

// Mount all routes
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api", paymentRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/ai", aiLimiter, aiRoutes);
app.use("/api/analytics", analyticsRoutes);

app.post("/api/webhooks/stripe", async (req, res) => {
  const sig = req.headers["stripe-signature"];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  let event;

  try {
    if (webhookSecret) {
      event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
    } else if (process.env.NODE_ENV !== "production") {
      event = JSON.parse(req.body.toString());
    } else {
      return res.status(400).send("Webhook secret missing");
    }
  } catch (err) {
    console.error("Stripe webhook signature error:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    if (event.type === "payment_intent.succeeded") {
      const paymentIntent = event.data.object;
      const order = await Order.findOneAndUpdate(
        { stripePaymentIntentId: paymentIntent.id },
        { paymentStatus: "paid", status: "Processing" },
        { new: true }
      );
      if (order) {
        io.to("admin").emit("notification", {
          type: "order",
          title: "Payment confirmed",
          message: `Order ${String(order._id).slice(-6)} is paid`,
          createdAt: new Date().toISOString(),
          href: "/admin/orders",
        });
      }
    }
    if (event.type === "payment_intent.payment_failed") {
      const paymentIntent = event.data.object;
      await Order.findOneAndUpdate(
        { stripePaymentIntentId: paymentIntent.id },
        { paymentStatus: "failed" }
      );
    }
  } catch (err) {
    console.error("Stripe webhook handler error:", err);
  }

  res.json({ received: true });
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// HEALTH CHECK
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// ERROR HANDLER
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error",
    ...(process.env.NODE_ENV !== "production" && { stack: err.stack }),
  });
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// START SERVER
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🚀 AutoFixHub API running on port ${PORT}`);
  console.log(`🔌 Socket.io ready`);
});
