import supertest from 'supertest';

import app from '../src/app.js';
import prisma from '../src/config/db.js';
import userFactory from './factories/userFactory.js';
import testFactory from './factories/testFactory.js';
import tokenFactory from './factories/tokenFactory.js';

beforeAll(async () => {
	await prisma.$executeRaw`TRUNCATE TABLE users CASCADE;`;
	await prisma.$executeRaw`TRUNCATE TABLE tests CASCADE;`;
});

describe('signup tests', () => {

	const duplicated = userFactory.loginGenerate();

	it('signup valid -> status 201', async () => {
		const response = await supertest(app).post('/signup')
			.send({ ...duplicated, confirm: duplicated.password });
		expect(response.status).toEqual(201);
	});

	it('duplicate signup -> status 409', async () => {

		const response = await supertest(app).post('/signup')
			.send({ ...duplicated, confirm: duplicated.password });
		expect(response.status).toEqual(409);
	});

	it('invalid signup -> status 422', async () => {

		const login = userFactory.loginGenerate();
		delete login.password;
		const response = await supertest(app).post('/signup').send(login);
		expect(response.status).toEqual(422);
	});
});

describe('signin tests', () => {

	it('valid signin -> return token', async () => {

		const login = userFactory.loginGenerate();
		const user = await userFactory.userGenerate(login);

		const response = await supertest(app).post('/signin')
			.send({ email: user.email, password: user.password, });

		const token = response.text;
		expect(token).not.toBeNull();
	});

	it('wrong email or password -> status 401', async () => {

		const login = userFactory.loginGenerate();
		const user = userFactory.userGenerate(login);

		const response = await supertest(app).post('/sign-in')
			.send({ ...user, password: 'badpassword' });
		expect(response.status).toEqual(401);
	});

	it('invalid input -> status 422', async () => {

		const response = await supertest(app).post('/signin')
			.send({ email: 'invalidemail', password: 'badbad' });
		expect(response.status).toEqual(422);
	});
});

describe('/tests route', () => {

	it('create test', async () => {

		const token = await tokenFactory.tokenGenerate();
		const test = testFactory.testGenerate();

		const response = await supertest(app).post('/tests')
			.send(test).set('Authorization', `Bearer ${token}`);

		expect(response.status).toEqual(201);
		const Iexist = await prisma.tests.findFirst({ where: { name: test.name, pdfUrl: test.pdfUrl }, });
		expect(test.name).toBe(Iexist.name);
	});

	it('no token -> status 401', async () => {
		const test = testFactory.testGenerate();
		let response = await supertest(app).post('/tests').send(test);
		expect(response.status).toEqual(401);
	});

	it('invalid test schema -> status 422', async () => {

		const token = await tokenFactory.tokenGenerate();
		const test = testFactory.testGenerate();
		delete test.categoryId;

		const response = await supertest(app).post('/tests')
			.send(test).set('Authorization', `Bearer ${token}`);
		expect(response.status).toEqual(422);
	});

	it('invalid category -> status 404', async () => {

		const token = await tokenFactory.tokenGenerate();
		const test = testFactory.testGenerate();

		const INVALID_CATEGORY = 100;
		test.categoryId = INVALID_CATEGORY;

		const response = await supertest(app)
			.post('/tests')
			.send(test)
			.set('Authorization', `Bearer ${token}`);

		expect(response.status).toEqual(404);
	});

	it('invalid teacher-discipline -> status 404', async () => {

		const token = await tokenFactory.tokenGenerate();
		const test = testFactory.testGenerate();

		const INVALID_TEACHER_DISCIPLINE_ID = 100;
		test.teacherDisciplineId = INVALID_TEACHER_DISCIPLINE_ID;

		const response = await supertest(app)
			.post('/tests')
			.send(test)
			.set('Authorization', `Bearer ${token}`);

		expect(response.status).toEqual(404);
	});
});

describe('/tests/disciplines route', () => {

	it('get tests by discipline', async () => {

		const token = await tokenFactory.tokenGenerate();
		const test = testFactory.testGenerate();

		let response = await supertest(app)
			.post('/tests')
			.send(test)
			.set('Authorization', `Bearer ${token}`);

		response = await supertest(app)
			.get('/tests/disciplines')
			.set('Authorization', `Bearer ${token}`);

		expect(response.body).not.toBeNull();
		expect(response.status).toEqual(200);
	});
});

describe('/tests/teachers route', () => {

	it(' get tests by teachers', async () => {

		const token = await tokenFactory.tokenGenerate();
		const test = testFactory.testGenerate();

		let response = await supertest(app)
			.post('/tests')
			.send(test)
			.set('Authorization', `Bearer ${token}`);

		response = await supertest(app)
			.get('/tests/teachers')
			.set('Authorization', `Bearer ${token}`);

		expect(response.body).not.toBeNull();
		expect(response.status).toEqual(200);
	});
});

afterAll(async () => await prisma.$disconnect());