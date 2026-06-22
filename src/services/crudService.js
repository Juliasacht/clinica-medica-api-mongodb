const { ObjectId } = require("mongodb");
const { getDatabase } = require("../config/db");

function toObjectId(id) {
  if (!ObjectId.isValid(id)) {
    const error = new Error("ID invalido.");
    error.statusCode = 400;
    throw error;
  }

  return new ObjectId(id);
}

function parseProjection(fields) {
  if (!fields) {
    return undefined;
  }

  return fields.split(",").reduce((projection, field) => {
    const cleanField = field.trim();
    if (cleanField) {
      projection[cleanField] = 1;
    }
    return projection;
  }, {});
}

function parseFilters(query, allowedFilters) {
  return allowedFilters.reduce((filters, field) => {
    if (query[field] === undefined || query[field] === "") {
      return filters;
    }

    if (field.endsWith("Id")) {
      filters[field] = toObjectId(query[field]);
      return filters;
    }

    filters[field] = { $regex: query[field], $options: "i" };
    return filters;
  }, {});
}

function createCrudService(collectionName, allowedFilters = []) {
  function collection() {
    return getDatabase().collection(collectionName);
  }

  return {
    async create(document) {
      const now = new Date();
      const result = await collection().insertOne({
        ...document,
        criadoEm: now,
        atualizadoEm: now,
      });

      return collection().findOne({ _id: result.insertedId });
    },

    async createMany(documents) {
      const now = new Date();
      const documentsWithDates = documents.map((document) => ({
        ...document,
        criadoEm: now,
        atualizadoEm: now,
      }));
      const result = await collection().insertMany(documentsWithDates);

      return {
        inseridos: result.insertedCount,
        ids: Object.values(result.insertedIds),
      };
    },

    async findById(id) {
      return collection().findOne({ _id: toObjectId(id) });
    },

    async find(query) {
      const { fields, limit = 20, page = 1 } = query;
      const filters = parseFilters(query, allowedFilters);
      const options = {
        projection: parseProjection(fields),
        limit: Number(limit),
        skip: (Number(page) - 1) * Number(limit),
        sort: { criadoEm: -1 },
      };

      return collection().find(filters, options).toArray();
    },

    async updateById(id, data) {
      const result = await collection().findOneAndUpdate(
        { _id: toObjectId(id) },
        { $set: { ...data, atualizadoEm: new Date() } },
        { returnDocument: "after" }
      );

      return result;
    },

    async pushToArray(id, arrayField, item) {
      const result = await collection().findOneAndUpdate(
        { _id: toObjectId(id) },
        {
          $push: { [arrayField]: item },
          $set: { atualizadoEm: new Date() },
        },
        { returnDocument: "after" }
      );

      return result;
    },

    async deleteById(id) {
      const result = await collection().deleteOne({ _id: toObjectId(id) });
      return result.deletedCount;
    },

    async deleteByFilter(query) {
      const filters = parseFilters(query, allowedFilters);
      const result = await collection().deleteMany(filters);
      return result.deletedCount;
    },
  };
}

module.exports = {
  createCrudService,
  toObjectId,
};
