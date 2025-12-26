import express, { Request, Response } from 'express';
import dotenv from 'dotenv';

dotenv.config();

import cors from 'cors';
import issueRoutes from './routes/issues';
import projectRoutes from './routes/projects';
import authRoutes from './routes/auth';

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api/issues', issueRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/auth', authRoutes);

app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', message: 'Backend is running' });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
