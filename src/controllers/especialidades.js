const service = require("../services/especialidades");
const { createCrudController } = require("./crudController");

module.exports = createCrudController(service);
