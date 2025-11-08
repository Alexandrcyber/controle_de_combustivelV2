const express = require('express');
const router = express.Router();
const TruckLog = require('../models/TruckLog');
const Expense = require('../models/Expense');

// Truck Log Routes
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

router.delete('/truck-logs/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await TruckLog.destroy({ where: { id } });
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'Log not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Expense Routes
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

router.delete('/expenses/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Expense.destroy({ where: { id } });
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'Expense not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
