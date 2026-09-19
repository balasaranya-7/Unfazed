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

const {
  notFound,
  errorHandler,
} = require("./middleware/errorHandler");

const app = express();


// ======================================================
// CORS CONFIGURATION
// ======================================================

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
      // such as Postman or server-to-server requests.
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      console.log("CORS blocked origin:", origin);

      return callback(
        new Error("CORS origin not allowed")
      );
    },

    credentials: true,

    methods: [
      "GET",
      "HEAD",
      "PUT",
      "PATCH",
      "POST",
      "DELETE",
      "OPTIONS",
    ],

    allowedHeaders: [
      "Content-Type",
      "Authorization",
    ],

    optionsSuccessStatus: 204,
  })
);


// ======================================================
// BODY PARSERS
// ======================================================

// Razorpay webhook must receive raw body
// for signature verification.
app.use(
  "/api/payments/webhook",
  express.raw({
    type: "application/json",
  })
);

app.use(
  express.json({
    limit: "2mb",
  })
);

app.use(
  express.urlencoded({
    extended: true,
  })
);


// ======================================================
// STATIC UPLOADS
// ======================================================

app.use(
  "/uploads",
  express.static(
    path.join(process.cwd(), "uploads")
  )
);


// ======================================================
// HEALTH CHECK
// ======================================================

app.get("/", (req, res) => {
  res.json({
    message: "Unfazed backend is running",
    status: "ok",
  });
});


// ======================================================
// PUBLIC ROUTES
// ======================================================

app.use(
  "/api",
  publicRoutes
);


// ======================================================
// AUTH
// ======================================================

app.use(
  "/api/auth",
  authRoutes
);


// ======================================================
// CLIENTS
// ======================================================

app.use(
  "/api/clients",
  clientRoutes
);


// ======================================================
// THERAPISTS
// ======================================================

app.use(
  "/api/therapists",
  therapistRoutes
);


// ======================================================
// SCHEDULING
// ======================================================

app.use(
  "/api/scheduling",
  schedulingRoutes
);


// ======================================================
// PAYMENTS
// ======================================================

app.use(
  "/api/payments",
  paymentRoutes
);


// ======================================================
// CLINICAL NOTES
// ======================================================

app.use(
  "/api/notes",
  noteRoutes
);


// ======================================================
// ANALYTICS
// ======================================================

app.use(
  "/api/analytics",
  analyticsRoutes
);


// ======================================================
// LEADS
// ======================================================

app.use(
  "/api/leads",
  leadRoutes
);


// ======================================================
// ERROR HANDLING
// ======================================================

app.use(notFound);

app.use(errorHandler);


// ======================================================
// EXPORT
// ======================================================

module.exports = app;