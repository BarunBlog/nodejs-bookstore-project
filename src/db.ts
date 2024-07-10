import knex from 'knex';
import { types } from 'pg';
import KnexConfig from '../knexfile';

const environment = process.env.ENVIRONMENT || 'development';

// List of PostgreSQL built-in date types
const typesToReset = [
  types.builtins.DATE,
  types.builtins.TIME,
  types.builtins.TIMETZ,
  types.builtins.TIMESTAMP,
  types.builtins.TIMESTAMPTZ,
];

// Function to reset PostgreSQL date parsers
function resetPgDateParsers() {
  for (const pgType of typesToReset) {
    types.setTypeParser(pgType, val => String(val)); // dates are returned as strings
  }
}

// Call the function to reset parsers
resetPgDateParsers();

const db = knex(KnexConfig[environment]);

export default db;
