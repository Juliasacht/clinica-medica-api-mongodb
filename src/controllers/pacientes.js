const service = require("../services/pacientes");
const { createCrudController } = require("./crudController");

module.exports = createCrudController(service, {
  arrayUpdateField: "alergias",
});
