import Knex from 'knex';

import configs from '../../../knexfile';

import '../init-environment';

const environment = process.env.NODE_ENV !== 'production' ? 'development' : 'production';

const config = configs[environment];

export default Knex(config);
