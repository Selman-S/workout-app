import mongoose, { Schema, Document } from 'mongoose';

export interface IWorkoutPlan extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  workoutPlan: {
    dayName: string;
    isRestDay: boolean;
    exercises: Array<{
      name: string;
      sets: number;
      reps: string;
      duration?: number;
      restTime: number;
      description: string;
    }>;
    notes?: string;
  };
  progress?: {
    completedWorkouts: number;
    totalWorkouts: number;
    lastWorkout?: Date;
  };
  goal?: 'weight-loss' | 'muscle-gain' | 'endurance' | 'general-fitness';
}

const workoutPlanSchema = new Schema<IWorkoutPlan>({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  workoutPlan: { type: Array, required: true },
  progress: { type: Object, required: true },
  goal: { type: String, required: true },
});

const WorkoutPlan = mongoose.model<IWorkoutPlan>('WorkoutPlan', workoutPlanSchema);

export default WorkoutPlan;
