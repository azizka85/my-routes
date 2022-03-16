/**
 * @param {import('knex').Knex} knex
 */
exports.up = function(knex) {
  return knex.schema.createTable('user', table => {
    table.increments('id');
    table.text('fullName').notNullable();
    table.text('email').notNullable();
    table.text('password').notNullable();
    table.text('photo').notNullable();
    
    table
      .timestamp('createdAt')
      .notNullable();

    table
      .timestamp('updatedAt')
      .notNullable();
  })
};

/**
 * @param {import('knex').Knex} knex
 */
exports.down = function(knex) {
  return knex.schema.dropTable('user');
};
