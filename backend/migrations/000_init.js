/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema
    .createTable('users', table => {
      table.increments('id').primary()
      table.string('username').notNullable().unique()
      table.string('email').notNullable().unique()
      table.string('password_hash').notNullable()
      table.timestamps(true, true)
    })
    
    .createTable('diary_entries', table => {
      table.increments('id').primary()
      table.integer('user_id').references('id').inTable('users').onDelete('CASCADE')
      table.string('title').notNullable()
      table.text('content').notNullable()
      table.string('mood')
      table.string('category') // 'personal' or 'work'
      table.timestamps(true, true)
    })
    
    .createTable('anime_list', table => {
      table.increments('id').primary()
      table.integer('user_id').references('id').inTable('users').onDelete('CASCADE')
      table.string('title').notNullable()
      table.string('status') // watching, completed, plan_to_watch
      table.integer('episodes_watched')
      table.integer('total_episodes')
      table.integer('rating')
      table.timestamps(true, true)
    })
    
    .createTable('expenses', table => {
      table.increments('id').primary()
      table.integer('user_id').references('id').inTable('users').onDelete('CASCADE')
      table.decimal('amount', 10, 2).notNullable()
      table.string('category').notNullable()
      table.string('description')
      table.date('date').notNullable()
      table.timestamps(true, true)
    })
    
    .createTable('tasks', table => {
      table.increments('id').primary()
      table.integer('user_id').references('id').inTable('users').onDelete('CASCADE')
      table.string('title').notNullable()
      table.text('description')
      table.string('status').defaultTo('pending')
      table.date('due_date')
      table.integer('priority').defaultTo(1)
      table.timestamps(true, true)
    })
    
    .createTable('pomodoro_sessions', table => {
      table.increments('id').primary()
      table.integer('user_id').references('id').inTable('users').onDelete('CASCADE')
      table.integer('duration').notNullable()
      table.timestamp('start_time').notNullable()
      table.timestamp('end_time')
      table.string('task_description')
      table.timestamps(true, true)
    })
    
    .createTable('skills', table => {
      table.increments('id').primary()
      table.integer('user_id').references('id').inTable('users').onDelete('CASCADE')
      table.string('name').notNullable()
      table.string('category')
      table.integer('proficiency_level')
      table.text('notes')
      table.timestamps(true, true)
    })
    
    .createTable('timetable_slots', table => {
      table.increments('id').primary()
      table.integer('user_id').references('id').inTable('users').onDelete('CASCADE')
      table.string('day_of_week').notNullable()
      table.time('start_time').notNullable()
      table.time('end_time').notNullable()
      table.string('activity').notNullable()
      table.text('notes')
      table.timestamps(true, true)
    })
    
    .createTable('projects', table => {
      table.increments('id').primary()
      table.integer('user_id').references('id').inTable('users').onDelete('CASCADE')
      table.string('name').notNullable()
      table.text('description')
      table.string('status').defaultTo('active')
      table.date('start_date')
      table.date('end_date')
      table.timestamps(true, true)
    })
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema
    .dropTableIfExists('projects')
    .dropTableIfExists('timetable_slots')
    .dropTableIfExists('skills')
    .dropTableIfExists('pomodoro_sessions')
    .dropTableIfExists('tasks')
    .dropTableIfExists('expenses')
    .dropTableIfExists('anime_list')
    .dropTableIfExists('diary_entries')
    .dropTableIfExists('users')
}