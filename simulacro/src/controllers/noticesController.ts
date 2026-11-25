import type { Request, Response, NextFunction } from 'express';
import * as noticesService from '../services/noticesService.js';
import { AppError } from '../errors/AppError.js';
import { ResourceNotFoundError } from '../errors/ResourceNotFoundError.js';

export function list(req: Request, res: Response, next: NextFunction): void {
  try {
    const page = Number(req.query.page ?? 1);
    const limit = Number(req.query.limit ?? 2);
    if (!Number.isInteger(page) || page < 1 || !Number.isInteger(limit) || limit < 1) {
      throw new AppError(400, 'page and limit must be positive integers', 'BAD_REQUEST');
    }
    const search = typeof req.query.search === 'string' ? req.query.search.trim() : '';
    res.json(noticesService.list(page, limit, search || undefined));
  } catch (err) {
    next(err);
  }
}

export function getById(req: Request, res: Response, next: NextFunction): void {
  try {
    const notices = noticesService.getById(String(req.params.noticesId));
    if (!notices) {
      throw new ResourceNotFoundError(404, `Notice with id '${req.params.noticesId}' not found`, (String(req.params.noticesId)), 'NOT_FOUND');
    }
    res.json({ data: notices });
  } catch (err) {
    next(err);
  }
}

export function create(req: Request, res: Response, next: NextFunction): void {
  try {
    const { title, description } = req.body ?? {};
    if (typeof title !== 'string' || title.trim() === '') {
      throw new AppError(400, 'Missing required field: title', 'BAD_REQUEST');
    }
    if (description !== undefined && typeof description !== 'string') {
      throw new AppError(400, 'Description must be a string', 'BAD_REQUEST');
    }
    const notice = noticesService.create(title.trim(), description?.trim() ?? '');
    res.status(201).json({ data: notice });
  } catch (err) {
    next(err);
  }
}

export function update(req: Request, res: Response, next: NextFunction): void {
  try {
    const { title, description } = req.body;

    // Solo validamos si el cliente ha enviado "title"
    if (title !== undefined) {
      if (typeof title !== 'string' || title.trim() === '') {
        res.status(400).json({
          error: 'INVALID_TITLE',
          message: 'Title must be a non-empty string',
        });
        return;
      }
    }

    const notices = noticesService.update(String(req.params.noticesId), {
      title: typeof title === 'string' ? title.trim() : undefined,
      description,
    });
    if (!notices) {
      throw new ResourceNotFoundError(
        404,
        `Notice with id '${req.params.noticesId}' not found`,
        String(req.params.noticesId),
        'RESOURCE_NOT_FOUND',
      );
    }
    res.json({ data: notices });
  } catch (err) {
    next(err);
  }
}