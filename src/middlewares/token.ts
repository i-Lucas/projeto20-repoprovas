import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

export async function tokenValidate(req: Request, res: Response, next: NextFunction) {

	const { authorization } = req.headers;
	const token = authorization?.replace('Bearer ', '').trim();
	if (!token) throw { status: 401, message: 'Token not found' };

	const user = jwt.verify(token, process.env.SECRET_KEY);
	res.locals.user = user;

	next();
};