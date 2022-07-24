import prisma from "../config/db.js";
import { users } from "@prisma/client";

export type CreateUserData = Omit<users, "id">;

export interface UserTokenInfo { email: string; id: number; }

async function findByEmail(email: string) {
	return await prisma.users.findUnique({ where: { email } });
};

async function insert(data: CreateUserData) {
	await prisma.users.create({ data });
};

const userRepo = { findByEmail, insert };
export default userRepo;
