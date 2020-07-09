class ResponseBuilder {
  constructor() {
    this.meta = {
      timestamp: new Date(),
    };
  }

  /**
   * Properties to be included on the Response Metadata
   * @param {Object} meta
   */
  addMeta(meta) {
    this.meta = {
      ...this.meta,
      ...meta,
    };

    return this;
  }

  /**
   * Data to be sent on the Response
   * @param {Object|Array} data
   */
  addData(data) {
    this.data = data;

    return this;
  }

  /**
   * Error to be sent on the Response
   * @param {Error} error
   */
  addError(error) {
    this.error = error;

    return this;
  }

  /**
   * Build the Reponse Object
   */
  build() {
    return this;
  }
}

module.exports = ResponseBuilder;