import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  _id: string;
  name: string;
  email: string;
  password: string;
  profile: {
    age: number;
    gender: 'male' | 'female';
    height: number;
    weight: number;
    fitnessLevel: 'beginner' | 'intermediate' | 'advanced';
    goal: 'muscle_gain' | 'fat_loss' | 'endurance' | 'general_fitness';
    medicalConditions?: string[];
    equipment: string[];
  };
  workoutPlan?: Schema.Types.ObjectId;
  progress: Schema.Types.ObjectId[];
  matchPassword(enteredPassword: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>({
  name: {
    type: String,
    required: [true, 'Please add a name']
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email'
    ]
  },
  password: {
    type: String,
    required: [true, 'Please add a password'],
    minlength: 6
  },
  profile: {
    age: { type: Number, required: true },
    gender: { type: String, enum: ['male', 'female'], required: true },
    height: { type: Number, required: true },
    weight: { type: Number, required: true },
    fitnessLevel: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      required: true
    },
    goal: {
      type: String,
      enum: ['muscle_gain', 'fat_loss', 'endurance', 'general_fitness'],
      required: true
    },
    medicalConditions: [String],
    equipment: [String]
  },
  workoutPlan: { type: Schema.Types.ObjectId, ref: 'WorkoutPlan' },
  progress: [{ type: Schema.Types.ObjectId, ref: 'Progress' }]
}, {
  timestamps: true
});

// Encrypt password using bcrypt
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function(enteredPassword: string): Promise<boolean> {
  return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model<IUser>('User', userSchema); 