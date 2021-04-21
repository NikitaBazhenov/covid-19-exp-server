import { Router } from 'express';
import {
  syncData
} from '../controllers/sync';

const router = Router();

router.get('/', syncData);

export default router;