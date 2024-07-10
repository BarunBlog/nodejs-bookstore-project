# Bookstore-Project

This is the completed backend component of the Bookstore system application built with NodeJS, ExpressJS, and TypeScript.

## Technology used

NodeJS, ExpressJS, and TypeScript, and PostgreSQL as the database.

## Features

- JWT Authentication
- CRUD operations for authors and books
- Pagination for listing authors and books
- Input validation using `express-validator`
- Error handling with custom error classes
- Logging with Winston

# Prerequisites

1. To run this project you need to install NodeJs and PostgreSQL on your system.

# Installation

1. Clone the repository:
2. Change directory to nodejs-bookstore-project by running `cd nodejs-bookstore-project`
3. Run `npm install` command.
4. Set up following environment variables:

```
ENVIRONMENT=development
PORT=3000

DB_HOST=localhost
DB_USER=postgres
DB_PASSWORD=your_pass
DB_NAME=your_name

JWT_SECRET=ILHad@nkgkajlsng34656bGfdjchiuqwz19^dg
JWT_EXPIRATION=24h
```

Create a .env file in the root directory and provide the required values for environment variables such as database credentials. Make sure you have a database with the same name as `DB_NAME` locally on your system.

# Migrate Scripts into database

Run the following command to create the database schema using migration files:
`npx knex migrate:latest`

# Start the Server

Run the following command to start the server
`npm run dev`
