import { CreateTestData } from '../repositories/tests.js';
import testsRepo from '../repositories/tests.js';

async function create(testData: CreateTestData) {

	const category = await testsRepo.findCategoryById(testData.categoryId);
	if (!category) throw { status: 404, message: 'Category not found' };

	const teacherDiscipline = await testsRepo.findTeachersDisciplinesById(testData.teacherDisciplineId);
	if (!teacherDiscipline) throw { status: 404, message: 'Teacher-discipline not found' };

	await testsRepo.insert(testData);
};

async function getByDisciplines() {
	return await testsRepo.findByDiscipline();
};

async function getByTeachers() {
	return await testsRepo.findByTeacher();
};

const testServices = { create, getByDisciplines, getByTeachers };
export default testServices;