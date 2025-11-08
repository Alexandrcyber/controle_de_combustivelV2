const express = require('express');
const cors = require('cors');
require('dotenv').config();

const sequelize = require('./db');
const apiRoutes = require('./routes/api');
const TruckLog = require('./models/TruckLog');
const Expense = require('./models/Expense');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Health check route
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

// API Routes
app.use('/api', apiRoutes);

// Database connection and table creation
const connectAndSyncDb = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connection has been established successfully.');
    
    // This creates tables if they don't exist (and does nothing if they already exist)
    await sequelize.sync(); 
    console.log('✅ All models were synchronized successfully.');

    // Optional: Seed database with initial data if it's empty
    const logCount = await TruckLog.count();
    const expenseCount = await Expense.count();
    if (logCount === 0 && expenseCount === 0) {
      console.log('Database is empty, seeding with initial data...');
      await TruckLog.bulkCreate([
          { truckModel: 'Volvo FH', licensePlate: 'ABC-1234', month: '2024-06', initialKm: 100000, finalKm: 105000, fuelPricePerLiter: 5.50, totalFuelCost: 5500, idealKmLRoute: 2.8, route: 'São Paulo - Rio de Janeiro', gasStation: 'Posto Shell' },
          { truckModel: 'Scania R450', licensePlate: 'DEF-5678', month: '2024-06', initialKm: 80000, finalKm: 84000, fuelPricePerLiter: 5.60, totalFuelCost: 4480, idealKmLRoute: 3.0, route: 'Curitiba - Porto Alegre', gasStation: 'Posto Ipiranga' },
          { truckModel: 'Volvo FH', licensePlate: 'ABC-1234', month: '2024-07', initialKm: 105000, finalKm: 110000, fuelPricePerLiter: 5.75, totalFuelCost: 5750, idealKmLRoute: 2.8, route: 'São Paulo - Rio de Janeiro', gasStation: 'Posto Petrobras' },
      ]);
      await Expense.bulkCreate([
          { month: '2024-06', supplier: 'Borracharia Zé', description: 'Troca de Pneu', cost: 1200 },
          { month: '2024-07', supplier: 'Oficina Mecânica', description: 'Revisão Motor', cost: 3500 },
      ]);
      console.log('✅ Database seeded successfully.');
    }

    // Start server
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Unable to connect to the database or start server:', error);
  }
};

connectAndSyncDb();
