const createCrudRouter = require("./crudRoutes");
const controller = require("../controllers/pacientes");

module.exports = createCrudRouter(controller);
