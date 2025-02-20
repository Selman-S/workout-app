import { Request, Response } from 'express';
import Progress, { IProgress } from '../models/Progress';
import WorkoutPlan from '../models/WorkoutPlan';

// @desc    Record workout progress
// @route   POST /api/progress
// @access  Private
export const recordProgress = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user._id;
    const {
      workoutPlanId,
      exercises,
      weight,
      bodyFat,
      measurements,
      mood,
      energyLevel,
      duration,
      caloriesBurned,
      notes
    } = req.body;

    // Verify workout plan exists and belongs to user
    const workoutPlan = await WorkoutPlan.findOne({
      _id: workoutPlanId,
      userId,
      isActive: true
    });

    if (!workoutPlan) {
      res.status(404).json({ message: 'Active workout plan not found' });
      return;
    }

    const progress = await Progress.create({
      userId,
      workoutPlanId,
      date: new Date(),
      exercises,
      weight,
      bodyFat,
      measurements,
      mood,
      energyLevel,
      duration,
      caloriesBurned,
      notes
    });

    res.status(201).json(progress);
  } catch (error) {
    console.error('Record progress error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get user's progress history
// @route   GET /api/progress
// @access  Private
export const getProgressHistory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { startDate, endDate } = req.query;
    const filter: any = { userId: req.user._id };

    if (startDate && endDate) {
      filter.date = {
        $gte: new Date(startDate as string),
        $lte: new Date(endDate as string)
      };
    }

    const progress = await Progress.find(filter)
      .sort({ date: -1 })
      .populate('exercises.exercise');

    res.json(progress);
  } catch (error) {
    console.error('Get progress history error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get progress statistics
// @route   GET /api/progress/stats
// @access  Private
export const getProgressStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user._id;
    const progress = await Progress.find({ userId }).sort({ date: 1 });

    if (!progress.length) {
      res.status(404).json({ message: 'No progress data found' });
      return;
    }

    // Calculate statistics
    const stats = {
      weightProgress: progress.map(p => ({
        date: p.date,
        weight: p.weight,
        bodyFat: p.bodyFat
      })),
      measurements: progress.map(p => ({
        date: p.date,
        measurements: p.measurements
      })),
      workoutStats: {
        totalWorkouts: progress.length,
        averageDuration: progress.reduce((acc, p) => acc + p.duration, 0) / progress.length,
        totalCaloriesBurned: progress.reduce((acc, p) => acc + p.caloriesBurned, 0),
        averageEnergyLevel: progress.reduce((acc, p) => acc + p.energyLevel, 0) / progress.length,
        averageMood: progress.reduce((acc, p) => acc + p.mood, 0) / progress.length
      }
    };

    res.json(stats);
  } catch (error) {
    console.error('Get progress stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update progress entry
// @route   PUT /api/progress/:id
// @access  Private
export const updateProgress = async (req: Request, res: Response): Promise<void> => {
  try {
    const progress = await Progress.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!progress) {
      res.status(404).json({ message: 'Progress entry not found' });
      return;
    }

    res.json(progress);
  } catch (error) {
    console.error('Update progress error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete progress entry
// @route   DELETE /api/progress/:id
// @access  Private
export const deleteProgress = async (req: Request, res: Response): Promise<void> => {
  try {
    const progress = await Progress.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!progress) {
      res.status(404).json({ message: 'Progress entry not found' });
      return;
    }

    res.json({ message: 'Progress entry removed' });
  } catch (error) {
    console.error('Delete progress error:', error);
    res.status(500).json({ message: 'Server error' });
  }
}; 