// server/routes/api.js
const express = require('express');
const router = express.Router();
const { TruckLog, Expense } = require('../models');

// --- Truck Log Routes ---
router.get('/truck-logs', async (req, res) => {
  try {
    const logs = await TruckLog.findAll({ order: [['createdAt', 'DESC']] });
    res.json(logs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/truck-logs', async (req, res) => {
  try {
    const newLog = await TruckLog.create(req.body);
    res.status(201).json(newLog);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// ✅ NOVA ROTA PUT PARA ATUALIZAR
router.put('/truck-logs/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [updated] = await TruckLog.update(req.body, { where: { id } });
    if (updated) {
      const updatedLog = await TruckLog.findOne({ where: { id } });
      res.status(200).json(updatedLog);
    } else {
      res.status(404).json({ error: 'Log not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/truck-logs/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await TruckLog.destroy({ where: { id } });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// --- Expense Routes ---
router.get('/expenses', async (req, res) => {
  try {
    const expenses = await Expense.findAll({ order: [['createdAt', 'DESC']] });
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/expenses', async (req, res) => {
  try {
    const newExpense = await Expense.create(req.body);
    res.status(201).json(newExpense);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// ✅ NOVA ROTA PUT PARA ATUALIZAR
router.put('/expenses/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [updated] = await Expense.update(req.body, { where: { id } });
    if (updated) {
      const updatedExpense = await Expense.findOne({ where: { id } });
      res.status(200).json(updatedExpense);
    } else {
      res.status(404).json({ error: 'Expense not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/expenses/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await Expense.destroy({ where: { id } });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
