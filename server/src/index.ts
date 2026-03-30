import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import questionRoutes from './routes/questions';
import submissionRoutes from './routes/submissions';
import statsRoutes from './routes/stats';
import cfVerifyRoutes from './routes/cfVerify';
import discussionRoutes from './routes/discussions';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'OK', system: 'CF Practice Progress Tracker' });
});

app.use('/api/auth', authRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/submissions', submissionRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/cfverify', cfVerifyRoutes);
app.use('/api/discussions', discussionRoutes);

app.listen(PORT, () => {
    console.log(`[server]: Server is running at http://localhost:${PORT}`);
});
