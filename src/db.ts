import knex from 'knex';
import KnexConfig from '../knexfile';
import dotenv from 'dotenv';

dotenv.config();

const environment = process.env.ENVIRONMENT || "development";

const db = knex(KnexConfig[environment]);

export default db;