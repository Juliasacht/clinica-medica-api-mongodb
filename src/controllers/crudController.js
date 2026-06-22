function success(res, statusCode, data, message) {
  return res.status(statusCode).json({
    sucesso: true,
    mensagem: message,
    dados: data,
  });
}

function fail(res, statusCode, message) {
  return res.status(statusCode).json({
    sucesso: false,
    mensagem: message,
  });
}

function handleError(res, error) {
  const statusCode = error.statusCode || 500;
  const message = statusCode === 500 ? "Erro interno no servidor." : error.message;
  return fail(res, statusCode, message);
}

function createCrudController(service, options = {}) {
  const arrayUpdateField = options.arrayUpdateField;

  return {
    async create(req, res) {
      try {
        const data = await service.create(req.body);
        return success(res, 201, data, "Registro criado com sucesso.");
      } catch (error) {
        return handleError(res, error);
      }
    },

    async createMany(req, res) {
      try {
        if (!Array.isArray(req.body) || req.body.length === 0) {
          return fail(res, 400, "Envie uma lista com pelo menos um registro.");
        }

        const data = await service.createMany(req.body);
        return success(res, 201, data, "Registros criados com sucesso.");
      } catch (error) {
        return handleError(res, error);
      }
    },

    async findById(req, res) {
      try {
        const data = await service.findById(req.params.id);
        if (!data) {
          return fail(res, 404, "Registro nao encontrado.");
        }

        return success(res, 200, data, "Registro encontrado.");
      } catch (error) {
        return handleError(res, error);
      }
    },

    async find(req, res) {
      try {
        const data = await service.find(req.query);
        return success(res, 200, data, "Consulta realizada com sucesso.");
      } catch (error) {
        return handleError(res, error);
      }
    },

    async updateById(req, res) {
      try {
        const data = await service.updateById(req.params.id, req.body);
        if (!data) {
          return fail(res, 404, "Registro nao encontrado.");
        }

        return success(res, 200, data, "Registro atualizado com sucesso.");
      } catch (error) {
        return handleError(res, error);
      }
    },

    async pushToArray(req, res) {
      try {
        if (!arrayUpdateField) {
          return fail(res, 400, "Esta rota nao possui array configurado.");
        }

        const data = await service.pushToArray(req.params.id, arrayUpdateField, req.body);
        if (!data) {
          return fail(res, 404, "Registro nao encontrado.");
        }

        return success(res, 200, data, "Array embutido atualizado com sucesso.");
      } catch (error) {
        return handleError(res, error);
      }
    },

    async deleteById(req, res) {
      try {
        const deletedCount = await service.deleteById(req.params.id);
        if (!deletedCount) {
          return fail(res, 404, "Registro nao encontrado.");
        }

        return success(res, 200, { removidos: deletedCount }, "Registro removido com sucesso.");
      } catch (error) {
        return handleError(res, error);
      }
    },

    async deleteByFilter(req, res) {
      try {
        const deletedCount = await service.deleteByFilter(req.query);
        return success(res, 200, { removidos: deletedCount }, "Remocao com filtro concluida.");
      } catch (error) {
        return handleError(res, error);
      }
    },
  };
}

module.exports = {
  createCrudController,
  handleError,
  success,
  fail,
};
