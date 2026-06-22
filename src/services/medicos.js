const { createCrudService } = require("./crudService");

module.exports = createCrudService("medicos", ["nome", "crm", "especialidadeId"]);
