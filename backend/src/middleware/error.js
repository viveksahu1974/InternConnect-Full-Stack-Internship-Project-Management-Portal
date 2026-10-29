function notFound(req, res, next) {
  res.status(404).json({ success: false, message: `Route not found: ${req.method} ${req.originalUrl}` });
}

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  console.error(err);

  if (err.name === 'SequelizeValidationError' || err.name === 'SequelizeUniqueConstraintError') {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: err.errors ? err.errors.map((e) => ({ field: e.path, message: e.message })) : [],
    });
  }

  const status = err.status || 500;
  const message = status === 500 ? 'Something went wrong on our end' : err.message;

  res.status(status).json({ success: false, message });
}

module.exports = { notFound, errorHandler };
