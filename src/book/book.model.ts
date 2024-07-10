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

export interface BookWithAuthor extends Book {
  author_name: string;
  author_bio: string;
  author_birthdate: string;
}

export const getAllBooks = async (offset: number, limit: number) => {
  const books = await knex('books').select('books.*').limit(limit).offset(offset);

  const countResult = await knex('books').count('* as count').first();
  const total = countResult ? countResult.count : 0;

  return { books, total };
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

export const getBookById = async (id: number): Promise<BookWithAuthor | null> => {
  const result = await knex('books')
    .join('authors', 'books.author_id', 'authors.id')
    .select(
      'books.id',
      'books.title',
      'books.description',
      'books.published_date',
      'books.author_id',
      'authors.name as author_name',
      'authors.bio as author_bio',
      'authors.birthdate as author_birthdate'
    )
    .where('books.id', id)
    .first();

  return result
    ? {
        id: result.id,
        title: result.title,
        description: result.description,
        published_date: result.published_date,
        author_id: result.author_id,
        author_name: result.author_name,
        author_bio: result.author_bio,
        author_birthdate: result.author_birthdate,
      }
    : null;
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
