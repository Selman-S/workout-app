import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Exercise from '../models/Exercise';

dotenv.config();

const exercises = [
  {
    name: 'Bench Press',
    muscleGroup: ['chest', 'shoulders', 'triceps'],
    equipment: ['barbell', 'bench'],
    difficulty: 'intermediate',
    type: 'strength',
    duration: 5,
    caloriesBurn: 150,
    videoUrl: 'https://example.com/bench-press',
    instructions: [
      'Lie on the bench with feet flat on the ground',
      'Grip the bar slightly wider than shoulder width',
      'Lower the bar to your chest',
      'Press the bar back up to starting position'
    ],
    targetMuscles: ['pectoralis major', 'anterior deltoids', 'triceps'],
    recommendedSets: 4,
    recommendedReps: '8-12',
    restPeriod: 90,
    tips: ['Keep your back flat on the bench', 'Maintain controlled movement']
  },
  {
    name: 'Squat',
    muscleGroup: ['legs', 'core'],
    equipment: ['barbell', 'rack'],
    difficulty: 'intermediate',
    type: 'strength',
    duration: 5,
    caloriesBurn: 200,
    videoUrl: 'https://example.com/squat',
    instructions: [
      'Position bar on upper back',
      'Stand with feet shoulder-width apart',
      'Lower body by bending knees and hips',
      'Return to starting position'
    ],
    targetMuscles: ['quadriceps', 'hamstrings', 'glutes', 'core'],
    recommendedSets: 4,
    recommendedReps: '8-12',
    restPeriod: 120,
    tips: ['Keep chest up', 'Knees in line with toes']
  },
  {
    name: 'Pull-up',
    muscleGroup: ['back', 'biceps'],
    equipment: ['pull-up bar'],
    difficulty: 'advanced',
    type: 'strength',
    duration: 3,
    caloriesBurn: 100,
    videoUrl: 'https://example.com/pull-up',
    instructions: [
      'Grip pull-up bar with hands wider than shoulders',
      'Hang with arms fully extended',
      'Pull body up until chin over bar',
      'Lower back to starting position'
    ],
    targetMuscles: ['latissimus dorsi', 'biceps', 'rear deltoids'],
    recommendedSets: 3,
    recommendedReps: '8-12',
    restPeriod: 90,
    tips: ['Maintain controlled movement', 'Avoid swinging']
  },
  {
    name: 'Push-up',
    muscleGroup: ['chest', 'shoulders', 'triceps'],
    equipment: ['bodyweight'],
    difficulty: 'beginner',
    type: 'strength',
    duration: 2,
    caloriesBurn: 50,
    videoUrl: 'https://example.com/push-up',
    instructions: [
      'Start in plank position',
      'Lower body by bending elbows',
      'Keep body straight',
      'Push back up to starting position'
    ],
    targetMuscles: ['pectoralis major', 'anterior deltoids', 'triceps'],
    recommendedSets: 3,
    recommendedReps: '10-15',
    restPeriod: 60,
    tips: ['Keep core tight', 'Elbows at 45-degree angle']
  }
];

const seedExercises = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/fitlife');
    console.log('Connected to MongoDB');

    // Clear existing exercises
    await Exercise.deleteMany({});
    console.log('Cleared existing exercises');

    // Insert new exercises
    await Exercise.insertMany(exercises);
    console.log('Added sample exercises');

    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedExercises(); 