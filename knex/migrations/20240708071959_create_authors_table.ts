import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('authors', table => {
    table.increments('id').primary();
    table.string('name').notNullable();
    table.text('bio').nullable();
    table.date('birthdate').notNullable();
    table.integer('user_id').unsigned().references('id').inTable('users').notNullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('authors');
}
