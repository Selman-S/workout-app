import { Router } from 'express';
import {
  recordProgress,
  getProgressHistory,
  getProgressStats,
  updateProgress,
  deleteProgress
} from '../controllers/progressController';
import { protect } from '../middleware/auth';

const router = Router();

router.route('/')
  .post(protect, recordProgress)
  .get(protect, getProgressHistory);

router.get('/stats', protect, getProgressStats);

router.route('/:id')
  .put(protect, updateProgress)
  .delete(protect, deleteProgress);

export default router; 