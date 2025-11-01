const express = require('express');
const router = express.Router();
const knex = require('knex')(require('../knexfile')[process.env.NODE_ENV || 'development']);

// Get all pomodoro sessions
router.get('/', async (req, res) => {
  try {
    const sessions = await knex('pomodoro_sessions')
      .where('user_id', 1)
      .orderBy('start_time', 'desc');
    res.json(sessions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get time per skill
router.get('/stats', async (req, res) => {
  try {
    const stats = await knex('pomodoro_sessions')
      .select('skills.name')
      .sum('duration as total_minutes')
      .leftJoin('skills', 'pomodoro_sessions.skill_id', 'skills.id')
      .where('pomodoro_sessions.user_id', 1)
      .groupBy('skills.name');
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new session
router.post('/', async (req, res) => {
  try {
    const { duration, task_id, skill_id, task_description } = req.body;
    const [session] = await knex('pomodoro_sessions')
      .insert({
        user_id: 1,
        duration,
        task_id,
        skill_id,
        task_description,
        start_time: new Date(),
        end_time: new Date(Date.now() + duration * 60000)
      })
      .returning('*');
    res.status(201).json(session);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update session
router.put('/:id', async (req, res) => {
  try {
    const [session] = await knex('pomodoro_sessions')
      .where('id', req.params.id)
      .update(req.body)
      .returning('*');
    res.json(session);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete session
router.delete('/:id', async (req, res) => {
  try {
    await knex('pomodoro_sessions')
      .where('id', req.params.id)
      .del();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;