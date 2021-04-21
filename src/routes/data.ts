import { Router } from 'express';
import {
  getData
} from '../controllers/data';

const router = Router();

router.get('/', getData);

export default router;