import type { Request, Response, NextFunction } from 'express';
import * as questionsService from '../services/questionsService.js';
import { AppError } from '../errors/AppError.js';

export function ask(req: Request, res: Response, next: NextFunction): void {
  try {
    const { question } = req.body;
    if (typeof question !== 'string' || question.trim() === '') {
      throw new AppError(400, 'Missing required field: question', 'BAD_REQUEST');
    }
    res.status(200).json({ data: questionsService.answerQuestion() });
  } catch (err) {
    next(err);
  }
}