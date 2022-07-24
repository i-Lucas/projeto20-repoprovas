import prisma from '../config/db.js';
import { tests } from '@prisma/client';

export type CreateTestData = Omit<tests, 'id'>;

async function findCategoryById(categoryId: number) {
	return await prisma.categories.findUnique({ where: { id: categoryId } });
};

async function findTeachersDisciplinesById(teacherDisciplineId: number) {
	return await prisma.teachersDisciplines.findUnique({ where: { id: teacherDisciplineId } });
};

async function insert(testData: CreateTestData) {
	await prisma.tests.create({ data: testData });
};

async function findByDiscipline() {
	const result = await prisma.terms.findMany({
		select: {
			number: true,
			disciplines: {
				select: {
					id: true,
					name: true,
					teachersDisciplines: {
						select: {
							teachers: { select: { name: true } },
							tests: {
								select: {
									name: true,
									pdfUrl: true,
									category: { select: { name: true } },
								},
							},
						},
					},
				},
			},
		},
	});

	return result;
};

async function findByTeacher() {
	const result = await prisma.teachers.findMany({
		select: {
			id: true,
			name: true,
			teachersDisciplines: {
				select: {
					disciplines: {
						select: {
							name: true,
							terms: { select: { number: true } },
						},
					},
					tests: {
						select: {
							name: true,
							pdfUrl: true,
							category: { select: { name: true } },
						},
					},
				},
			},
		},
	});

	return result;
};

const testsRepo = {
	insert,
	findByDiscipline,
	findByTeacher,
	findCategoryById,
	findTeachersDisciplinesById,
};

export default testsRepo;