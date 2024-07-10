import knex from '../db';
import { getBookPayload } from './interface/get-book-payload.interface';
import { getBooksPayload } from './interface/get-books-payload.interface';

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

export const getBooks = async (getBooksPayload: getBooksPayload): Promise<Book[]> => {
  const query = knex('books').select('*');

  if (getBooksPayload.book_id) {
    query.where('id', getBooksPayload.book_id);
  }

  if (getBooksPayload.author_id) {
    query.where('author_id', getBooksPayload.author_id);
  }

  if (getBooksPayload.user_id) {
    query.join('authors', 'books.author_id', 'authors.id').where('authors.user_id', getBooksPayload.user_id);
  }

  return query;
};

export const getBookById = async (id: number): Promise<Book> => {
  return await knex('books').where({ id }).first();
};

export const getBook = async (getBookPayload: getBookPayload): Promise<Book> => {
  let query = knex('books as b')
    .select('b.*')
    .leftJoin('authors as a', 'b.author_id', 'a.id')
    .leftJoin('users as u', 'a.user_id', 'u.id');

  if (getBookPayload.book_id) {
    query = query.where('b.id', getBookPayload.book_id);
  }

  if (getBookPayload.user_id) {
    query = query.andWhere('u.id', getBookPayload.user_id);
  }

  if (getBookPayload.author_id) {
    query = query.andWhere('a.id', getBookPayload.author_id);
  }

  const book = await query.first();
  return book;
};

export const createBook = async (book: Book): Promise<number[]> => {
  return await knex('books').insert(book);
};

export const updateBook = async (id: number, book: Partial<Book>): Promise<number> => {
  return await knex('books').where({ id }).update(book);
};

export const deleteBook = async (id: number): Promise<number> => {
  return await knex('books').where({ id }).delete();
};
