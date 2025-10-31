const express = require('express');
const router = express.Router();
const knex = require('knex')(require('../knexfile')[process.env.NODE_ENV || 'development']);

// Get all diary entries
router.get('/', async (req, res) => {
  try {
    const entries = await knex('diary_entries')
      .select('*')
      .orderBy('created_at', 'desc');
    res.json(entries);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single diary entry
router.get('/:id', async (req, res) => {
  try {
    const entry = await knex('diary_entries')
      .where('id', req.params.id)
      .first();
    if (!entry) {
      return res.status(404).json({ error: 'Entry not found' });
    }
    res.json(entry);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create diary entry
router.post('/', async (req, res) => {
  try {
    const { title, content, image_path } = req.body;
    console.log('Received diary entry:', { title, content, image_path });

    if (!title || !content) {
      return res.status(400).json({ error: 'Title and content are required' });
    }

    const entry = await knex('diary_entries')
      .insert({
        user_id: 1, // Using demo user ID for now
        title,
        content,
        image_path,
        category: 'personal'
      });

    const insertedEntry = await knex('diary_entries')
      .where('id', entry[0])
      .first();

    console.log('Created diary entry:', insertedEntry);
    res.status(201).json(insertedEntry);
  } catch (error) {
    console.error('Error creating diary entry:', error);
    res.status(500).json({ error: error.message });
  }
});

// Update diary entry
router.put('/:id', async (req, res) => {
  try {
    const { title, content } = req.body;
    const [entry] = await knex('diary_entries')
      .where('id', req.params.id)
      .update({ title, content })
      .returning('*');
    if (!entry) {
      return res.status(404).json({ error: 'Entry not found' });
    }
    res.json(entry);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete diary entry
router.delete('/:id', async (req, res) => {
  try {
    const count = await knex('diary_entries')
      .where('id', req.params.id)
      .del();
    if (!count) {
      return res.status(404).json({ error: 'Entry not found' });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;