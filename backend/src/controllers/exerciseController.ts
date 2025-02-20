import { Request, Response } from 'express';
import Exercise, { IExercise } from '../models/Exercise';

// @desc    Create new exercise
// @route   POST /api/exercises
// @access  Private/Admin
export const createExercise = async (req: Request, res: Response): Promise<void> => {
  try {
    const exercise = await Exercise.create(req.body);
    res.status(201).json(exercise);
  } catch (error) {
    console.error('Create exercise error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get all exercises
// @route   GET /api/exercises
// @access  Private
export const getExercises = async (req: Request, res: Response): Promise<void> => {
  try {
    const { muscleGroup, difficulty, type, equipment } = req.query;
    
    const filter: any = {};
    
    if (muscleGroup) filter.muscleGroup = muscleGroup;
    if (difficulty) filter.difficulty = difficulty;
    if (type) filter.type = type;
    if (equipment) filter.equipment = { $in: [equipment] };

    const exercises = await Exercise.find(filter);
    res.json(exercises);
  } catch (error) {
    console.error('Get exercises error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get exercise by ID
// @route   GET /api/exercises/:id
// @access  Private
export const getExerciseById = async (req: Request, res: Response): Promise<void> => {
  try {
    const exercise = await Exercise.findById(req.params.id);
    
    if (!exercise) {
      res.status(404).json({ message: 'Exercise not found' });
      return;
    }

    res.json(exercise);
  } catch (error) {
    console.error('Get exercise error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update exercise
// @route   PUT /api/exercises/:id
// @access  Private/Admin
export const updateExercise = async (req: Request, res: Response): Promise<void> => {
  try {
    const exercise = await Exercise.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!exercise) {
      res.status(404).json({ message: 'Exercise not found' });
      return;
    }

    res.json(exercise);
  } catch (error) {
    console.error('Update exercise error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete exercise
// @route   DELETE /api/exercises/:id
// @access  Private/Admin
export const deleteExercise = async (req: Request, res: Response): Promise<void> => {
  try {
    const exercise = await Exercise.findByIdAndDelete(req.params.id);

    if (!exercise) {
      res.status(404).json({ message: 'Exercise not found' });
      return;
    }

    res.json({ message: 'Exercise removed' });
  } catch (error) {
    console.error('Delete exercise error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Search exercises
// @route   GET /api/exercises/search
// @access  Private
export const searchExercises = async (req: Request, res: Response): Promise<void> => {
  try {
    const { query } = req.query;
    
    if (!query) {
      res.status(400).json({ message: 'Search query is required' });
      return;
    }

    const exercises = await Exercise.find(
      { $text: { $search: query as string } },
      { score: { $meta: 'textScore' } }
    ).sort({ score: { $meta: 'textScore' } });

    res.json(exercises);
  } catch (error) {
    console.error('Search exercises error:', error);
    res.status(500).json({ message: 'Server error' });
  }
}; 