function errorHandler(err, req, res, next) {

  console.error(`Error: ${err.message}`);
  console.error(err.stack);

 
  const statusCode = err.status || 500;

  // Respond to the client
  res.status(statusCode).json({
    status: "error",
    statusCode: statusCode,
    message: err.message || "Internal Server Error",
  });
}

module.exports = errorHandler;
