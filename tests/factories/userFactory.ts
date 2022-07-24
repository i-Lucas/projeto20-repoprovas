import bcrypt from 'bcrypt';
import { faker } from '@faker-js/faker';

import prisma from '../../src/config/db.js';

function loginGenerate() {
	const email = faker.internet.email();
	const password = faker.internet.password(10);
	return { email, password: password };
};

interface Login { email: string; password: string };

async function userGenerate(login: Login) {
	const user = await prisma.users.create({
		data: {
			email: login.email,
			password: bcrypt.hashSync(login.password, 12),
		},
	});

	return { ...user, password: login.password };
};

const userFactory = { loginGenerate, userGenerate };
export default userFactory;