import { Request, Response } from 'express';
import mongoose, { Types } from 'mongoose';
import WorkoutPlan, { IWorkoutPlan } from '../models/WorkoutPlan';
import Exercise, { IExercise } from '../models/Exercise';
import User from '../models/User';

interface IWorkoutExercise {
  exercise: Types.ObjectId;
  sets: number;
  reps: string;
  restPeriod: number;
  order: number;
  weight?: number;
  intensity?: 'light' | 'moderate' | 'heavy';
  tempo?: string;
  isSuperset?: boolean;
  supersetWith?: Types.ObjectId;
  isDeloadWeek?: boolean;
}

interface IDaySchedule {
  dayNumber: number;
  exercises: IWorkoutExercise[];
  focusArea: string[];
  totalDuration: number;
  caloriesBurn: number;
  intensity: 'low' | 'medium' | 'high';
  notes?: string[];
  cardio?: {
    type: 'HIIT' | 'LISS' | 'MISS';
    duration: number;
    intensity: string;
    caloriesBurn: number;
  };
}

interface IExercisesByMuscle {
  [key: string]: IExercise[];
}

// Hedeflere göre antrenman parametreleri
const trainingParameters = {
  muscle_gain: {
    beginner: {
      sets: { min: 2, max: 3 },
      reps: '12-15',
      restPeriod: 60,
      intensity: 'moderate',
      tempo: '2-0-2-0'
    },
    intermediate: {
      sets: { min: 3, max: 4 },
      reps: '8-12',
      restPeriod: 90,
      intensity: 'heavy',
      tempo: '3-0-2-0'
    },
    advanced: {
      sets: { min: 4, max: 5 },
      reps: '6-8',
      restPeriod: 120,
      intensity: 'heavy',
      tempo: '4-0-2-0'
    }
  },
  fat_loss: {
    beginner: {
      sets: { min: 2, max: 3 },
      reps: '15-20',
      restPeriod: 30,
      intensity: 'moderate',
      tempo: '1-0-1-0'
    },
    intermediate: {
      sets: { min: 3, max: 4 },
      reps: '12-15',
      restPeriod: 45,
      intensity: 'moderate',
      tempo: '2-0-1-0'
    },
    advanced: {
      sets: { min: 3, max: 4 },
      reps: '10-12',
      restPeriod: 60,
      intensity: 'heavy',
      tempo: '2-0-1-0'
    }
  },
  endurance: {
    beginner: {
      sets: { min: 2, max: 3 },
      reps: '20-25',
      restPeriod: 30,
      intensity: 'light',
      tempo: '1-0-1-0'
    },
    intermediate: {
      sets: { min: 3, max: 4 },
      reps: '15-20',
      restPeriod: 45,
      intensity: 'moderate',
      tempo: '1-0-1-0'
    },
    advanced: {
      sets: { min: 4, max: 5 },
      reps: '12-15',
      restPeriod: 60,
      intensity: 'moderate',
      tempo: '2-0-1-0'
    }
  },
  general_fitness: {
    beginner: {
      sets: { min: 2, max: 3 },
      reps: '12-15',
      restPeriod: 45,
      intensity: 'light',
      tempo: '2-0-2-0'
    },
    intermediate: {
      sets: { min: 3, max: 4 },
      reps: '10-12',
      restPeriod: 60,
      intensity: 'moderate',
      tempo: '2-0-2-0'
    },
    advanced: {
      sets: { min: 3, max: 4 },
      reps: '8-12',
      restPeriod: 75,
      intensity: 'moderate',
      tempo: '2-0-2-0'
    }
  }
};

// Kardiyovasküler antrenman parametreleri
const cardioParameters = {
  muscle_gain: {
    type: 'LISS',
    duration: 20,
    frequency: 2, // haftada kaç gün
    intensity: 'low',
    caloriesPerMinute: 5
  },
  fat_loss: {
    type: 'HIIT',
    duration: 25,
    frequency: 4,
    intensity: 'high',
    caloriesPerMinute: 12
  },
  endurance: {
    type: 'MISS',
    duration: 45,
    frequency: 3,
    intensity: 'medium',
    caloriesPerMinute: 8
  },
  general_fitness: {
    type: 'MISS',
    duration: 30,
    frequency: 3,
    intensity: 'medium',
    caloriesPerMinute: 7
  }
};

// Süper set kombinasyonları
const supersetCombinations: { [key: string]: string[] } = {
  chest: ['back', 'triceps'],
  back: ['chest', 'biceps'],
  shoulders: ['biceps', 'triceps'],
  biceps: ['triceps', 'shoulders'],
  triceps: ['biceps', 'chest'],
  legs: ['core']
};

