import type { NextFunction, Request, Response } from 'express';
import { env } from '../config/env.js';

export function logger(req: Request, res: Response, next: NextFunction): void {
  const start = Date.now();

  res.on('finish', () => {
    const durationMs = Date.now() - start;

    if (env.LOG === 'OFF') {
      
      return; 
    }

    console.log(
      JSON.stringify({
        requestId: req.requestId,
        method: req.method,
        path: req.originalUrl || req.path,
        status: res.statusCode,
        durationMs,
        timestamp: new Date().toISOString(),
      }),
    );
  });

  next();
}