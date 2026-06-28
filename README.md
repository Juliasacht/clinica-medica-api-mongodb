# Clinica Medica API - Node.js e MongoDB

API REST desenvolvida para o trabalho de Banco de Dados III, com foco em modelagem NoSQL orientada a documentos, CRUD, agregacoes e organizacao em camadas.

O dominio escolhido foi uma clinica medica, com controle de pacientes, medicos, especialidades e consultas.

## Tecnologias

- Node.js
- Express.js
- MongoDB
- Driver nativo `mongodb`
- dotenv
- nodemon

## Estrutura do projeto

```text
/
+-- src/
|   +-- routes/
|   +-- controllers/
|   +-- services/
|   +-- config/
+-- scripts/
|   +-- seed.js
+-- .env.example
+-- package.json
+-- README.md
```

## Collections

O projeto utiliza 4 collections principais.

O script de seed popula o banco com quantidade suficiente para testes e agregacoes:

- 30 pacientes
- 30 medicos
- 30 especialidades
- 90 consultas

### pacientes

Armazena os dados cadastrais dos pacientes.

Exemplo de documento:

```json
{
  "_id": "ObjectId",
  "nome": "Ana Souza",
  "cpf": "11122233344",
  "email": "ana.souza@email.com",
  "telefone": "11988880001",
  "dataNascimento": "1993-05-12",
  "endereco": {
    "rua": "Rua das Flores",
    "numero": "120",
    "cidade": "Sao Paulo",
    "uf": "SP",
    "cep": "01001000"
  },
  "alergias": [
    {
      "substancia": "Dipirona",
      "gravidade": "alta"
    }
  ]
}
```

### medicos

Armazena os profissionais da clinica.

```json
{
  "_id": "ObjectId",
  "nome": "Dr. Helena Costa",
  "crm": "CRM-SP-12345",
  "email": "helena@clinica.com",
  "telefone": "1130001000",
  "especialidadeId": "ObjectId",
  "horariosAtendimento": [
    {
      "diaSemana": "segunda",
      "inicio": "08:00",
      "fim": "12:00"
    }
  ]
}
```

### especialidades

Armazena as areas medicas atendidas pela clinica.

```json
{
  "_id": "ObjectId",
  "nome": "Cardiologia",
  "descricao": "Cuidados do coracao",
  "ativo": true
}
```

### consultas

Armazena os agendamentos e atendimentos realizados.

```json
{
  "_id": "ObjectId",
  "pacienteId": "ObjectId",
  "medicoId": "ObjectId",
  "especialidadeId": "ObjectId",
  "dataHora": "2026-05-10T12:00:00.000Z",
  "status": "realizada",
  "valor": 280,
  "duracaoMinutos": 45,
  "motivo": "Dor no peito",
  "procedimentos": [
    {
      "nome": "Eletrocardiograma",
      "resultado": "Sem alteracoes graves"
    }
  ],
  "prescricao": {
    "medicamentos": [
      {
        "nome": "Atenolol",
        "dosagem": "25mg",
        "frequencia": "1x ao dia"
      }
    ],
    "observacoes": "Retorno em 30 dias."
  }
}
```

## Decisoes de modelagem NoSQL

### Embedding

Foram usados documentos embutidos em situacoes em que os dados pertencem diretamente ao documento principal e normalmente sao consultados junto com ele.

Exemplos:

- `pacientes.endereco`: o endereco pertence ao paciente e nao precisa ser uma collection separada.
- `pacientes.alergias`: a lista de alergias e pequena e faz sentido ser carregada junto com o paciente.
- `medicos.horariosAtendimento`: horarios fazem parte do cadastro do medico.
- `consultas.procedimentos` e `consultas.prescricao`: sao informacoes geradas no atendimento e consultadas junto com a consulta.

Essa escolha reduz a necessidade de consultas extras e aproveita o modelo orientado a documentos do MongoDB.

### Referencias

Foram usadas referencias quando os dados possuem ciclo de vida proprio ou podem ser reutilizados em varios documentos.

Exemplos:

- `consultas.pacienteId` referencia um documento da collection `pacientes`.
- `consultas.medicoId` referencia um documento da collection `medicos`.
- `consultas.especialidadeId` referencia um documento da collection `especialidades`.
- `medicos.especialidadeId` referencia a especialidade do medico.

