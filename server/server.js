// server.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();

// ✅ Importa o objeto 'db' centralizado que contém a instância do sequelize e os modelos
const db = require('./models'); 
const apiRoutes = require('./routes/api');

const app = express();
const PORT = process.env.PORT || 3001;

// Configuração de CORS
const corsOptions = {
  origin: 'https://gestao-unidade-sc.netlify.app',
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions ));
app.use(express.json());

// Rotas
app.get('/api/health', (req, res) => res.status(200).json({ status: 'OK' }));
app.use('/api', apiRoutes);

// Conexão e Sincronização com o Banco de Dados
const connectAndSyncDb = async () => {
  try {
    await db.sequelize.authenticate();
    console.log('✅ Database connection has been established successfully.');
    
    // ✅ Sincroniza todos os modelos definidos no objeto 'db'
    await db.sequelize.sync({ alter: true }); // 'alter: true' é mais seguro em produção que 'force: true'
    console.log('✅ All models were synchronized successfully.');

    // Opcional: Seeding (seu código para popular o banco de dados)
    const logCount = await db.TruckLog.count();
    const expenseCount = await db.Expense.count();
    if (logCount === 0 && expenseCount === 0) {
      console.log('Database is empty, seeding with initial data...');
      // ... seu código de .bulkCreate ...
      console.log('✅ Database seeded successfully.');
    }

    app.listen(PORT, () => {
      console.log(`🚀 Server is running on http://localhost:${PORT}` );
    });
  } catch (error) {
    console.error('Unable to connect to the database or start server:', error);
  }
};

connectAndSyncDb();
