import knex from '../db';

export interface Book {
  id?: number;
  title: string;
  description?: string;
  published_date: string;
  author_id: number;
}

export const getAllBooks = async (): Promise<Book[]> => {
  return await knex('books').select('*');
};

export const getBookById = async (id: number): Promise<Book> => {
  return await knex('books').where({ id }).first();
};

export const createBook = async (book: Book): Promise<number[]> => {
  return await knex('books').insert(book);
};

export const updateBook = async (id: number, book: Partial<Book>): Promise<number> => {
  return await knex('books').where({ id }).update(book);
};

export const deleteBook = async (id: number): Promise<number> => {
  return await knex('book').where({ id }).delete();
};
