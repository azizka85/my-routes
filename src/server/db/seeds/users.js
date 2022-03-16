const { generateMD5Hash } = require('../helpers');

/**
 * @param {import('knex').Knex} knex
 */
exports.seed = function(knex) {  
  return knex('user')
    .del()
    .then(function () {
      return knex('user').insert([{
        id: 1, 
        fullName: 'Aziz Kudaikulov',
        email: 'aziz.kudaikulov@gmail.com',
        password: generateMD5Hash('lock'),
        photo: 'https://docs.google.com/uc?id=1PgAGg8e_zVUG32RM7_BYyoDxZt8YsDfy',
        createdAt: Date.now(),
        updatedAt: Date.now()        
      }]);
    });
};
