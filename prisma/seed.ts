import prisma from "../src/config/db.js";

async function main() {

	const terms = [
		{ number: 1 }, // 1
		{ number: 2 }, // 2
		{ number: 3 }, // 3
		{ number: 4 }, // 4
		{ number: 5 }, // 5
		{ number: 6 }, // 6
	];

	const categories = [
		{ name: "Projeto" }, // 1
		{ name: "Prática" }, // 2 
		{ name: "Recuperação" }, // 3
	];

	const teachers = [
		{ name: "Diego Pinho" }, // 1
		{ name: "Bruna Hamori" } // 2
	];

	const disciplines = [
		{ name: "HTML e CSS", termId: 1 }, // 1
		{ name: "JavaScript", termId: 2 }, // 2
		{ name: "React", termId: 3 }, // 3
		{ name: "Humildade", termId: 4 }, // 4
		{ name: "Planejamento", termId: 5 }, // 5
		{ name: "Autoconfiança", termId: 6 }, // 6
	];

	const teachersDisciplines = [
		{ teacherId: 1, disciplineId: 1 }, // 1
		{ teacherId: 1, disciplineId: 2 }, // 2
		{ teacherId: 1, disciplineId: 3 }, // 3
		{ teacherId: 2, disciplineId: 4 }, // 4
		{ teacherId: 2, disciplineId: 5 }, // 5
		{ teacherId: 2, disciplineId: 6 }, // 6
	];

	const tests = [
		{
			name: "Teste de HTML e CSS",
			pdfUrl: "https://www.google.com",
			categoryId: 1,
			teacherDisciplineId: 1,
		},
		{
			name: "Teste de HTML e CSS",
			pdfUrl: "https://www.google.com",
			categoryId: 2,
			teacherDisciplineId: 1,
		},
		{
			name: "Teste de Javascript",
			pdfUrl: "https://www.google.com",
			categoryId: 2,
			teacherDisciplineId: 2,
		},
		{
			name: "Teste de Javascript",
			pdfUrl: "https://www.google.com",
			categoryId: 3,
			teacherDisciplineId: 2,
		},
		{
			name: "Teste de React",
			pdfUrl: "https://www.google.com",
			categoryId: 3,
			teacherDisciplineId: 3,
		},
		{
			name: "Teste de Humildade",
			pdfUrl: "https://www.google.com",
			categoryId: 2,
			teacherDisciplineId: 4,
		},
		{
			name: "Teste de Planejamento",
			pdfUrl: "https://www.google.com",
			categoryId: 1,
			teacherDisciplineId: 5,
		},
		{
			name: "Teste de Autoconfiança",
			pdfUrl: "https://www.google.com",
			categoryId: 2,
			teacherDisciplineId: 6,
		},
		{
			name: "Teste de Autoconfiança",
			pdfUrl: "https://www.google.com",
			categoryId: 3,
			teacherDisciplineId: 6,
		},
		{
			name: "Teste de Planejamento",
			pdfUrl: "https://www.google.com",
			categoryId: 2,
			teacherDisciplineId: 5,
		}
	]

	await prisma.terms.createMany({ data: terms });
	await prisma.categories.createMany({ data: categories });
	await prisma.teachers.createMany({ data: teachers });
	await prisma.disciplines.createMany({ data: disciplines });
	await prisma.teachersDisciplines.createMany({ data: teachersDisciplines });
	await prisma.tests.createMany({ data: tests });
}

main().catch((e) => {
	console.log(e);
	process.exit(1);
}).finally(async () => {
	await prisma.$disconnect();
});