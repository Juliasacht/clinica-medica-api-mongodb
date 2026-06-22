const service = require("../services/medicos");
const { createCrudController } = require("./crudController");

module.exports = createCrudController(service, {
  arrayUpdateField: "horariosAtendimento",
});
