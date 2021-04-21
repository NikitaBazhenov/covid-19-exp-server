import { Request, Response, NextFunction } from 'express';
import { execSync } from '../db';

export async function syncData(req: Request, res: Response, next: NextFunction) {
  try {
    const status = await execSync();
    res.send(status);
  } catch (err) {
    next(err);
  }
}