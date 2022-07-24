import pkg from "@prisma/client";

const { PrismaClient } = pkg;
const prisma = new PrismaClient();
export default prisma;

connect();
async function connect() {
    try {
        await prisma.$connect(), console.log(`Connected to database ${new Date()}`);
    } catch (err) { console.error(`\n\nError connecting to database:\n\n${err}\n\n${new Date()}\n\n`) };
};