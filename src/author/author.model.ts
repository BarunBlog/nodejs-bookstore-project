import knex from '../db';

export interface Author {
  id?: number;
  name: string;
  bio?: string;
  birthdate: Date;
}

export const getAllAuthors = async (): Promise<Author[]> => {
  return knex('authors').select('*');
};

export const getAuthorById = async (id: number): Promise<Author> => {
  return knex('authors').where({ id }).first();
};

export const createAuthor = async (author: Author): Promise<number[]> => {
  return knex('authors').insert(author);
};

export const updateAuthor = async (id: number, author: Partial<Author>): Promise<number> => {
  return knex('authors').where({ id }).update(author);
};

export const deleteAuthor = async (id: number): Promise<number> => {
  return knex('authors').where({ id }).delete();
};
