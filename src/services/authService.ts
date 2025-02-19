import axios from 'axios';
import { parseCookies } from 'nookies';

export interface UserData {
  _id: string;
  name: string;
  age?: number;
  weight?: number;
  height?: number;
  fitnessLevel?: string;
  goal?: string;
  daysPerWeek?: number;
  hasCompletedOnboarding: boolean;
}

export interface OnboardingData {
  name: string;
  age?: number;
  weight?: number;
  height?: number;
  fitnessLevel?: string;
  goal?: string;
  daysPerWeek?: number;
}

export interface LoginData {
  email: string;
  password: string;
}

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Enable sending cookies with requests
});

// Add response interceptor to handle unauthorized responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Sadece API çağrısı başarısız olduğunda yönlendir
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export const authService = {
  async login(loginData: LoginData) {
    try {
      const response = await api.post('/users/login', loginData);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        throw new Error('Email veya şifre hatalı');
      }
      throw new Error('Giriş yapılırken bir hata oluştu');
    }
  },

  async checkEmailAvailability(email: string) {
    try {
      await api.post('/users/check-email', { email });
      return true;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 400) {
        throw new Error(error.response.data.message);
      }
      throw new Error('E-posta kontrolü sırasında bir hata oluştu');
    }
  },

  async createUser(userData: OnboardingData) {
    try {
      const response = await api.post('/users', userData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async updateUserProfile(userId: string, userData: Partial<OnboardingData>) {
    try {
      const cookies = parseCookies();
      if (!cookies.token) return null;

      const response = await api.put(`/users/${userId}`, userData);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message || 'Profil güncellenirken bir hata oluştu';
        console.error('Profile update error:', error.response?.data);
        throw new Error(message);
      }
      throw error;
    }
  },

  async getCurrentUser() {
    try {
      const cookies = parseCookies();
      if (!cookies.token) return null;

      const response = await api.get('/users/me');
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        return null;
      }
      throw error;
    }
  },

  async logout() {
    try {
      await api.post('/users/logout');
      window.location.href = '/login';
    } catch (error) {
      console.error('Logout error:', error);
    }
  },

  async generateWorkoutPlan(userId: string, userData: any) {
    try {
      const cookies = parseCookies();
      if (!cookies.token) return null;

      const response = await api.post(`/users/${userId}/workout-plan`, userData);
      return response.data;
    } catch (error) {
      console.error('Error generating workout plan:', error);
      throw error;
    }
  },
};

export default authService; 