import joi from "joi";
import { CreateUserData } from "../repositories/auth.js";

const signup = joi.object({

	email: joi.string().email().required(),
	password: joi.string().required(),
	confirm: joi.valid(joi.ref("password")).required(),
});

const signin = joi.object<CreateUserData>({

	email: joi.string().email().required(),
	password: joi.string().required(),
});

const authSchema = { signup, signin };
export default authSchema;