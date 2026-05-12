export const errorHandler = (err, req, res, next) => {
  console.error("🔥 ERROR:", err)

  const statusCode = err.statusCode || 500

  return res.status(statusCode).json({
    status: "error",
    message: err.message || "Internal server error",
    code: err.code || "INTERNAL_ERROR",
  })
}

export const notFound = (req, res) => {
  res.status(404).json({
    status: "error",
    message: "Route not found",
    code: "NOT_FOUND",
  })
}