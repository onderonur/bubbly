import { Request, Response, NextFunction } from 'express';

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): any {
  if (res.headersSent) {
    return next(err);
  }
  return res.status(500).json({ message: err.message });
}
