const express = require('express');
const router = express.Router();
const knex = require('knex')(require('../knexfile')[process.env.NODE_ENV || 'development']);

// Get all slots
router.get('/', async (req, res) => {
  try {
    const slots = await knex('timetable_slots')
      .where('user_id', 1)
      .orderBy(['day_of_week', 'start_time']);
    res.json(slots);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create slot
router.post('/', async (req, res) => {
  try {
    const { day_of_week, start_time, end_time, activity, notes } = req.body;
    const [slot] = await knex('timetable_slots')
      .insert({
        user_id: 1,
        day_of_week,
        start_time,
        end_time,
        activity,
        notes
      })
      .returning('*');
    res.status(201).json(slot);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update slot
router.put('/:id', async (req, res) => {
  try {
    const [slot] = await knex('timetable_slots')
      .where('id', req.params.id)
      .update(req.body)
      .returning('*');
    res.json(slot);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete slot
router.delete('/:id', async (req, res) => {
  try {
    await knex('timetable_slots')
      .where('id', req.params.id)
      .del();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Suggest timetable slots
router.get('/suggest', async (req, res) => {
  try {
    // Get existing slots
    const existingSlots = await knex('timetable_slots')
      .where('user_id', 1)
      .select('day_of_week', 'start_time', 'end_time');

    // Get tasks that need scheduling
    const tasks = await knex('tasks')
      .where({ user_id: 1, status: 'TODO' })
      .orderBy('priority', 'desc');

    // Simple greedy algorithm for slot suggestion
    const suggestions = tasks.map(task => {
      // Find first available 1-hour slot
      const availableSlot = findNextAvailableSlot(existingSlots);
      return {
        task_id: task.id,
        task_title: task.title,
        ...availableSlot
      };
    });

    res.json(suggestions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Helper function to find next available slot
function findNextAvailableSlot(existingSlots) {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const defaultStartHour = 9; // 9 AM
  const defaultDuration = 1; // 1 hour

  for (const day of days) {
    for (let hour = defaultStartHour; hour < 17; hour++) { // 9 AM to 5 PM
      const startTime = `${hour.toString().padStart(2, '0')}:00`;
      const endTime = `${(hour + defaultDuration).toString().padStart(2, '0')}:00`;

      const conflicting = existingSlots.find(slot =>
        slot.day_of_week === day &&
        slot.start_time <= endTime &&
        slot.end_time >= startTime
      );

      if (!conflicting) {
        return {
          day_of_week: day,
          start_time: startTime,
          end_time: endTime
        };
      }
    }
  }

  return null;
}

module.exports = router;