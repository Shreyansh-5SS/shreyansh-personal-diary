exports.up = function(knex) {
  return knex.schema.createTable('timetable_slots', table => {
    table.increments('id').primary();
    table.integer('user_id').notNullable().references('id').inTable('users');
    table.string('day_of_week').notNullable();
    table.string('start_time').notNullable();
    table.string('end_time').notNullable();
    table.string('activity').notNullable();
    table.text('notes');
    table.timestamps(true, true);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('timetable_slots');
};