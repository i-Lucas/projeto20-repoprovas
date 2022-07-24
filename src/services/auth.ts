import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import userRepo, { CreateUserData } from '../repositories/auth.js';

async function signup(data: CreateUserData) {

	data.email = data.email.toLowerCase();
	const { email, password } = data;

	const user = await userRepo.findByEmail(email);
	if (user) throw { status: 409, message: 'Email already in use' };

	data.password = await bcrypt.hash(password, 10);
	await userRepo.insert(data);
};

async function signin(data: CreateUserData) {

	const { email, password } = data;
	const user = await userRepo.findByEmail(email);

	if (!user) throw { status: 404, message: 'User not found' };
	if (!(await bcrypt.compare(password, user.password))) throw { status: 401, message: 'Invalid password' };

	const expiresIn = 60 * 60; // 1 hour
	const token = jwt.sign({ id: user.id, email }, process.env.SECRET_KEY, { expiresIn });
	return token;
};

const authServices = { signup, signin };
export default authServices;