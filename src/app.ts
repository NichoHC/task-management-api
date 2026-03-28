import express, { Request, Response } from 'express';

const app = express();

app.use(express.json());

app.get('/ping', (_req: Request, res: Response) => {
  res.send('pong');
});

export default app;