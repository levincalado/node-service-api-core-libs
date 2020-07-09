/* eslint-disable class-methods-use-this */
const Status = require('http-status');

const ResponseBuilder = require('../utils/ResponseBuilder');

class BaseController {
  constructor() {
    // dynamically inject operation based on operation request parameter
    this.injector = (operation) => (req, res, next) => {
      req.operation = req.container.resolve(operation);
      next();
    };
  }


  async getAll(req, res, next) {
    const { operation } = req;

    try {
      const result = await operation.execute();
      const { meta, data } = result;
      const response = new ResponseBuilder()
        .addMeta({
          statusCode: Status.OK,
          message: 'success',
          ...meta,
        })
        .addData(data)
        .build();
      res.status(Status.OK).json(response);
    } catch (err) {
      next(err);
    }
  }

  async get(req, res, next) {
    const { operation } = req;

    try {
      const result = await operation.execute(req.params);
      const response = new ResponseBuilder()
        .addMeta({
          statusCode: Status.OK,
          message: 'success',
        })
        .addData(result)
        .build();
      res.status(Status.OK).json(response);
    } catch (err) {
      next(err);
    }
  }

  async getWithQuery(req, res, next) {
    const { operation } = req;

    try {
      const result = await operation.execute(req.query);
      const { meta, data } = result;
      const response = new ResponseBuilder()
        .addMeta({
          statusCode: Status.OK,
          message: 'success',
          ...meta,
        })
        .addData(data)
        .build();
      res.status(Status.OK).json(response);
    } catch (err) {
      next(err);
    }
  }

  async post(req, res, next) {
    const { operation } = req;

    try {
      const result = await operation.execute(req.body);
      const response = new ResponseBuilder()
        .addMeta({
          statusCode: Status.OK,
          message: 'success',
        })
        .addData(result)
        .build();

      res.status(Status.OK).json(response);
    } catch (error) {
      next(error);
    }
  }

  async postParam(req, res, next) {
    const { operation } = req;
    try {
      const result = await operation.execute({ id: req.params.id, ...req.body });
      const response = new ResponseBuilder()
        .addMeta({
          statusCode: Status.OK,
          message: 'success',
        })
        .addData(result)
        .build();
      res.status(Status.OK).json(response);
    } catch (error) {
      next(error);
    }
  }

  async put(req, res, next) {
    const { operation } = req;
    try {
      const result = await operation.execute({ id: req.params.id, ...req.body });
      const response = new ResponseBuilder()
        .addMeta({
          statusCode: Status.ACCEPTED,
          message: 'success',
        })
        .addData(result)
        .build();
      res.status(Status.ACCEPTED).json(response);
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    const { operation } = req;

    try {
      await operation.execute(Number(req.params.id));
      const response = new ResponseBuilder()
        .addMeta({
          statusCode: Status.ACCEPTED,
          message: 'accepted',
        })
        .build();
      res.status(Status.ACCEPTED).json(response);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = BaseController;
