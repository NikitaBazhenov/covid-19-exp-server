import { Request, Response, NextFunction } from 'express';
import { fetchData } from '../db';

export async function getData(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await fetchData();
    res.send(data);
  } catch (err) {
    next(err);
  }
}