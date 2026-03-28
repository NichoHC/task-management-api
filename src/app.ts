import express, { Request, Response } from 'express';
import authRoutes from './api/routes/auth.routes';
const app = express();

app.use(express.json());
app.use(authRoutes);

export default app;