/**
 * @param {import('knex').Knex} knex
 */
exports.up = function(knex) {
  return knex.schema.createTable('user', table => {
    table.increments('id');
    table.text('full_name').notNullable();
    table.text('email').notNullable();
    table.text('password').notNullable();
    table.text('photo').notNullable();
    
    table
      .timestamp('created_at')
      .notNullable();

    table
      .timestamp('updated_at')
      .notNullable();
  })
};

/**
 * @param {import('knex').Knex} knex
 */
exports.down = function(knex) {
  return knex.schema.dropTable('user');
};
