const { getDatabase } = require("../config/db");

function parseDateFilter(query) {
  const filter = {};

  if (query.dataInicio || query.dataFim) {
    filter.dataHora = {};
    if (query.dataInicio) {
      filter.dataHora.$gte = new Date(query.dataInicio);
    }
    if (query.dataFim) {
      filter.dataHora.$lte = new Date(query.dataFim);
    }
  }

  if (query.status) {
    filter.status = query.status;
  }

  return filter;
}

function consultasCollection() {
  return getDatabase().collection("consultas");
}

async function consultasPorEspecialidade(query) {
  const pipeline = [
    { $match: parseDateFilter(query) },
    {
      $lookup: {
        from: "especialidades",
        localField: "especialidadeId",
        foreignField: "_id",
        as: "especialidade",
      },
    },
    { $unwind: "$especialidade" },
    {
      $group: {
        _id: "$especialidade._id",
        especialidade: { $first: "$especialidade.nome" },
        totalConsultas: { $sum: 1 },
        ticketMedio: { $avg: "$valor" },
      },
    },
    {
      $project: {
        _id: 0,
        especialidadeId: "$_id",
        especialidade: 1,
        totalConsultas: 1,
        ticketMedio: { $round: ["$ticketMedio", 2] },
      },
    },
    { $sort: { totalConsultas: -1, especialidade: 1 } },
  ];

  return consultasCollection().aggregate(pipeline).toArray();
}

async function faturamentoPorMedico(query) {
  const pipeline = [
    { $match: { ...parseDateFilter(query), status: query.status || "realizada" } },
    {
      $lookup: {
        from: "medicos",
        localField: "medicoId",
        foreignField: "_id",
        as: "medico",
      },
    },
    { $unwind: "$medico" },
    {
      $group: {
        _id: "$medico._id",
        medico: { $first: "$medico.nome" },
        crm: { $first: "$medico.crm" },
        totalConsultas: { $sum: 1 },
        faturamentoTotal: { $sum: "$valor" },
        maiorConsulta: { $max: "$valor" },
      },
    },
    {
      $project: {
        _id: 0,
        medicoId: "$_id",
        medico: 1,
        crm: 1,
        totalConsultas: 1,
        faturamentoTotal: 1,
        maiorConsulta: 1,
      },
    },
    { $sort: { faturamentoTotal: -1 } },
    { $limit: Number(query.limit || 5) },
  ];

  return consultasCollection().aggregate(pipeline).toArray();
}

async function pacientesComMaisConsultas(query) {
  const pipeline = [
    { $match: parseDateFilter(query) },
    {
      $group: {
        _id: "$pacienteId",
        totalConsultas: { $sum: 1 },
        ultimaConsulta: { $max: "$dataHora" },
        gastoTotal: { $sum: "$valor" },
      },
    },
    {
      $lookup: {
        from: "pacientes",
        localField: "_id",
        foreignField: "_id",
        as: "paciente",
      },
    },
    { $unwind: "$paciente" },
    {
      $project: {
        _id: 0,
        pacienteId: "$_id",
        paciente: "$paciente.nome",
        telefone: "$paciente.telefone",
        totalConsultas: 1,
        ultimaConsulta: 1,
        gastoTotal: 1,
      },
    },
    { $sort: { totalConsultas: -1, gastoTotal: -1 } },
    { $limit: Number(query.limit || 5) },
  ];

  return consultasCollection().aggregate(pipeline).toArray();
}

async function duracaoMediaPorEspecialidade(query) {
  const pipeline = [
    { $match: { ...parseDateFilter(query), status: query.status || "realizada" } },
    {
      $lookup: {
        from: "especialidades",
        localField: "especialidadeId",
        foreignField: "_id",
        as: "especialidade",
      },
    },
    { $unwind: "$especialidade" },
    {
      $addFields: {
        duracaoHoras: { $divide: ["$duracaoMinutos", 60] },
      },
    },
    {
      $group: {
        _id: "$especialidade._id",
        especialidade: { $first: "$especialidade.nome" },
        duracaoMediaMinutos: { $avg: "$duracaoMinutos" },
        duracaoMediaHoras: { $avg: "$duracaoHoras" },
        totalConsultas: { $sum: 1 },
      },
    },
    {
      $project: {
        _id: 0,
        especialidadeId: "$_id",
        especialidade: 1,
        totalConsultas: 1,
        duracaoMediaMinutos: { $round: ["$duracaoMediaMinutos", 1] },
        duracaoMediaHoras: { $round: ["$duracaoMediaHoras", 2] },
      },
    },
    { $sort: { duracaoMediaMinutos: -1 } },
  ];

  return consultasCollection().aggregate(pipeline).toArray();
}

module.exports = {
  consultasPorEspecialidade,
  faturamentoPorMedico,
  pacientesComMaisConsultas,
  duracaoMediaPorEspecialidade,
};
