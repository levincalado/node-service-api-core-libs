const { config: errorConfig } = require('src/domain/error/errors');

class ErrorBuilder extends Error {
  /**
   *
   * @param {*} err // String Name of Error or Error object
   * @param {String} message // High level message about the error
   * @param {Array} details // Detailed messages about the error
   */
  constructor(err, message = '', details = []) {
    super();

    let errorName = err;
    if (!(err instanceof ErrorBuilder) && typeof err !== 'string') {
      errorName = err.name;
    }

    if (errorConfig[errorName]) {
      this.name = errorName;
      this.statusCode = errorConfig[errorName].statusCode;
      this.errorCode = errorConfig[errorName].errorCode;
      this.message = err.message || message || errorConfig[errorName].message;
      this.details = details;
    } else {
      err.statusCode = errorConfig.InternalServerError.statusCode;
      err.errorCode = errorConfig.InternalServerError.errorCode;
      err.details = err.message ? err.message : '';
      err.message = errorConfig.InternalServerError.message;
      return err;
    }

    return this;
  }
}


module.exports = ErrorBuilder;
