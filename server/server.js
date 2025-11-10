// server.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();

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
    
    await db.sequelize.sync({ alter: true });
    console.log('✅ All models were synchronized successfully.');

    // ✅ MUDANÇA: Bloco de 'seeding' (dados fixos) foi removido.
    // O servidor não irá mais inserir dados automaticamente.

    app.listen(PORT, () => {
      console.log(`🚀 Server is running on http://localhost:${PORT}` );
    });
  } catch (error) {
    console.error('Unable to connect to the database or start server:', error);
  }
};

connectAndSyncDb();