Essa escolha evita duplicacao de dados importantes, como dados de paciente, medico e especialidade, e permite agregacoes com `$lookup`.

## Indices

Os indices sao criados no script `scripts/seed.js`.

| Collection | Indice | Justificativa |
|---|---|---|
| `pacientes` | `{ cpf: 1 }` unique | Evita pacientes duplicados pelo CPF e acelera busca por CPF. |
| `pacientes` | `{ nome: 1 }` | Ajuda em buscas e filtros por nome. |
| `medicos` | `{ crm: 1 }` unique | Evita medicos duplicados pelo CRM. |
| `medicos` | `{ especialidadeId: 1 }` | Acelera consultas de medicos por especialidade. |
| `especialidades` | `{ nome: 1 }` unique | Evita especialidades duplicadas. |
| `consultas` | `{ pacienteId: 1, dataHora: -1 }` | Acelera historico de consultas por paciente. |
| `consultas` | `{ medicoId: 1, dataHora: -1 }` | Acelera agenda e historico por medico. |
| `consultas` | `{ especialidadeId: 1, status: 1 }` | Ajuda nos relatorios e filtros por especialidade e status. |

## Endpoints CRUD

As rotas seguem o mesmo padrao para:

- `/pacientes`
- `/medicos`
- `/especialidades`
- `/consultas`

| Metodo | Rota | Descricao |
|---|---|---|
| `POST` | `/recurso` | Insere um registro. |
| `POST` | `/recurso/lote` | Insere varios registros com `insertMany`. |
| `GET` | `/recurso/:id` | Busca por ID. |
| `GET` | `/recurso` | Busca com filtros, paginacao e projecao. |
| `PATCH` | `/recurso/:id` | Atualizacao parcial com `$set`. |
| `PATCH` | `/recurso/:id/array` | Atualizacao de array embutido com `$push`. |
| `DELETE` | `/recurso/:id` | Remove por ID. |
| `DELETE` | `/recurso` | Remove com filtro. |

### Filtros e projecao

Exemplos:

```text
GET /pacientes?nome=ana
GET /pacientes?fields=nome,email,telefone
GET /consultas?status=realizada&fields=dataHora,status,valor
GET /consultas?pacienteId=ID_DO_PACIENTE
```

## Relatorios com Aggregation Framework

O projeto possui 4 pipelines de agregacao, todos com pelo menos 3 estagios.

| Metodo | Rota | Descricao |
|---|---|---|
| `GET` | `/relatorios/consultas-por-especialidade` | Total de consultas e ticket medio por especialidade. |
| `GET` | `/relatorios/faturamento-por-medico` | Ranking de medicos por faturamento. |
| `GET` | `/relatorios/pacientes-mais-consultas` | Ranking de pacientes com mais consultas. |
| `GET` | `/relatorios/duracao-media-especialidade` | Duracao media das consultas por especialidade. |

Os pipelines utilizam operadores como:

- `$match`
- `$lookup`
- `$unwind`
- `$group`
- `$project`
- `$addFields`
- `$sort`
- `$limit`
- `$sum`
- `$avg`
- `$max`

## Respostas JSON

As respostas seguem um padrao:

```json
{
  "sucesso": true,
  "mensagem": "Consulta realizada com sucesso.",
  "dados": []
}
```

Em caso de erro:

```json
{
  "sucesso": false,
  "mensagem": "Registro nao encontrado."
}
```

Codigos HTTP usados:

- `200`: sucesso em consultas, updates e deletes.
- `201`: criacao de registros.
- `400`: erro de validacao, como ID invalido.
- `404`: rota ou registro nao encontrado.
- `500`: erro interno no servidor.

## Instalacao e execucao

Instale as dependencias:

```bash
npm install
```

Popule o banco com dados de teste:

```bash
npm run seed
```

Inicie o servidor em modo desenvolvimento:

```bash
npm run dev
```

Ou inicie em modo normal:

```bash
npm start
```

Ao iniciar, a API ficara disponivel em:

```text
http://localhost:3000
```

## Scripts

| Script | Descricao |
|---|---|
| `npm start` | Inicia a API com Node.js. |
| `npm run dev` | Inicia a API com nodemon. |
| `npm run seed` | Limpa e popula o banco com dados de teste, alem de criar indices. |



