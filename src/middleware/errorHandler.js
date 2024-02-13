const ErrorHandler = (err, req, res, next) => {
  console.log("handling error...");
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  const error = err.error || "internal_error";

	console.error(err.stack)
  res.status(statusCode).json({ message: message, error: error, stack: err.stack });
};

module.exports = ErrorHandler;
