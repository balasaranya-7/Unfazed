const notFound = (req, res, next) => {
  const error = new Error(`Route not found: ${req.method} ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
};

const errorHandler = (err, req, res, next) => {
  console.error(err);

  let statusCode = err.statusCode || res.statusCode || 500;
  if (statusCode < 400) statusCode = 500;

  if (err.name === "ValidationError") statusCode = 400;
  if (err.name === "CastError") statusCode = 400;
  if (err.code === 11000) statusCode = 409;

  const message =
    err.name === "ValidationError"
      ? Object.values(err.errors || {}).map((item) => item.message).join(", ")
      : err.code === 11000
        ? "A record with the same unique value already exists."
        : err.message || "Internal server error";

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV !== "production" ? { stack: err.stack } : {}),
  });
};

module.exports = { notFound, errorHandler };
