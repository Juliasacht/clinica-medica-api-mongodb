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

function buildEspecialidades() {
  const nomes = [
    "Cardiologia",
    "Dermatologia",
    "Pediatria",
    "Ortopedia",
    "Neurologia",
    "Ginecologia",
    "Oftalmologia",
    "Psiquiatria",
    "Endocrinologia",
    "Gastroenterologia",
    "Urologia",
    "Otorrinolaringologia",
    "Reumatologia",
    "Nefrologia",
    "Pneumologia",
    "Hematologia",
    "Infectologia",
    "Oncologia",
    "Radiologia",
    "Clinica Geral",
    "Fisiatria",
    "Angiologia",
    "Mastologia",
    "Alergologia",
    "Geriatria",
    "Nutrologia",
    "Medicina Esportiva",
    "Cirurgia Geral",
    "Medicina do Trabalho",
    "Medicina Preventiva",
  ];

  return nomes.map((nome, index) => ({
    _id: new ObjectId(),
    nome,
    descricao: `Atendimento em ${nome.toLowerCase()}`,
    ativo: index < 28,
  }));
}

function buildPacientes() {
  const nomes = [
    "Ana Souza",
    "Bruno Lima",
    "Carla Mendes",
    "Daniel Rocha",
    "Eduarda Martins",
    "Felipe Araujo",
    "Gabriela Castro",
    "Henrique Dias",
    "Isabela Freitas",
    "Joao Almeida",
    "Karen Ribeiro",
    "Lucas Barbosa",
    "Mariana Oliveira",
    "Nicolas Pereira",
    "Olivia Santos",
    "Paulo Nogueira",
    "Quiteria Lopes",
    "Rafael Gomes",
    "Sofia Teixeira",
    "Tiago Moreira",
    "Ursula Vieira",
    "Vitor Cardoso",
    "Wesley Carvalho",
    "Xavier Batista",
    "Yasmin Correia",
    "Zelia Fernandes",
    "Amanda Cunha",
    "Bernardo Campos",
    "Camila Duarte",
    "Diego Martins",
  ];
  const cidades = ["Sao Paulo", "Rio de Janeiro", "Belo Horizonte", "Curitiba", "Vitoria"];
  const ufs = ["SP", "RJ", "MG", "PR", "ES"];
  const alergias = [
    [],
    [{ substancia: "Dipirona", gravidade: "alta" }],
    [{ substancia: "Penicilina", gravidade: "media" }],
    [{ substancia: "Ibuprofeno", gravidade: "baixa" }],
  ];

  return nomes.map((nome, index) => ({
    _id: new ObjectId(),
    nome,
    cpf: String(10000000000 + index),
    email: `${nome.toLowerCase().replaceAll(" ", ".")}@email.com`,
    telefone: `119${String(80000000 + index)}`,
    dataNascimento: new Date(1975 + (index % 35), index % 12, (index % 27) + 1),
    endereco: {
      rua: `Rua ${index + 1}`,
      numero: String(100 + index),
      cidade: cidades[index % cidades.length],
      uf: ufs[index % ufs.length],
      cep: String(29000000 + index),
    },
    alergias: alergias[index % alergias.length],
  }));
}

function buildMedicos(especialidades) {
  const nomes = [
    "Dr. Helena Costa",
    "Dr. Marcos Nunes",
    "Dra. Paula Ribeiro",
    "Dr. Ricardo Alves",
    "Dra. Aline Moraes",
    "Dr. Caio Fonseca",
    "Dra. Debora Pinto",
    "Dr. Emilio Sales",
    "Dra. Fernanda Reis",
    "Dr. Gustavo Melo",
    "Dra. Heloisa Prado",
    "Dr. Igor Mendes",
    "Dra. Juliana Rocha",
    "Dr. Kleber Martins",
    "Dra. Larissa Peixoto",
    "Dr. Miguel Barros",
    "Dra. Natalia Farias",
    "Dr. Otavio Lima",
    "Dra. Patricia Neves",
    "Dr. Renato Soares",
    "Dra. Sabrina Teles",
    "Dr. Thiago Moura",
    "Dra. Valeria Franco",
    "Dr. William Ramos",
    "Dra. Yasmin Brito",
    "Dr. Zeca Amaral",
    "Dra. Beatriz Lopes",
    "Dr. Carlos Vieira",
    "Dra. Denise Castro",
    "Dr. Eduardo Cunha",
  ];
  const dias = ["segunda", "terca", "quarta", "quinta", "sexta"];

  return nomes.map((nome, index) => ({
    _id: new ObjectId(),
    nome,
    crm: `CRM-SP-${String(12000 + index)}`,
    email: `${nome.toLowerCase().replace("dr. ", "").replace("dra. ", "").replaceAll(" ", ".")}@clinica.com`,
    telefone: `113000${String(1000 + index)}`,
    especialidadeId: especialidades[index % especialidades.length]._id,
    horariosAtendimento: [
      {
        diaSemana: dias[index % dias.length],
        inicio: index % 2 === 0 ? "08:00" : "13:00",
        fim: index % 2 === 0 ? "12:00" : "17:00",
      },
    ],
  }));
}

