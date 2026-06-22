const { createCrudService } = require("./crudService");

module.exports = createCrudService("pacientes", ["nome", "cpf", "email", "telefone"]);
