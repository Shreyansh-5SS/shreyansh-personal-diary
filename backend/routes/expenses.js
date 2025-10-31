const express = require('express');
const router = express.Router();
const knex = require('knex')(require('../knexfile')[process.env.NODE_ENV || 'development']);

// Get all expenses
router.get('/', async (req, res) => {
  try {
    const expenses = await knex('expenses')
      .where('user_id', 1)  // Using demo user
      .orderBy('date', 'desc');
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get expenses summary by category
router.get('/summary', async (req, res) => {
  try {
    const summary = await knex('expenses')
      .where('user_id', 1)
      .select('category')
      .sum('amount as total')
      .groupBy('category');
    res.json(summary);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add new expense
router.post('/', async (req, res) => {
  try {
    const { amount, category, description, date } = req.body;
    const [expense] = await knex('expenses')
      .insert({
        user_id: 1, // Demo user
        amount,
        category,
        description,
        date: date || new Date()
      })
      .returning('*');
    res.status(201).json(expense);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete expense
router.delete('/:id', async (req, res) => {
  try {
    const count = await knex('expenses')
      .where('id', req.params.id)
      .del();
    if (!count) {
      return res.status(404).json({ error: 'Expense not found' });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;