import axios from 'axios';
import { API_URL } from '@/config';

interface Exercise {
  name: string;
  sets: number;
  reps: string;
  duration?: number;
  restTime: number;
  notes?: string;
}

interface WorkoutDay {
  dayOfWeek: number;
  exercises: Exercise[];
}

interface WorkoutPlan {
  user: string;
  startDate: Date;
  endDate: Date;
  goal: string;
  targetBodyParts: string[];
  workoutDays: WorkoutDay[];
  isActive: boolean;
  progress: {
    completedWorkouts: number;
    totalWorkouts: number;
    lastWorkout: Date;
  };
}

interface UserData {
  gender: string;
  age: number;
  weight: number;
  height: number;
  fitnessLevel: string;
  goal: string;
  daysPerWeek: number;
  workoutDuration: number;
  targetBodyParts: string[];
}

const workoutService = {
  async generateWorkoutPlan(userData: UserData): Promise<WorkoutPlan> {
    try {
      const response = await axios.post(`${API_URL}/workouts/generate`, userData);
      return response.data;
    } catch (error) {
      console.error('Error generating workout plan:', error);
      throw error;
    }
  },

  async getUserWorkoutPlan(userId: string): Promise<WorkoutPlan | null> {
    try {
      const response = await axios.get(`${API_URL}/workouts/user/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user workout plan:', error);
      throw error;
    }
  },

  async updateWorkoutProgress(workoutPlanId: string, completedWorkout: boolean): Promise<void> {
    try {
      await axios.post(`${API_URL}/workouts/${workoutPlanId}/progress`, {
        completed: completedWorkout,
        date: new Date()
      });
    } catch (error) {
      console.error('Error updating workout progress:', error);
      throw error;
    }
  },

  async getWorkoutHistory(userId: string): Promise<any[]> {
    try {
      const response = await axios.get(`${API_URL}/workouts/history/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching workout history:', error);
      throw error;
    }
  },

  async updateWorkoutPlan(workoutPlanId: string, updates: Partial<WorkoutPlan>): Promise<WorkoutPlan> {
    try {
      const response = await axios.put(`${API_URL}/workouts/${workoutPlanId}`, updates);
      return response.data;
    } catch (error) {
      console.error('Error updating workout plan:', error);
      throw error;
    }
  },

  async deactivateWorkoutPlan(workoutPlanId: string): Promise<void> {
    try {
      await axios.post(`${API_URL}/workouts/${workoutPlanId}/deactivate`);
    } catch (error) {
      console.error('Error deactivating workout plan:', error);
      throw error;
    }
  }
};

export default workoutService; 