import knex from '../db';

export interface Author {
  id?: number;
  name: string;
  bio?: string;
  birthdate: Date;
  user_id: number;
}

export const getAllAuthors = async (): Promise<Author[]> => {
  return await knex('authors').select('*');
};

export const getAuthorById = async (id: number): Promise<Author> => {
  return await knex('authors').where({ id }).first();
};

export const getAuthorByUserId = async (userId: number): Promise<Author | null> => {
  const author = await knex('authors').where({ user_id: userId }).first();
  return author || null;
};

export const createAuthor = async (author: Author): Promise<number[]> => {
  return await knex('authors').insert(author);
};

export const updateAuthor = async (id: number, author: Partial<Author>): Promise<number> => {
  return await knex('authors').where({ id }).update(author);
};

export const deleteAuthor = async (id: number): Promise<number> => {
  return await knex('authors').where({ id }).delete();
};
