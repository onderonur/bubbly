import { Request, Response, NextFunction } from 'express';

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): any {
  if (res.headersSent) {
    return next(err);
  }
  const statusCode = 500;
  return res.status(statusCode).json({ statusCode, message: err.message });
}
