import { Router } from 'express';
import cors from './cors';
import sync from './sync';
import data from './data';

const router = Router();

router.use('/sync', sync);
router.use(cors);
router.use('/data', data);

export default router;