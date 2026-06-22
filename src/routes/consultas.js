const createCrudRouter = require("./crudRoutes");
const controller = require("../controllers/consultas");

module.exports = createCrudRouter(controller);
