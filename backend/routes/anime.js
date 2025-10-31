const express = require('express');
const router = express.Router();
const knex = require('knex')(require('../knexfile')[process.env.NODE_ENV || 'development']);

// Get all anime entries
router.get('/', async (req, res) => {
  try {
    const entries = await knex('anime_list')
      .where('user_id', 1)  // Using demo user
      .orderBy('created_at', 'desc');
    res.json(entries);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add new anime
router.post('/', async (req, res) => {
  try {
    const { title, genre, rating } = req.body;
    const [entry] = await knex('anime_list')
      .insert({
        user_id: 1, // Demo user
        title,
        status: 'plan_to_watch',
        episodes_watched: 0,
        total_episodes: null,
        rating: rating,
        genre: genre
      })
      .returning('*');
    res.status(201).json(entry);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update anime
router.put('/:id', async (req, res) => {
  try {
    const { title, genre, rating, status, episodes_watched, total_episodes } = req.body;
    const [entry] = await knex('anime_list')
      .where('id', req.params.id)
      .update({
        title,
        genre,
        rating,
        status,
        episodes_watched,
        total_episodes
      })
      .returning('*');
    if (!entry) {
      return res.status(404).json({ error: 'Anime not found' });
    }
    res.json(entry);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete anime
router.delete('/:id', async (req, res) => {
  try {
    const count = await knex('anime_list')
      .where('id', req.params.id)
      .del();
    if (!count) {
      return res.status(404).json({ error: 'Anime not found' });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;