const { createCrudService } = require("./crudService");

module.exports = createCrudService("especialidades", ["nome", "ativo"]);
