import express from 'express';
import { loginUser, registerUser } from './auth.controller';
import { registerUserValidator } from './validator/register-user.validator';
import { loginUserValidator } from './validator/login-user.validator';

const authRouter = express.Router();

authRouter.post('/register', registerUserValidator, registerUser);
authRouter.post('/login', loginUserValidator, loginUser);

export default authRouter;
