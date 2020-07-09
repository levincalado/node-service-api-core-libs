const { NotFoundError } = require('src/domain/error/errors').types;

const ErrorBuilder = require('../helpers/ErrorBuilder');

class BaseRepository {
  constructor(model, toEntity = null, toDatabase = null) {
    this.model = model;
    this.toEntity = toEntity;
    this.toDatabase = toDatabase;
  }

  async getAll(...args) {
    const results = await this.model.findAll(...args);

    if (this.toEntity) {
      return results.map((result) => new this.toEntity(result));
    }
    return results;
  }

  async getAllAndCount(args) {
    const result = await this.model.findAndCountAll({
      ...args,
      rejectOnEmpty: false,
    });

    const currentPage = Math.ceil(args.offset / args.limit) + 1;
    const totalPage = Math.ceil(result.count / args.limit);

    const meta = {
      total: result.count,
      currentPage,
      totalPage,
      itemsPerPage: args.limit,
      hasNextPage: (currentPage < totalPage),
    };

    const records = result.rows.map((item) => item.toJSON());

    return { meta, data: records };
  }

  async getById(id, options = {}) {
    const result = await this._getById(id, options);

    if (this.toEntity) {
      return new this.toEntity({ ...result.dataValues });
    }
    return result;
  }

  async add(entity) {
    const result = await this.model.create(entity);

    if (this.toEntity) {
      return this.toEntity(result);
    }
    return result;
  }

  async bulkInsert(data, options) {
    const result = await this.model.bulkCreate(data, options);

    return result;
  }

  async remove(id, options) {
    const entity = await this._getById(id);

    return entity.destroy(options);
  }

  async update(id, newData) {
    const entity = await this._getById(id);

    const transaction = await this.model.sequelize.transaction();

    try {
      const updatedEntity = await entity.update(newData, { transaction });

      await transaction.commit();

      if (this.toEntity) {
        return this.toEntity(updatedEntity);
      }
      return updatedEntity;
    } catch (error) {
      await transaction.rollback();

      throw error;
    }
  }

  async upsert(data) {
    await this.model.upsert(data);
    const updatedEntity = await this._getById(data.id);
    if (this.toEntity) {
      return new this.toEntity({ ...updatedEntity.dataValues });
    }
    return updatedEntity;
  }

  async count() {
    return this.model.count();
  }

  // Private

  async _getById(id, options = {}) {
    options.rejectOnEmpty = true;
    try {
      const result = await this.model.findByPk(id, options);
      return result;
    } catch (error) {
      if (error.name === 'SequelizeEmptyResultError') {
        throw new ErrorBuilder(NotFoundError, 'Not Found',
          `${this.model.name} with id ${id} can't be found.`);
      }

      throw error;
    }
  }
}

module.exports = BaseRepository;
