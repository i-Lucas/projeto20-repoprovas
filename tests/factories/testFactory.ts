import { faker } from '@faker-js/faker';

function testGenerate() {
	return {
		name: faker.lorem.word(),
		pdfUrl: faker.internet.url(),
		categoryId: faker.datatype.number({ min: 1, max: 3 }),
		teacherDisciplineId: faker.datatype.number({ min: 1, max: 6 }),
	};
};

const testFactory = { testGenerate };
export default testFactory;