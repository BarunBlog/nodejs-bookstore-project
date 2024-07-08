import express from 'express';
import { registerUser } from './auth.controller';
import { registerUserValidator } from './validator/register-user.validator';

const authRouter = express.Router();

authRouter.post('/register', registerUserValidator, registerUser);

export default authRouter;
