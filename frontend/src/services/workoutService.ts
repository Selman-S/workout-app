import { isAxiosError } from 'axios';
import axiosInstance from '@/lib/axios';

export interface Exercise {
  _id: string;
  name: string;
  muscleGroup: string[];
  location: 'home' | 'gym' | 'both';
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

export interface WorkoutExercise {
  exercise: Exercise;
  sets: number;
  reps: string;
  restPeriod: number;
  order: number;
  weight?: number;
  intensity?: 'light' | 'moderate' | 'heavy';
  tempo?: string;
  isSuperset?: boolean;
  supersetWith?: Exercise;
  isDeloadWeek?: boolean;
}

export interface WorkoutDay {
  dayNumber: number;
  exercises: WorkoutExercise[];
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

export interface WorkoutPlan {
  _id: string;
  userId: string;
  name: string;
  description: string;
  goal: 'muscle_gain' | 'fat_loss' | 'endurance' | 'general_fitness';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: number;
  daysPerWeek: number;
  schedule: WorkoutDay[];
  startDate: Date;
  endDate: Date;
  isActive: boolean;
}

class WorkoutService {
  async generatePlan(goal: string, daysPerWeek: number, duration: number): Promise<WorkoutPlan> {
    try {
      const response = await axiosInstance.post('/workout-plans/generate', {
        goal,
        daysPerWeek,
        duration
      });
      return response.data;
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Program oluşturulurken bir hata oluştu');
      }
      throw error;
    }
  }

  async getCurrentPlan(): Promise<WorkoutPlan | null> {
    try {
      const response = await axiosInstance.get('/workout-plans/active');
      return response.data;
    } catch (error: unknown) {
      if (isAxiosError(error) && error.response?.status === 404) {
        return null;
      }
      throw error;
    }
  }

  async updatePlan(planId: string, updates: Partial<WorkoutPlan>): Promise<WorkoutPlan> {
    try {
      const response = await axiosInstance.put(`/workout-plans/${planId}`, updates);
      return response.data;
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Program güncellenirken bir hata oluştu');
      }
      throw error;
    }
  }

  async deletePlan(planId: string): Promise<void> {
    try {
      await axiosInstance.delete(`/workout-plans/${planId}`);
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Program silinirken bir hata oluştu');
      }
      throw error;
    }
  }

  async getWorkoutHistory(): Promise<WorkoutPlan[]> {
    try {
      const response = await axiosInstance.get('/workout-plans/history');
      return response.data;
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Geçmiş programlar alınırken bir hata oluştu');
      }
      throw error;
    }
  }
}

export const workoutService = new WorkoutService();
export default workoutService; 