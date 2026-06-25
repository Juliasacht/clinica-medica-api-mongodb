const { ObjectId } = require("mongodb");
const { connectToDatabase, closeConnection } = require("../src/config/db");

async function createIndexes(db) {
  await Promise.all([
    db.collection("pacientes").createIndex({ cpf: 1 }, { unique: true }),
    db.collection("pacientes").createIndex({ nome: 1 }),
    db.collection("medicos").createIndex({ crm: 1 }, { unique: true }),
    db.collection("medicos").createIndex({ especialidadeId: 1 }),
    db.collection("especialidades").createIndex({ nome: 1 }, { unique: true }),
    db.collection("consultas").createIndex({ pacienteId: 1, dataHora: -1 }),
    db.collection("consultas").createIndex({ medicoId: 1, dataHora: -1 }),
    db.collection("consultas").createIndex({ especialidadeId: 1, status: 1 }),
  ]);
}

async function seed() {
  const db = await connectToDatabase();

  await Promise.all([
    db.collection("consultas").deleteMany({}),
    db.collection("pacientes").deleteMany({}),
    db.collection("medicos").deleteMany({}),
    db.collection("especialidades").deleteMany({}),
  ]);

  const especialidades = [
    { _id: new ObjectId(), nome: "Cardiologia", descricao: "Cuidados do coracao", ativo: true },
    { _id: new ObjectId(), nome: "Dermatologia", descricao: "Cuidados da pele", ativo: true },
    { _id: new ObjectId(), nome: "Pediatria", descricao: "Atendimento infantil", ativo: true },
    { _id: new ObjectId(), nome: "Ortopedia", descricao: "Ossos e articulacoes", ativo: true },
  ];

  const pacientes = [
    {
      _id: new ObjectId(),
      nome: "Ana Souza",
      cpf: "11122233344",
      email: "ana.souza@email.com",
      telefone: "11988880001",
      dataNascimento: new Date("1993-05-12"),
      endereco: {
        rua: "Rua das Flores",
        numero: "120",
        cidade: "Sao Paulo",
        uf: "SP",
        cep: "01001000",
      },
      alergias: [{ substancia: "Dipirona", gravidade: "alta" }],
    },
    {
      _id: new ObjectId(),
      nome: "Bruno Lima",
      cpf: "22233344455",
      email: "bruno.lima@email.com",
      telefone: "21977770002",
      dataNascimento: new Date("1987-09-20"),
      endereco: {
        rua: "Avenida Central",
        numero: "45",
        cidade: "Rio de Janeiro",
        uf: "RJ",
        cep: "20040001",
      },
      alergias: [],
    },
    {
      _id: new ObjectId(),
      nome: "Carla Mendes",
      cpf: "33344455566",
      email: "carla.mendes@email.com",
      telefone: "31966660003",
      dataNascimento: new Date("1978-11-02"),
      endereco: {
        rua: "Rua Minas",
        numero: "78",
        cidade: "Belo Horizonte",
        uf: "MG",
        cep: "30140071",
      },
      alergias: [{ substancia: "Penicilina", gravidade: "media" }],
    },
    {
      _id: new ObjectId(),
      nome: "Daniel Rocha",
      cpf: "44455566677",
      email: "daniel.rocha@email.com",
      telefone: "41955550004",
      dataNascimento: new Date("2017-01-30"),
      endereco: {
        rua: "Rua Parana",
        numero: "300",
        cidade: "Curitiba",
        uf: "PR",
        cep: "80010010",
      },
      alergias: [],
    },
  ];

  const medicos = [
    {
      _id: new ObjectId(),
      nome: "Dr. Helena Costa",
      crm: "CRM-SP-12345",
      email: "helena@clinica.com",
      telefone: "1130001000",
      especialidadeId: especialidades[0]._id,
      horariosAtendimento: [
        { diaSemana: "segunda", inicio: "08:00", fim: "12:00" },
        { diaSemana: "quarta", inicio: "14:00", fim: "18:00" },
      ],
    },
    {
      _id: new ObjectId(),
      nome: "Dr. Marcos Nunes",
      crm: "CRM-SP-54321",
      email: "marcos@clinica.com",
      telefone: "1130002000",
      especialidadeId: especialidades[1]._id,
      horariosAtendimento: [{ diaSemana: "terca", inicio: "09:00", fim: "17:00" }],
    },
    {
      _id: new ObjectId(),
      nome: "Dra. Paula Ribeiro",
      crm: "CRM-SP-67890",
      email: "paula@clinica.com",
      telefone: "1130003000",
      especialidadeId: especialidades[2]._id,
      horariosAtendimento: [{ diaSemana: "sexta", inicio: "08:00", fim: "16:00" }],
    },
    {
      _id: new ObjectId(),
      nome: "Dr. Ricardo Alves",
      crm: "CRM-SP-98765",
      email: "ricardo@clinica.com",
      telefone: "1130004000",
      especialidadeId: especialidades[3]._id,
      horariosAtendimento: [{ diaSemana: "quinta", inicio: "10:00", fim: "18:00" }],
    },
  ];

  const consultas = [
    {
      pacienteId: pacientes[0]._id,
      medicoId: medicos[0]._id,
      especialidadeId: especialidades[0]._id,
      dataHora: new Date("2026-05-10T09:00:00-03:00"),
      status: "realizada",
      valor: 280,
      duracaoMinutos: 45,
      motivo: "Dor no peito",
      procedimentos: [
        { nome: "Eletrocardiograma", resultado: "Sem alteracoes graves" },
      ],
      prescricao: {
        medicamentos: [{ nome: "Atenolol", dosagem: "25mg", frequencia: "1x ao dia" }],
        observacoes: "Retorno em 30 dias.",
      },
    },
    {
      pacienteId: pacientes[1]._id,
      medicoId: medicos[1]._id,
      especialidadeId: especialidades[1]._id,
      dataHora: new Date("2026-05-12T10:30:00-03:00"),
      status: "realizada",
      valor: 220,
      duracaoMinutos: 30,
      motivo: "Manchas na pele",
      procedimentos: [{ nome: "Dermatoscopia", resultado: "Lesao benigna" }],
      prescricao: {
        medicamentos: [{ nome: "Protetor solar", dosagem: "FPS 50", frequencia: "diario" }],
        observacoes: "Evitar sol entre 10h e 16h.",
      },
    },
    {
      pacienteId: pacientes[2]._id,
      medicoId: medicos[0]._id,
      especialidadeId: especialidades[0]._id,
      dataHora: new Date("2026-05-14T15:00:00-03:00"),
      status: "realizada",
      valor: 300,
      duracaoMinutos: 60,
      motivo: "Acompanhamento hipertensao",
      procedimentos: [{ nome: "Afericao de pressao", resultado: "Pressao controlada" }],
      prescricao: { medicamentos: [], observacoes: "Manter acompanhamento." },
    },
    {
      pacienteId: pacientes[3]._id,
      medicoId: medicos[2]._id,
      especialidadeId: especialidades[2]._id,
      dataHora: new Date("2026-05-18T08:30:00-03:00"),
      status: "realizada",
      valor: 180,
      duracaoMinutos: 35,
      motivo: "Febre",
      procedimentos: [{ nome: "Exame clinico", resultado: "Quadro viral" }],
      prescricao: {
        medicamentos: [{ nome: "Paracetamol", dosagem: "500mg", frequencia: "8/8h" }],
        observacoes: "Hidratacao e repouso.",
      },
    },
    {
      pacienteId: pacientes[0]._id,
      medicoId: medicos[3]._id,
      especialidadeId: especialidades[3]._id,
      dataHora: new Date("2026-06-01T11:00:00-03:00"),
      status: "agendada",
      valor: 250,
      duracaoMinutos: 40,
      motivo: "Dor no joelho",
      procedimentos: [],
      prescricao: { medicamentos: [], observacoes: "" },
    },
    {
      pacienteId: pacientes[1]._id,
      medicoId: medicos[0]._id,
      especialidadeId: especialidades[0]._id,
      dataHora: new Date("2026-06-05T16:00:00-03:00"),
      status: "cancelada",
      valor: 280,
      duracaoMinutos: 45,
      motivo: "Check-up",
      procedimentos: [],
      prescricao: { medicamentos: [], observacoes: "Cancelada pelo paciente." },
    },
  ].map((consulta) => ({
    ...consulta,
    criadoEm: new Date(),
    atualizadoEm: new Date(),
  }));

  const now = new Date();
  await db.collection("especialidades").insertMany(
    especialidades.map((item) => ({ ...item, criadoEm: now, atualizadoEm: now }))
  );
  await db.collection("pacientes").insertMany(
    pacientes.map((item) => ({ ...item, criadoEm: now, atualizadoEm: now }))
  );
  await db.collection("medicos").insertMany(
    medicos.map((item) => ({ ...item, criadoEm: now, atualizadoEm: now }))
  );
  await db.collection("consultas").insertMany(consultas);
  await createIndexes(db);

  console.log("Seed finalizado com sucesso.");
  console.log("Collections populadas: especialidades, pacientes, medicos e consultas.");
}

seed()
  .catch((error) => {
    console.error("Erro ao executar seed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await closeConnection();
  });
