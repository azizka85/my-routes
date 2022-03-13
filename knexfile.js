const { join } = require('path');
const { cwd } = require('process');

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
module.exports = {

  development: {
    client: 'sqlite3',
    connection: {
      filename: join(cwd(), 'db.sqlite3')
    },
    migrations: {
      directory: join(cwd(), 'src/server/db/migrations')
    },
    seeds: {
      directory: join(cwd(), 'src/server/db/seeds')
    },
    useNullAsDefault: true
  },

  production: {
    client: 'postgresql',
    connection: {
      database: 'my_db',
      user:     'username',
      password: 'password'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      directory: join(cwd(), 'src/server/db/migrations')
    },
    seeds: {
      directory: join(cwd(), 'src/server/db/seeds')
    },
    useNullAsDefault: true
  }

};
