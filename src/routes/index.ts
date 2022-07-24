import { Router } from 'express';

import authRouter from './auth.js';
import testsRouter from './tests.js';

const router = Router();

router.use(authRouter);
router.use(testsRouter);

export default router;