import axios from 'axios';

export interface UserData {
  _id: string;
  name: string;
  age?: number;
  weight?: number;
  height?: number;
  fitnessLevel?: string;
  goal?: string;
  daysPerWeek?: number;
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

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authService = {
  async createUser(userData: OnboardingData) {
    try {
      const response = await api.post('/users', userData);
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('userData', JSON.stringify(response.data.user));
      }
      return response.data.user;
    } catch (error) {
      throw error;
    }
  },

  async updateUserProfile(userId: string, userData: Partial<OnboardingData>) {
    try {
      const response = await api.put(`/users/${userId}`, userData);
      localStorage.setItem('userData', JSON.stringify(response.data));
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async getCurrentUser() {
    try {
      const response = await api.get('/users/me');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
  },
};

export default authService; 