import db from '../db';

export interface User {
  id?: number;
  username: string;
  email: string;
  password: string;
}

export const getAllUsers = async (): Promise<User[]> => {
  return db('users').select('*');
};

export const getUserById = async (id: number): Promise<User> => {
  return db('users').where({ id }).first();
};

export const getUserByUsername = async (username: string): Promise<User> => {
  return db('users').where({ username: username }).first();
}

export const createUser = async (user: User): Promise<number[]> => {
  return db('users').insert(user);
};

export const updateUser = async (id: number, user: Partial<User>): Promise<number> => {
  return db('users').where({ id }).update(user);
};

export const deleteUser = async (id: number): Promise<number> => {
  return db('users').where({ id }).delete();
};
