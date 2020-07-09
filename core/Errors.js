// Default Errors
const errors = {
  // 400 BAD REQUEST
  ValidationError: {
    statusCode: 400,
    errorCode: 'VALIDATION_ERROR',
  },
  // 401 UNAUTHORIZED
  Unauthorized: {
    statusCode: 401,
    errorCode: 'UNAUTHORIZED',
  },
  JsonWebTokenError: {
    statusCode: 401,
    errorCode: 'TOKEN_INVALID',
  },
  TokenExpiredError: {
    statusCode: 401,
    errorCode: 'TOKEN_EXPIRED',
  },
  UserSessionExpiredException: {
    statusCode: 401,
    errorCode: 'SESSION_EXPIRED',
  },
  // 404 NOT FOUND
  NotFoundError: {
    statusCode: 404,
    errorCode: 'NOT_FOUND',
  },
  // 500 INTERNAL SERVER ERROR
  InternalServerError: {
    statusCode: 500,
    errorCode: 'INTERNAL_SERVER_ERROR',
    message: 'The server failed to handle this request',
  },
};

module.exports = {
  errors,
  types: Object.keys(errors).reduce((acc, val) => {
    acc[val] = val;
    return acc;
  }, {}),
};