// @desc    Generate AI workout plan
// @route   POST /api/workout-plans/generate
// @access  Private
export const generateWorkoutPlan = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user._id;
    const { goal, daysPerWeek, duration } = req.body;

    // Get user profile
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    // Get suitable exercises based on user level and equipment
    const exercises = await Exercise.find({
      difficulty: user.profile.fitnessLevel,
      equipment: { $in: user.profile.equipment }
    });

    // Group exercises by muscle groups
    const exercisesByMuscle = exercises.reduce((acc: IExercisesByMuscle, exercise) => {
      exercise.muscleGroup.forEach(muscle => {
        if (!acc[muscle]) acc[muscle] = [];
        acc[muscle].push(exercise);
      });
      return acc;
    }, {});

    // Create workout schedule based on user preferences
    const schedule = generateWorkoutSchedule(
      exercisesByMuscle, 
      daysPerWeek,
      goal as 'muscle_gain' | 'fat_loss' | 'endurance' | 'general_fitness',
      user.profile.fitnessLevel
    );

    const workoutPlan = await WorkoutPlan.create({
      userId,
      name: `${goal} Plan - ${duration} weeks`,
      description: `Custom ${goal} workout plan for ${duration} weeks`,
      goal,
      difficulty: user.profile.fitnessLevel,
      duration,
      daysPerWeek,
      schedule,
      startDate: new Date(),
      endDate: new Date(Date.now() + duration * 7 * 24 * 60 * 60 * 1000),
      isActive: true
    });

    // Update user's active workout plan
    await User.findByIdAndUpdate(userId, { workoutPlan: workoutPlan._id });

    res.status(201).json(workoutPlan);
  } catch (error) {
    console.error('Generate workout plan error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get user's active workout plan
// @route   GET /api/workout-plans/active
// @access  Private
export const getActiveWorkoutPlan = async (req: Request, res: Response): Promise<void> => {
  try {
    const workoutPlan = await WorkoutPlan.findOne({
      userId: req.user._id,
      isActive: true
    }).populate('schedule.exercises.exercise');

    if (!workoutPlan) {
      res.status(404).json({ message: 'No active workout plan found' });
      return;
    }

    res.json(workoutPlan);
  } catch (error) {
    console.error('Get active workout plan error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update workout plan
// @route   PUT /api/workout-plans/:id
// @access  Private
export const updateWorkoutPlan = async (req: Request, res: Response): Promise<void> => {
  try {
    const workoutPlan = await WorkoutPlan.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!workoutPlan) {
      res.status(404).json({ message: 'Workout plan not found' });
      return;
    }

    res.json(workoutPlan);
  } catch (error) {
    console.error('Update workout plan error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete workout plan
// @route   DELETE /api/workout-plans/:id
// @access  Private
export const deleteWorkoutPlan = async (req: Request, res: Response): Promise<void> => {
  try {
    const workoutPlan = await WorkoutPlan.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!workoutPlan) {
      res.status(404).json({ message: 'Workout plan not found' });
      return;
    }

    // Remove workout plan reference from user
    await User.findByIdAndUpdate(req.user._id, { $unset: { workoutPlan: 1 } });

    res.json({ message: 'Workout plan removed' });
  } catch (error) {
    console.error('Delete workout plan error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Helper function to generate workout schedule
const generateWorkoutSchedule = (
  exercisesByMuscle: IExercisesByMuscle, 
  daysPerWeek: number,
  goal: 'muscle_gain' | 'fat_loss' | 'endurance' | 'general_fitness',
  fitnessLevel: 'beginner' | 'intermediate' | 'advanced'
): IDaySchedule[] => {
  const schedule: IDaySchedule[] = [];
  const params = trainingParameters[goal][fitnessLevel];
  const cardioParams = cardioParameters[goal];

  // Different split routines based on days per week
  const splitRoutines: { [key: number]: string[][] } = {
    3: [
      ['chest', 'shoulders', 'triceps'],
      ['back', 'biceps'],
      ['legs', 'core']
    ],
    4: [
      ['chest', 'triceps'],
      ['back', 'biceps'],
      ['shoulders', 'core'],
      ['legs']
    ],
    5: [
      ['chest'],
      ['back'],
      ['legs'],
      ['shoulders'],
      ['arms', 'core']
    ],
    6: [
      ['chest'],
      ['back'],
      ['legs'],
      ['shoulders'],
      ['arms'],
      ['core']
    ]
  };

  const routine = splitRoutines[daysPerWeek] || splitRoutines[3];

  for (let day = 0; day < daysPerWeek; day++) {
    const dayMuscles = routine[day];
    const exercises: IWorkoutExercise[] = [];
    let totalDuration = 0;
    let totalCalories = 0;

    // Add exercises for each muscle group
    dayMuscles.forEach((muscle, muscleIndex) => {
      const muscleExercises = exercisesByMuscle[muscle] || [];
      const selectedExercises = muscleExercises
        .sort(() => 0.5 - Math.random())
        .slice(0, goal === 'endurance' ? 4 : 3);

      selectedExercises.forEach((exercise: IExercise, index: number) => {
        const sets = Math.floor(Math.random() * (params.sets.max - params.sets.min + 1)) + params.sets.min;
        
        // Süper set oluşturma
        const canSuperset = fitnessLevel !== 'beginner' && 
                          supersetCombinations[muscle] && 
                          index === 0 && 
                          muscleIndex < dayMuscles.length - 1;

        const supersetExercise = canSuperset ? 
          exercisesByMuscle[supersetCombinations[muscle][0]]?.[0] : undefined;

        const isDeloadWeek = (Math.floor(Date.now() / (7 * 24 * 60 * 60 * 1000)) % 4) === 3;

        exercises.push({
          exercise: exercise._id as unknown as Types.ObjectId,
          sets: isDeloadWeek ? Math.max(2, sets - 1) : sets,
          reps: isDeloadWeek ? 
            (parseInt(params.reps.split('-')[0]) + 2).toString() + '-' + (parseInt(params.reps.split('-')[1]) + 2).toString() :
            params.reps,
          restPeriod: isDeloadWeek ? params.restPeriod + 30 : params.restPeriod,
          order: exercises.length + 1,
          intensity: isDeloadWeek ? 'light' : params.intensity as 'light' | 'moderate' | 'heavy',
          tempo: params.tempo,
          isSuperset: !!supersetExercise,
          supersetWith: supersetExercise?._id as unknown as Types.ObjectId,
          isDeloadWeek
        });

        // Her set için süre hesaplama
        const exerciseDuration = sets * (60 + params.restPeriod);
        totalDuration += exerciseDuration;
        
        // Kalori hesaplama
        const intensity = params.intensity === 'heavy' ? 8 : params.intensity === 'moderate' ? 6 : 4;
        const caloriesPerMinute = (intensity * 3.5 * 70) / 200;
        totalCalories += (exerciseDuration / 60) * caloriesPerMinute;
      });
    });

    // Günün yoğunluğunu belirle
    let dayIntensity: 'low' | 'medium' | 'high';
    if (day === 0 || day === 2) {
      dayIntensity = 'high';
    } else if (day === 1 || day === 3) {
      dayIntensity = 'medium';
    } else {
      dayIntensity = 'low';
    }

    // Kardiyovasküler antrenman ekle
    const shouldAddCardio = day % Math.floor(daysPerWeek / cardioParams.frequency) === 0;
    const cardio = shouldAddCardio ? {
      type: cardioParams.type as 'HIIT' | 'LISS' | 'MISS',
      duration: cardioParams.duration,
      intensity: cardioParams.intensity,
      caloriesBurn: cardioParams.duration * cardioParams.caloriesPerMinute
    } : undefined;

    if (cardio) {
      totalDuration += cardio.duration;
      totalCalories += cardio.caloriesBurn;
    }

    // Egzersiz notları oluştur
    const notes = [
      `Focus on ${params.tempo} tempo for each exercise`,
      `Rest ${params.restPeriod} seconds between sets`,
      goal === 'muscle_gain' ? 'Progressive overload is key' :
      goal === 'fat_loss' ? 'Keep rest periods short' :
      goal === 'endurance' ? 'Focus on form and breathing' :
      'Maintain proper form throughout'
    ];

    if (cardio) {
      notes.push(`Finish with ${cardio.duration} minutes of ${cardio.type} cardio at ${cardio.intensity} intensity`);
    }

    const isDeloadWeek = exercises.some(ex => ex.isDeloadWeek);
    if (isDeloadWeek) {
      notes.unshift('🔄 This is a deload week - focus on form and recovery');
    }

    schedule.push({
      dayNumber: day + 1,
      exercises,
      focusArea: dayMuscles,
      totalDuration,
      caloriesBurn: Math.round(totalCalories),
      intensity: dayIntensity,
      notes,
      cardio
    });
  }

  return schedule;
}; 