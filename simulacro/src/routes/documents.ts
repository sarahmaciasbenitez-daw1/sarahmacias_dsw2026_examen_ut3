import { Router } from 'express';
import * as documentsController from '../controllers/documentsController.js';

export const documentsRouter = Router();

documentsRouter.get('/', documentsController.list);
documentsRouter.get('/:documentId', documentsController.getById);
documentsRouter.post('/', documentsController.create);
documentsRouter.patch('/:documentId', documentsController.update);