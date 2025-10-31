const express = require('express');
const router = express.Router();
const knex = require('knex')(require('../knexfile')[process.env.NODE_ENV || 'development']);

// Get all tasks
router.get('/', async (req, res) => {
  try {
    const tasks = await knex('tasks')
      .where('user_id', 1)  // Using demo user
      .orderBy(['priority', 'created_at']);
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create task
router.post('/', async (req, res) => {
  try {
    const { title, description, priority, due_date, status } = req.body;
    const [task] = await knex('tasks')
      .insert({
        user_id: 1, // Demo user
        title,
        description,
        priority,
        due_date,
        status
      })
      .returning('*');
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update task
router.put('/:id', async (req, res) => {
  try {
    const [task] = await knex('tasks')
      .where('id', req.params.id)
      .update(req.body)
      .returning('*');
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.json(task);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete task
router.delete('/:id', async (req, res) => {
  try {
    const count = await knex('tasks')
      .where('id', req.params.id)
      .del();
    if (!count) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;