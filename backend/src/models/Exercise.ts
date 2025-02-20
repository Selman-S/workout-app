import mongoose, { Document, Schema } from 'mongoose';

export interface IExercise extends Document {
  name: string;
  muscleGroup: string[];
  equipment: string[];
  difficulty: string;
  type: 'strength' | 'cardio' | 'flexibility';
  duration: number;
  caloriesBurn: number;
  videoUrl: string;
  instructions: string[];
  targetMuscles: string[];
  recommendedSets: number;
  recommendedReps: string;
  restPeriod: number;
  tips: string[];
}

const exerciseSchema = new Schema<IExercise>({
  name: { type: String, required: true, unique: true },
  muscleGroup: [{ type: String, required: true }],
  equipment: [{ type: String, required: true }],
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    required: true
  },
  type: {
    type: String,
    enum: ['strength', 'cardio', 'flexibility'],
    required: true
  },
  duration: { type: Number, required: true }, // in minutes
  caloriesBurn: { type: Number, required: true },
  videoUrl: { type: String, required: true },
  instructions: [{ type: String, required: true }],
  targetMuscles: [{ type: String, required: true }],
  recommendedSets: { type: Number, required: true },
  recommendedReps: { type: String, required: true }, // e.g., "8-12", "12-15"
  restPeriod: { type: Number, required: true }, // in seconds
  tips: [String]
}, {
  timestamps: true
});

// Index for better search performance
exerciseSchema.index({ name: 'text', muscleGroup: 'text' });

export default mongoose.model<IExercise>('Exercise', exerciseSchema); 