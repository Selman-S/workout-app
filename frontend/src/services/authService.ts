import { isAxiosError } from 'axios';
import axiosInstance from '@/lib/axios';
import { parseCookies } from 'nookies';

export interface UserData {
  _id: string;
  name: string;
  email: string;
  profile: {
    age: number;
    gender: 'male' | 'female';
    height: number;
    weight: number;
    fitnessGoals: 'muscle_gain' | 'fat_loss' | 'endurance' | 'general_fitness';
    experienceLevels: 'beginner' | 'intermediate' | 'advanced';
    workoutDurations: 30 | 45 | 60 | 90;
    workoutLocation: 'home' | 'gym';
  };
}

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
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
    workoutLocation: 'home' | 'gym';
  };
}

class AuthService {
  async login(loginData: LoginData) {
    try {
      const response = await axiosInstance.post('/auth/login', loginData);
      return response.data;
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Giriş yapılırken bir hata oluştu');
      }
      throw error;
    }
  }

  async register(registerData: RegisterData) {
    try {
      const response = await axiosInstance.post('/auth/register', registerData);
      return response.data;
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Kayıt olurken bir hata oluştu');
      }
      throw error;
    }
  }

  async getCurrentUser() {
    try {
      const response = await axiosInstance.get('/auth/me');
      return response.data;
    } catch (error: unknown) {
      if (isAxiosError(error) && error.response?.status === 401) {
        return null;
      }
      throw error;
    }
  }

  async updateProfile(userId: string, profileData: Partial<UserData['profile']>) {
    try {
      const response = await axiosInstance.put(`/auth/update-profile`, profileData);
      return response.data;
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Profil güncellenirken bir hata oluştu');
      }
      throw error;
    }
  }
}

export const authService = new AuthService();
export default authService; 