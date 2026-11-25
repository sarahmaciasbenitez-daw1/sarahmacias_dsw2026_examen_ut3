import express from 'express';
import type { Application } from 'express';
import { documentsRouter } from './routes/documents.js';
import { healthRouter } from './routes/health.js';
import { testRouter } from './routes/test.js';
import { questionsRouter } from './routes/questions.js';
import { notFound } from './middlewares/notFound.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { requestId } from './middlewares/requestId.js';
import { logger } from './middlewares/logger.js';
import { noticesRouter } from './routes/notices.js';

export function createApp(): Application {
  const app = express();

  app.use(requestId);
  app.use(logger);

  app.use(express.json());
  app.use('/health', healthRouter);
  app.use('/api/v1/admin/documents', documentsRouter); 
  app.use('/test', testRouter)
  app.use('/api/v1/notices', noticesRouter);
  app.use('/api/v1/questions', questionsRouter);

  app.use(notFound);

  app.use(errorHandler)
  return app;
}