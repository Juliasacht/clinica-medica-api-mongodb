const { Router } = require("express");

function createCrudRouter(controller) {
  const router = Router();

  router.post("/", controller.create);
  router.post("/lote", controller.createMany);
  router.get("/", controller.find);
  router.get("/:id", controller.findById);
  router.patch("/:id", controller.updateById);
  router.patch("/:id/array", controller.pushToArray);
  router.delete("/", controller.deleteByFilter);
  router.delete("/:id", controller.deleteById);

  return router;
}

module.exports = createCrudRouter;
