import { Book } from '../../book/book.model';
import { Author } from '../author.model';

export interface AuthorWithBooks extends Author {
  books: Book[];
}
