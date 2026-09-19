const express = require("express");
const cors = require("cors");
const path = require("path");

const authRoutes = require("./routes/authRoutes");
const clientRoutes = require("./routes/clientRoutes");
const therapistRoutes = require("./routes/therapistRoutes");
const schedulingRoutes = require("./routes/schedulingRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const noteRoutes = require("./routes/noteRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");
const publicRoutes = require("./routes/publicRoutes");
const leadRoutes = require("./routes/leadRoutes");

const { notFound, errorHandler } = require("./middleware/errorHandler");

const app = express();

const envOrigins = (process.env.FRONTEND_URL || "")
  .split(",")
  .map((x) => x.trim())
  .filter(Boolean);

const origins = [
  "http://localhost:5173",
  "https://unfazed-sigma.vercel.app",
  ...envOrigins,
];

const allowedOrigins = [...new Set(origins)];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests without an Origin header
      // such as Postman/server-to-server requests.
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      console.log("CORS blocked origin:", origin);

      return callback(new Error("CORS origin not allowed"));
    },
    credentials: true,
    methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    optionsSuccessStatus: 204,
  })
);

// Explicitly handle CORS preflight requests.
app.options("*", cors());

app.use(
  "/api/payments/webhook",
  express.raw({ type: "application/json" })
);

app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));

app.use(
  "/uploads",
  express.static(path.join(process.cwd(), "uploads"))
);

app.get("/", (req, res) => {
  res.json({
    message: "Unfazed backend is running",
    status: "ok",
  });
});

app.use("/api", publicRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/clients", clientRoutes);
app.use("/api/therapists", therapistRoutes);
app.use("/api/scheduling", schedulingRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/notes", noteRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/leads", leadRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;