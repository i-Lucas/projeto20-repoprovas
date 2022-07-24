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

	it('invalid signup password -> status 422', async () => {

		const login = userFactory.loginGenerate();
		delete login.password;
		const response = await supertest(app).post('/signup').send(login);
		expect(response.status).toEqual(422);
	});

	it('invalid signup email -> status 422', async () => {

		const login = userFactory.loginGenerate();
		delete login.email;
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

	it('wrong password -> status 401', async () => {

		const login = userFactory.loginGenerate();
		const user = await userFactory.userGenerate(login);
		delete user.id;

		const response = await supertest(app).post('/signin')
			.send({ ...user, password: 'badpassword' });
		expect(response.status).toEqual(401);
	});

	it('invalid email -> status 422', async () => {

		const response = await supertest(app).post('/signin')
			.send({ email: 'invalidemail', password: 'badbad' });
		expect(response.status).toEqual(422);
	});

	it('user not found -> status 404', async () => {

		const response = await supertest(app).post('/signin')
			.send({ email: 'invalidemail@test.com', password: 'badbad' });
		expect(response.status).toEqual(404);
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

	it('invalid test schema category id -> status 422', async () => {

		const token = await tokenFactory.tokenGenerate();
		const test = testFactory.testGenerate();
		delete test.categoryId;

		const response = await supertest(app).post('/tests')
			.send(test).set('Authorization', `Bearer ${token}`);
		expect(response.status).toEqual(422);
	});

	it('invalid test schema pdf -> status 422', async () => {

		const token = await tokenFactory.tokenGenerate();
		const test = testFactory.testGenerate();
		delete test.pdfUrl;

		const response = await supertest(app).post('/tests')
			.send(test).set('Authorization', `Bearer ${token}`);
		expect(response.status).toEqual(422);
	});

	it('invalid test schema name -> status 422', async () => {

		const token = await tokenFactory.tokenGenerate();
		const test = testFactory.testGenerate();
		delete test.name;

		const response = await supertest(app).post('/tests')
			.send(test).set('Authorization', `Bearer ${token}`);
		expect(response.status).toEqual(422);
	});

	it('invalid test schema name typeof -> status 422', async () => {
		
		const token = await tokenFactory.tokenGenerate();
		const test = testFactory.testGenerate();
		// @ts-ignore
		test.name = 123;

		const response = await supertest(app).post('/tests')
			.send(test).set('Authorization', `Bearer ${token}`);
		expect(response.status).toEqual(422);
	});

	it('invalid test schema pdf url typeof -> status 422', async () => {

		const token = await tokenFactory.tokenGenerate();
		const test = testFactory.testGenerate();
		test.pdfUrl = 'invalidurl';

		const response = await supertest(app).post('/tests')
			.send(test).set('Authorization', `Bearer ${token}`);
		expect(response.status).toEqual(422);
	});

	it('invalid category -> status 404', async () => {

		const token = await tokenFactory.tokenGenerate();
		const test = testFactory.testGenerate();

		const invalid = 100;
		test.categoryId = invalid;

		const response = await supertest(app)
			.post('/tests')
			.send(test)
			.set('Authorization', `Bearer ${token}`);

		expect(response.status).toEqual(404);
	});

	it('invalid teacher-discipline -> status 404', async () => {

		const token = await tokenFactory.tokenGenerate();
		const test = testFactory.testGenerate();

		const invalid = 100;
		test.teacherDisciplineId = invalid;

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

	it('get tests by discipline no token -> status 401', async () => {

		const response = await supertest(app)
			.get('/tests/disciplines');
		expect(response.status).toEqual(401);
	});

	it('get tests by discipline invalid token -> status 401', async () => {

		const response = await supertest(app)
			.get('/tests/disciplines')
			.set('Authorization', `Bearer invalidtoken`);
		expect(response.status).toEqual(401);
	});
});

describe('/tests/teachers route', () => {

	it('get tests by teachers', async () => {

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

	it('get tests by teachers no token -> status 401', async () => {

		const response = await supertest(app)
			.get('/tests/teachers');
		expect(response.status).toEqual(401);
	});

	it('get tests by teachers invalid token -> status 401', async () => {

		const response = await supertest(app)
			.get('/tests/teachers')
			.set('Authorization', `Bearer invalidtoken`);
		expect(response.status).toEqual(401);
	});
});

afterAll(async () => await prisma.$disconnect());