import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  email: string;
  password: string;
  name: string;
  role: 'user' | 'trainer' | 'admin';
  profilePicture?: string;
  height?: number;
  weight?: number;
  age?: number;
  gender?: 'male' | 'female' | 'other';
  fitnessGoals?: "weight-loss" | "muscle-gain" | "endurance" | "flexibility" | "balance" | "strength";
  experienceLevels?: 'beginner' | 'intermediate' | 'advanced';
  workoutPerWeek?: 3 | 4 | 5 | 6;
  workoutDurations?: 30 | 45 | 60 | 90;
  workoutLocation?: 'home' | 'gym';
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
  hasCompletedOnboarding: boolean;

}

const userSchema = new Schema<IUser>({
  email: {
    type: String,
    required: [true, 'Email adresi zorunludur'],
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: [true, 'Şifre zorunludur'],
    minlength: [6, 'Şifre en az 6 karakter olmalıdır'],
    select: false,
  },
  name: {
    type: String,
    required: [true, 'Ad zorunludur'],
    trim: true,
  },

  role: {
    type: String,
    enum: ['user', 'trainer', 'admin'],
    default: 'user',
  },
  profilePicture: {
    type: String,
  },
  height: {
    type: Number,
  },
  weight: {
    type: Number,
  },
  age: {
    type: Number,
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other'],
  },
  fitnessGoals: {
    type: String,
    enum: ["weight-loss", "muscle-gain", "endurance", "flexibility", "balance", "strength"],
  },
  experienceLevels: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
  },
  workoutDurations: {
    type: Number,
    enum: [30, 45, 60, 90],
  },
  workoutLocation: {
    type: String,
    enum: ['home', 'gym'],
  },
  hasCompletedOnboarding: {
    type: Boolean,
    default: false,
  },
  workoutPerWeek: {
    type: Number,
    enum: [3, 4, 5, 6],
  },
}, {
  timestamps: true,
});

// Şifre hashleme middleware
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

// Şifre karşılaştırma metodu
userSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  try {
    if (!this.password) return false;
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    return false;
  }
};

export const User = mongoose.model<IUser>('User', userSchema); 