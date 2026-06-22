const service = require("../services/consultas");
const { createCrudController } = require("./crudController");

module.exports = createCrudController(service, {
  arrayUpdateField: "procedimentos",
});
