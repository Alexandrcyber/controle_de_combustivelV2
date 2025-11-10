// server/models/index.js
const sequelize = require('../db');

// Importa os modelos
const TruckLog = require('./TruckLog');
const Expense = require('./Expense');

// Cria um objeto para agrupar os modelos e a instância do Sequelize
const db = {
  sequelize, // A instância da conexão
  Sequelize: require('sequelize'), // A própria biblioteca Sequelize
  TruckLog,
  Expense,
};

// Se houver associações entre modelos (ex: um caminhão tem várias despesas),
// elas seriam definidas aqui. Por enquanto, não é necessário.
// Ex: db.TruckLog.hasMany(db.Expense);
// db.Expense.belongsTo(db.TruckLog);

module.exports = db;
