import express, { Express } from 'express';
import dotenv from 'dotenv';
import { errorHandler } from './middleware/error-handler';
import authRouter from './auth/auth.route';
import logger from './utils/logger';
import authorRouter from './author/author.route';
import bookRouter from './book/book.router';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Register routes
app.use('/auth', authRouter);
app.use('/authors', authorRouter);
app.use('/books', bookRouter);

// Register the centralized error handling middleware
app.use(errorHandler);

app.listen(port, () => {
  logger.info(`[server]: Server is running at http://localhost:${port}`);
});
