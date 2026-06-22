const createCrudRouter = require("./crudRoutes");
const controller = require("../controllers/especialidades");

module.exports = createCrudRouter(controller);
