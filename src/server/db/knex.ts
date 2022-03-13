import Knex from 'knex';

import configs from '../../../knexfile';

import '../init-environment';

const environment = process.env.NODE_ENV || 'development';

const config = configs[environment];

export default Knex(config);
