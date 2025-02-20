import mongoose, { Document, Schema } from 'mongoose';

interface IWorkoutExercise {
  exercise: Schema.Types.ObjectId;
  sets: number;
  reps: string;
  restPeriod: number;
  order: number;
}

interface IWorkoutDay {
  dayNumber: number;
  exercises: IWorkoutExercise[];
  focusArea: string[];
  totalDuration: number;
  caloriesBurn: number;
}

export interface IWorkoutPlan extends Document {
  userId: Schema.Types.ObjectId;
  name: string;
  description: string;
  goal: string;
  difficulty: string;
  duration: number; // weeks
  daysPerWeek: number;
  schedule: IWorkoutDay[];
  isActive: boolean;
  startDate: Date;
  endDate: Date;
  notes: string[];
}

const workoutExerciseSchema = new Schema<IWorkoutExercise>({
  exercise: { type: Schema.Types.ObjectId, ref: 'Exercise', required: true },
  sets: { type: Number, required: true },
  reps: { type: String, required: true },
  restPeriod: { type: Number, required: true },
  order: { type: Number, required: true }
});

const workoutDaySchema = new Schema<IWorkoutDay>({
  dayNumber: { type: Number, required: true },
  exercises: [workoutExerciseSchema],
  focusArea: [{ type: String, required: true }],
  totalDuration: { type: Number, required: true },
  caloriesBurn: { type: Number, required: true }
});

const workoutPlanSchema = new Schema<IWorkoutPlan>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  goal: {
    type: String,
    enum: ['muscle_gain', 'fat_loss', 'endurance', 'general_fitness'],
    required: true
  },
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    required: true
  },
  duration: { type: Number, required: true },
  daysPerWeek: { type: Number, required: true },
  schedule: [workoutDaySchema],
  isActive: { type: Boolean, default: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  notes: [String]
}, {
  timestamps: true
});

// Indexes for better query performance
workoutPlanSchema.index({ userId: 1, isActive: 1 });
workoutPlanSchema.index({ startDate: 1, endDate: 1 });

export default mongoose.model<IWorkoutPlan>('WorkoutPlan', workoutPlanSchema); 