const express = require("express");
const cors = require("cors");

const pacientesRoutes = require("./routes/pacientes");
const medicosRoutes = require("./routes/medicos");
const especialidadesRoutes = require("./routes/especialidades");
const consultasRoutes = require("./routes/consultas");
const relatoriosRoutes = require("./routes/relatorios");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({
    sucesso: true,
    mensagem: "API da Clinica Medica com Node.js e MongoDB",
  });
});

app.use("/pacientes", pacientesRoutes);
app.use("/medicos", medicosRoutes);
app.use("/especialidades", especialidadesRoutes);
app.use("/consultas", consultasRoutes);
app.use("/relatorios", relatoriosRoutes);

app.use((req, res) => {
  res.status(404).json({
    sucesso: false,
    mensagem: "Rota nao encontrada.",
  });
});

module.exports = app;