function buildConsultas(pacientes, medicos, especialidades) {
  const motivos = [
    "Check-up",
    "Dor no peito",
    "Febre",
    "Acompanhamento",
    "Dor nas costas",
    "Exame de rotina",
    "Retorno",
    "Avaliacao inicial",
  ];
  const statusList = ["realizada", "realizada", "realizada", "agendada", "cancelada"];
  const consultas = [];

  for (let index = 0; index < 90; index += 1) {
    const paciente = pacientes[index % pacientes.length];
    const medico = medicos[index % medicos.length];
    const especialidade = especialidades.find((item) => item._id.equals(medico.especialidadeId));
    const status = statusList[index % statusList.length];
    const valor = 160 + ((index % 12) * 20);

    consultas.push({
      pacienteId: paciente._id,
      medicoId: medico._id,
      especialidadeId: especialidade._id,
      dataHora: new Date(2026, index % 12, (index % 27) + 1, 8 + (index % 9), index % 2 === 0 ? 0 : 30),
      status,
      valor,
      duracaoMinutos: 30 + ((index % 4) * 15),
      motivo: motivos[index % motivos.length],
      procedimentos:
        status === "realizada"
          ? [
              {
                nome: index % 3 === 0 ? "Exame clinico" : "Avaliacao medica",
                resultado: index % 4 === 0 ? "Solicitado acompanhamento" : "Sem alteracoes graves",
              },
            ]
          : [],
      prescricao: {
        medicamentos:
          status === "realizada" && index % 2 === 0
            ? [
                {
                  nome: index % 4 === 0 ? "Paracetamol" : "Atenolol",
                  dosagem: index % 4 === 0 ? "500mg" : "25mg",
                  frequencia: index % 4 === 0 ? "8/8h" : "1x ao dia",
                },
              ]
            : [],
        observacoes:
          status === "realizada" ? "Orientacoes registradas no atendimento." : "Consulta sem atendimento.",
      },
    });
  }

  return consultas;
}

function addTimestamps(documents) {
  const now = new Date();
  return documents.map((document) => ({
    ...document,
    criadoEm: now,
    atualizadoEm: now,
  }));
}

async function seed() {
  const db = await connectToDatabase();

  await Promise.all([
    db.collection("consultas").deleteMany({}),
    db.collection("pacientes").deleteMany({}),
    db.collection("medicos").deleteMany({}),
    db.collection("especialidades").deleteMany({}),
  ]);

  const especialidades = buildEspecialidades();
  const pacientes = buildPacientes();
  const medicos = buildMedicos(especialidades);
  const consultas = buildConsultas(pacientes, medicos, especialidades);

  await db.collection("especialidades").insertMany(addTimestamps(especialidades));
  await db.collection("pacientes").insertMany(addTimestamps(pacientes));
  await db.collection("medicos").insertMany(addTimestamps(medicos));
  await db.collection("consultas").insertMany(addTimestamps(consultas));
  await createIndexes(db);

  console.log("Seed finalizado com sucesso.");
  console.log(`Especialidades inseridas: ${especialidades.length}`);
  console.log(`Pacientes inseridos: ${pacientes.length}`);
  console.log(`Medicos inseridos: ${medicos.length}`);
  console.log(`Consultas inseridas: ${consultas.length}`);
}

seed()
  .catch((error) => {
    console.error("Erro ao executar seed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await closeConnection();
  });
