import express from 'express';
import authRoutes from './api/routes/auth.routes';
import taskRoutes from './api/routes/task.routes';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './services/swagger';
const app = express();

app.use(express.json());
app.use('/auth', authRoutes);
app.use( taskRoutes);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
export default app;