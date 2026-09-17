const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        message: "Authentication required",
      });
    }

    const token = authHeader.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : null;

    if (!token) {
      return res.status(401).json({
        message: "Invalid authorization header",
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    // --------------------------------------------------
    // THERAPIST
    // --------------------------------------------------

    if (decoded.role === "therapist") {
      if (!decoded.therapistId) {
        return res.status(401).json({
          message: "Invalid therapist token",
        });
      }

      req.role = "therapist";
      req.therapistId = decoded.therapistId;

      return next();
    }

    // --------------------------------------------------
    // CLIENT
    // --------------------------------------------------

    if (decoded.role === "client") {
      if (!decoded.clientId) {
        return res.status(401).json({
          message: "Invalid client token",
        });
      }

      req.role = "client";
      req.clientId = decoded.clientId;
      req.therapistId = decoded.therapistId || null;

      return next();
    }

    return res.status(401).json({
      message: "Invalid user role",
    });

  } catch (error) {
    console.error(
      "Authentication error:",
      error.message
    );

    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
};

module.exports = authMiddleware;