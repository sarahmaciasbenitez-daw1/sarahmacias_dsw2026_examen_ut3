import type { Request, Response } from 'express';

export function notFound(req: Request, res: Response): void {
  console.log('[notFound]', req.requestId, req.method, req.path);
  
  res.status(404).json({
    error: 'NOT_FOUND',
    message: `Route not found: ${req.method} ${req.path}`,
  });
}
