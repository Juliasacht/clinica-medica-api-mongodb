const createCrudRouter = require("./crudRoutes");
const controller = require("../controllers/medicos");

module.exports = createCrudRouter(controller);
