import { Router } from 'express';
import {
  generateWorkoutPlan,
  getActiveWorkoutPlan,
  updateWorkoutPlan,
  deleteWorkoutPlan
} from '../controllers/workoutPlanController';
import { protect } from '../middleware/auth';

const router = Router();

router.post('/generate', protect, generateWorkoutPlan);
router.get('/active', protect, getActiveWorkoutPlan);
router.route('/:id')
  .put(protect, updateWorkoutPlan)
  .delete(protect, deleteWorkoutPlan);

export default router; 