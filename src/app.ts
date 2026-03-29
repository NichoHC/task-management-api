import express from 'express';
import authRoutes from './api/routes/auth.routes';
import taskRoutes from './api/routes/task.routes';

const app = express();

app.use(express.json());
app.use('/auth', authRoutes);
app.use( taskRoutes);
export default app;