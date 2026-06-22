const { createCrudService } = require("./crudService");

module.exports = createCrudService("consultas", [
  "status",
  "pacienteId",
  "medicoId",
  "especialidadeId",
]);
