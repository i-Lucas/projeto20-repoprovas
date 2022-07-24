import { Router } from 'express';

import validateSchema from '../middlewares/schema.js';
import schema from '../schemas/auth.js';
import auth from '../controllers/auth.js';

const authRouter = Router();

authRouter.post('/signup', validateSchema(schema.signup), auth.signup);
authRouter.post('/signin', validateSchema(schema.signin), auth.signin);

export default authRouter;