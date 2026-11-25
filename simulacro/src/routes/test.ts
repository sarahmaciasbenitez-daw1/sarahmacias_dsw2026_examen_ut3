import { Router } from 'express';

export const testRouter = Router();

testRouter.get('/CapySolutions', (_req, res) => {
  res.status(200).json({ "team":"CapySolutions" });
});
