/**
 * @param {import('knex').Knex} knex
 */
 exports.up = function(knex) {
  return knex.schema.createTable('session', table => {
    table.increments('id');
    table.text('token').notNullable();
    table.text('data');

    table
      .integer('userId')
      .unsigned()
      .references('id')
      .inTable('user')

    table.text('service');
      
    table
      .timestamp('createdAt')
      .notNullable();
  });
};

/**
 * @param {import('knex').Knex} knex
 */
exports.down = function(knex) {
  return knex.schema.dropTable('session');
};
