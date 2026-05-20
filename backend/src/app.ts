import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { connectDB } from './config/db';
import authRoutes from './routes/authRoutes';
import leadRoutes from './routes/leadRoutes';
import { errorHandler, notFound } from './middleware/errorHandler';

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL ?? 'http://localhost:5173' }));
app.use(express.json());

app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));
app.use('/api/auth', authRoutes);
app.use('/api/leads', leadRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT ?? 5000;

connectDB()
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error('DB connection failed:', err);
    process.exit(1);
  });

export default app;
