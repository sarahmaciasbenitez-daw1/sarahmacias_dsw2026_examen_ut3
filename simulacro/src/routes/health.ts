import { Router } from 'express';

export const healthRouter = Router();

healthRouter.get('/live', (req, res) => {
  console.log(req.method, req.originalUrl);
  res.status(200).json({ status: 'live' });
});
healthRouter.get('/get', (_req, res) => {
  res.status(200).json({ status: 'ready' });
});