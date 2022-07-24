import { Request, Response } from 'express';

import { CreateTestData } from '../repositories/tests.js';
import testsService from '../services/tests.js';

async function create(req: Request, res: Response) {

	const data: CreateTestData = req.body;
	await testsService.create(data);

	res.sendStatus(201);
};

async function getByDisciplines(req: Request, res: Response) {

	const tests = await testsService.getByDisciplines();
	res.send(tests);
};

async function getByTeachers(req: Request, res: Response) {

	const tests = await testsService.getByTeachers();
	res.send(tests);
};

const testControllers = { create, getByDisciplines, getByTeachers };
export default testControllers;