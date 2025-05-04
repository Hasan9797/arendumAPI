const errorHandler = (err, req, res, next) => {
  console.error('Global error handler:', err);

  const statusCode = err.code && typeof err.code === 'number' ? err.code : 500;

  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
    code: err.code || null,
    name: err.name || 'Error',
  });
};

export default errorHandler;
