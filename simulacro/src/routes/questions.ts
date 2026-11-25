import { Router } from 'express';
import * as questionsController from '../controllers/questionsController.js';

export const questionsRouter = Router();

questionsRouter.post('/', questionsController.ask);