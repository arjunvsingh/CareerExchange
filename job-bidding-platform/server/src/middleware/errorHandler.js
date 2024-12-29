const errorHandler = (err, req, res, next) => {
  // Log the error for debugging
  console.error('Error details:', {
    message: err.message,
    stack: err.stack,
    code: err.code
  });

  // Handle specific error types
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      error: err.message
    });
  }

  if (err.code === '23505') { // PostgreSQL unique violation
    return res.status(409).json({
      success: false,
      error: 'Resource already exists'
    });
  }

  // Database connection errors
  if (err.code === '3D000') { // Database does not exist
    return res.status(500).json({
      success: false,
      error: 'Database configuration error'
    });
  }

  if (err.code === '42P01') { // Undefined table
    return res.status(500).json({
      success: false,
      error: 'Database table not found'
    });
  }

  // Default error response
  return res.status(500).json({
    success: false,
    error: process.env.NODE_ENV === 'development' 
      ? err.message 
      : 'Internal server error'
  });
};

module.exports = errorHandler;