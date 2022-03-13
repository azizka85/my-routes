/**
 * @param {import('knex').Knex} knex
 */
 exports.up = function(knex) {
  return knex.schema.createTable('session', table => {
    table.increments('id');
    table.text('token').notNullable();

    table
      .integer('user_id')
      .notNullable()
      .unsigned()
      .references('id')
      .inTable('user')
      .onDelete('CASCADE');
      
    table
      .timestamp('created_at')
      .defaultTo(knex.fn.now())
      .notNullable();
  });
};

/**
 * @param {import('knex').Knex} knex
 */
exports.down = function(knex) {
  return knex.schema.dropTable('session');
};
