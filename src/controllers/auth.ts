import { Request, Response } from 'express';

import { CreateUserData } from '../repositories/auth.js';
import authService from '../services/auth.js';

async function signup(req: Request, res: Response) {

	const body: { email: string; password: string; confirmPassword: string } = req.body;
	const data: CreateUserData = { email: body.email, password: body.password, };

	await authService.signup(data);
	res.sendStatus(201);
};

async function signin(req: Request, res: Response) {

	const data: CreateUserData = req.body;
	const token = await authService.signin(data);
	res.status(200).send(token);;
}

const authControllers = { signup, signin };
export default authControllers;