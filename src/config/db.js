const { MongoClient } = require("mongodb");
require("dotenv").config();

const uri = process.env.MONGO_URI || "mongodb://localhost:27017";
const databaseName = process.env.DATABASE_NAME || "clinica_medica";

const client = new MongoClient(uri);
let database;

async function connectToDatabase() {
  if (!database) {
    await client.connect();
    database = client.db(databaseName);
    console.log(`MongoDB conectado ao banco ${databaseName}`);
  }

  return database;
}

function getDatabase() {
  if (!database) {
    throw new Error("Banco de dados nao conectado.");
  }

  return database;
}

async function closeConnection() {
  await client.close();
  database = null;
}

module.exports = {
  connectToDatabase,
  getDatabase,
  closeConnection,
};
