const { Sequelize } = require('sequelize');
require('dotenv').config();

let sequelize;

if (process.env.DATABASE_URL) {
  // Configuração para ambiente de produção (Neon DB)
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    protocol: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    },
    logging: false
  });
} else {
  // Configuração para ambiente local
  sequelize = new Sequelize({
    database: process.env.DB_NAME || 'controle_combustivel',
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || '11janeiro',
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres',
    logging: false
  });
}

module.exports = sequelize;
