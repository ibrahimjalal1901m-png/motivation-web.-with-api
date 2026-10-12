import express from 'express';
import { apiRouter } from '../src/apiHandler';

const app = express();

app.use(express.json({ limit: '1mb' }));

// Mount on /api and root /
app.use('/api', apiRouter);
app.use('/', apiRouter);

export default app;
