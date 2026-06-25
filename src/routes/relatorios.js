const { Router } = require("express");
const controller = require("../controllers/relatorios");

const router = Router();

router.get("/consultas-por-especialidade", controller.consultasPorEspecialidade);
router.get("/faturamento-por-medico", controller.faturamentoPorMedico);
router.get("/pacientes-mais-consultas", controller.pacientesComMaisConsultas);
router.get("/duracao-media-especialidade", controller.duracaoMediaPorEspecialidade);

module.exports = router;
