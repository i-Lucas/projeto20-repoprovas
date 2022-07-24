import app from '../../src/app.js';
import supertest from 'supertest';
import userFactory from './userFactory';

async function tokenGenerate() {

    const login = userFactory.loginGenerate();
    await userFactory.userGenerate(login);

    let response = await supertest(app).post('/signin').send(login);
    return response.text;
};

const tokenFactory = { tokenGenerate };
export default tokenFactory;