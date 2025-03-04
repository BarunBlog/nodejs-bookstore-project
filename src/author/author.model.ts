import knex from '../db';
import { AuthorWithBooks } from './interface/author-with-books.interface';

export interface Author {
  id?: number;
  name: string;
  bio?: string;
  birthdate: string;
  user_id: number;
}

export const getAllAuthors = async (offset: number, limit: number) => {
  const authors = await knex('authors').select('authors.*').limit(limit).offset(offset);

  const countResult = await knex('authors').count('* as count').first();
  const total = countResult ? countResult.count : 0;

  return { authors, total };
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

export const getAllAuthorsWithBooks = async (): Promise<AuthorWithBooks[]> => {
  const results = await knex('authors')
    .leftJoin('books', 'authors.id', 'books.author_id')
    .select(
      'authors.id as author_id',
      'authors.name as author_name',
      'authors.bio as author_bio',
      'authors.birthdate as author_birthdate',
      'authors.user_id as author_user_id',
      'books.id as book_id',
      'books.title as book_title',
      'books.description as book_description',
      'books.published_date as book_published_date',
      'books.author_id as book_author_id'
    );

  const authorsMap: { [key: number]: AuthorWithBooks } = {};

  results.forEach(row => {
    if (!authorsMap[row.author_id]) {
      authorsMap[row.author_id] = {
        id: row.author_id,
        name: row.author_name,
        bio: row.author_bio,
        birthdate: row.author_birthdate,
        user_id: row.author_user_id,
        books: [],
      };
    }

    if (row.book_id) {
      authorsMap[row.author_id].books.push({
        id: row.book_id,
        title: row.book_title,
        description: row.book_description,
        published_date: row.book_published_date,
        author_id: row.book_author_id,
      });
    }
  });

  return Object.values(authorsMap);
};

export const getAuthorWithBooksById = async (authorId: number): Promise<AuthorWithBooks | null> => {
  const results = await knex('authors')
    .leftJoin('books', 'authors.id', 'books.author_id')
    .select(
      'authors.id as author_id',
      'authors.name as author_name',
      'authors.bio as author_bio',
      'authors.birthdate as author_birthdate',
      'authors.user_id as author_user_id',
      'books.id as book_id',
      'books.title as book_title',
      'books.description as book_description',
      'books.published_date as book_published_date',
      'books.author_id as book_author_id'
    )
    .where('authors.id', authorId);

  if (results.length === 0) {
    return null;
  }

  const authorWithBooks: AuthorWithBooks = {
    id: results[0].author_id,
    name: results[0].author_name,
    bio: results[0].author_bio,
    birthdate: results[0].author_birthdate,
    user_id: results[0].author_user_id,
    books: [],
  };

  results.forEach(row => {
    if (row.book_id) {
      authorWithBooks.books.push({
        id: row.book_id,
        title: row.book_title,
        description: row.book_description,
        published_date: row.book_published_date,
        author_id: row.book_author_id,
      });
    }
  });

  return authorWithBooks;
};
