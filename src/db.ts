import knex from 'knex';
import KnexConfig from '../knexfile';

const environment = process.env.ENVIRONMENT || 'development';

const db = knex(KnexConfig[environment]);

export default db;
