import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('books', table => {
    table.increments('id').primary();
    table.string('title').notNullable();
    table.text('description').nullable();
    table.date('published_date').notNullable();
    table.integer('author_id').unsigned().references('id').inTable('authors').notNullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('books');
}
