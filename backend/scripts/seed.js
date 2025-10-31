const bcrypt = require('bcrypt');

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Clean all existing tables
  await knex('projects').del()
  await knex('timetable_slots').del()
  await knex('skills').del()
  await knex('pomodoro_sessions').del()
  await knex('tasks').del()
  await knex('expenses').del()
  await knex('anime_list').del()
  await knex('diary_entries').del()
  await knex('users').del()

  // Create demo user
  const password = 'demo123'
  const salt = await bcrypt.genSalt(10)
  const passwordHash = await bcrypt.hash(password, salt)

  const [userId] = await knex('users').insert({
    username: 'demo',
    email: 'demo@example.com',
    password_hash: passwordHash
  }).returning('id')

  // Seed diary entries
  await knex('diary_entries').insert([
    {
      user_id: userId,
      title: 'First Day at Work',
      content: 'Today was my first day at the new job. Exciting times ahead!',
      mood: 'excited',
      category: 'work'
    },
    {
      user_id: userId,
      title: 'Weekend Plans',
      content: 'Planning to watch anime and code this weekend.',
      mood: 'happy',
      category: 'personal'
    }
  ])

  // Seed anime list
  await knex('anime_list').insert([
    {
      user_id: userId,
      title: 'One Piece',
      status: 'watching',
      episodes_watched: 950,
      total_episodes: 1000,
      rating: 5
    },
    {
      user_id: userId,
      title: 'Death Note',
      status: 'completed',
      episodes_watched: 37,
      total_episodes: 37,
      rating: 5
    }
  ])

  // Seed expenses
  await knex('expenses').insert([
    {
      user_id: userId,
      amount: 50.00,
      category: 'Food',
      description: 'Grocery shopping',
      date: new Date()
    },
    {
      user_id: userId,
      amount: 15.00,
      category: 'Entertainment',
      description: 'Movie ticket',
      date: new Date()
    }
  ])

  // Seed tasks
  await knex('tasks').insert([
    {
      user_id: userId,
      title: 'Complete project proposal',
      description: 'Write and submit Q4 project proposal',
      status: 'pending',
      due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      priority: 1
    },
    {
      user_id: userId,
      title: 'Learn React hooks',
      description: 'Study useEffect and useContext',
      status: 'in_progress',
      due_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      priority: 2
    }
  ])

  // Seed pomodoro sessions
  await knex('pomodoro_sessions').insert([
    {
      user_id: userId,
      duration: 25,
      start_time: new Date(),
      end_time: new Date(Date.now() + 25 * 60 * 1000),
      task_description: 'Coding practice'
    }
  ])

  // Seed skills
  await knex('skills').insert([
    {
      user_id: userId,
      name: 'JavaScript',
      category: 'Programming',
      proficiency_level: 4,
      notes: 'Comfortable with ES6+ features'
    },
    {
      user_id: userId,
      name: 'React',
      category: 'Programming',
      proficiency_level: 3,
      notes: 'Learning hooks and context'
    }
  ])

  // Seed timetable slots
  await knex('timetable_slots').insert([
    {
      user_id: userId,
      day_of_week: 'Monday',
      start_time: '09:00',
      end_time: '12:00',
      activity: 'Work',
      notes: 'Team meetings and coding'
    },
    {
      user_id: userId,
      day_of_week: 'Monday',
      start_time: '14:00',
      end_time: '17:00',
      activity: 'Study',
      notes: 'Learning new technologies'
    }
  ])

  // Seed projects
  await knex('projects').insert([
    {
      user_id: userId,
      name: 'Personal Website',
      description: 'Building my portfolio website',
      status: 'active',
      start_date: new Date(),
      end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    },
    {
      user_id: userId,
      name: 'Learn TypeScript',
      description: 'Study and practice TypeScript',
      status: 'planning',
      start_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      end_date: new Date(Date.now() + 37 * 24 * 60 * 60 * 1000)
    }
  ])
}