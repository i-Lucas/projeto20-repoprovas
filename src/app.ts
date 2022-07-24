import cors from 'cors';
import express, { json } from 'express';
import 'express-async-errors';

import router from './routes/index.js';
import errorHandle from './middlewares/error.js';

const app = express();
app.use(cors());
app.use(json());
app.use(router);
app.use(errorHandle);

export default app;
