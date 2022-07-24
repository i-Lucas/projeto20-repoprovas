import { Router } from 'express';

import { tokenValidate } from '../middlewares/token.js';
import schemaValidator from '../middlewares/schema.js';
import tests from '../controllers/tests.js';
import testSchema from '../schemas/tests.js';

const testsRouter = Router();
testsRouter.use(tokenValidate);

testsRouter.post('/tests', schemaValidator(testSchema.create), tests.create);
testsRouter.get('/tests/disciplines', tests.getByDisciplines);
testsRouter.get('/tests/teachers', tests.getByTeachers);

export default testsRouter;