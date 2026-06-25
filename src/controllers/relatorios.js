const service = require("../services/relatorios");
const { success, handleError } = require("./crudController");

async function runReport(req, res, reportName, message) {
  try {
    const data = await service[reportName](req.query);
    return success(res, 200, data, message);
  } catch (error) {
    return handleError(res, error);
  }
}

module.exports = {
  consultasPorEspecialidade(req, res) {
    return runReport(
      req,
      res,
      "consultasPorEspecialidade",
      "Relatorio de consultas por especialidade."
    );
  },

  faturamentoPorMedico(req, res) {
    return runReport(req, res, "faturamentoPorMedico", "Relatorio de faturamento por medico.");
  },

  pacientesComMaisConsultas(req, res) {
    return runReport(
      req,
      res,
      "pacientesComMaisConsultas",
      "Ranking de pacientes com mais consultas."
    );
  },

  duracaoMediaPorEspecialidade(req, res) {
    return runReport(
      req,
      res,
      "duracaoMediaPorEspecialidade",
      "Relatorio de duracao media por especialidade."
    );
  },
};
