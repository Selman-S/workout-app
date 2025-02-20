import { Router } from 'express';
import {
  createExercise,
  getExercises,
  getExerciseById,
  updateExercise,
  deleteExercise,
  searchExercises
} from '../controllers/exerciseController';
import { protect } from '../middleware/auth';

const router = Router();

// Search route should be before :id routes to avoid conflicts
router.get('/search', protect, searchExercises);

router.route('/')
  .get(protect, getExercises)
  .post(protect, createExercise);

router.route('/:id')
  .get(protect, getExerciseById)
  .put(protect, updateExercise)
  .delete(protect, deleteExercise);

export default router; 