import mongoose, { Document, Schema } from 'mongoose';

interface IExerciseProgress {
  exercise: Schema.Types.ObjectId;
  sets: number;
  reps: number;
  weight?: number;
  duration?: number;
  difficulty: number; // 1-10 scale
  notes?: string;
}

export interface IProgress extends Document {
  userId: Schema.Types.ObjectId;
  workoutPlanId: Schema.Types.ObjectId;
  date: Date;
  exercises: IExerciseProgress[];
  weight: number;
  bodyFat?: number;
  measurements?: {
    chest?: number;
    waist?: number;
    hips?: number;
    biceps?: number;
    thighs?: number;
  };
  mood: number; // 1-5 scale
  energyLevel: number; // 1-5 scale
  duration: number; // in minutes
  caloriesBurned: number;
  notes: string;
}

const exerciseProgressSchema = new Schema<IExerciseProgress>({
  exercise: { type: Schema.Types.ObjectId, ref: 'Exercise', required: true },
  sets: { type: Number, required: true },
  reps: { type: Number, required: true },
  weight: Number,
  duration: Number,
  difficulty: { type: Number, min: 1, max: 10, required: true },
  notes: String
});

const progressSchema = new Schema<IProgress>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  workoutPlanId: { type: Schema.Types.ObjectId, ref: 'WorkoutPlan', required: true },
  date: { type: Date, required: true },
  exercises: [exerciseProgressSchema],
  weight: { type: Number, required: true },
  bodyFat: Number,
  measurements: {
    chest: Number,
    waist: Number,
    hips: Number,
    biceps: Number,
    thighs: Number
  },
  mood: { type: Number, min: 1, max: 5, required: true },
  energyLevel: { type: Number, min: 1, max: 5, required: true },
  duration: { type: Number, required: true },
  caloriesBurned: { type: Number, required: true },
  notes: { type: String, default: '' }
}, {
  timestamps: true
});

// Indexes for better query performance
progressSchema.index({ userId: 1, date: -1 });
progressSchema.index({ workoutPlanId: 1 });

export default mongoose.model<IProgress>('Progress', progressSchema); 