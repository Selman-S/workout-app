import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from '@/lib/axios';
import { destroyCookie, setCookie, parseCookies } from 'nookies';

interface User {
  data: {
    _id: string;
    name: string;
    email: string;
    role: string;
    age?: number;
    gender?: 'male' | 'female';
    height?: number;
    weight?: number;
    goal?: 'muscle_gain' | 'fat_loss' | 'endurance' | 'general_fitness';
    fitnessLevel?: 'beginner' | 'intermediate' | 'advanced';
    workoutDuration?: number;
    workoutLocation?: 'gym' | 'home';
    hasCompletedOnboarding?: boolean;
  }
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
  updateProfile: (profileData: Partial<User['data']>) => Promise<void>;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;

}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (email: string, password: string) => {
        try {
          set({ isLoading: true, error: null });
          const { data } = await axios.post('/auth/login', { email, password });
          
          // Token'ı cookie'ye kaydet
          setCookie(null, 'token', data.token, {
            maxAge: 30 * 24 * 60 * 60, // 30 gün
            path: '/',
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict'
          });

          // Axios instance'a token'ı ekle
          axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;

          set({ 
            user: data.user,
            isAuthenticated: true,
            isLoading: false,
            error: null
          });
        } catch (error: any) {
          set({ 
            isLoading: false,
            error: error.response?.data?.message || 'Giriş yapılamadı'
          });
          throw error;
        }
      },

      register: async (userData: RegisterData) => {
        try {
          set({ isLoading: true, error: null });
          const { data } = await axios.post('/auth/register', userData);
          
          // Token'ı cookie'ye kaydet
          setCookie(null, 'token', data.token, {
            maxAge: 30 * 24 * 60 * 60,
            path: '/',
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict'
          });

          // Axios instance'a token'ı ekle
          axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;

          set({ 
            user: data.user,
            isAuthenticated: true,
            isLoading: false,
            error: null
          });
        } catch (error: any) {
          set({ 
            isLoading: false,
            error: error.response?.data?.message || 'Kayıt yapılamadı'
          });
          throw error;
        }
      },

      logout: () => {
        // Token'ı cookie'den sil
        destroyCookie(null, 'token');
        
        // Axios instance'dan token'ı kaldır
        delete axios.defaults.headers.common['Authorization'];

        set({ 
          user: null,
          isAuthenticated: false,
          error: null
        });
      },

      checkAuth: async () => {
        try {
          set({ isLoading: true });
          
          // Cookie'den token'ı al ve axios headers'a ekle
          const cookies = parseCookies();
          const token = cookies.token;
          
          if (!token) {
            throw new Error('No token found');
          }
          
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          
          const { data } = await axios.get('/auth/me');
          set({ 
            user: data,
            isAuthenticated: true,
            isLoading: false,
            error: null
          });
        } catch (error) {
          // Token veya kullanıcı doğrulama hatası
          destroyCookie(null, 'token');
          delete axios.defaults.headers.common['Authorization'];
          
          set({ 
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: null
          });
        }
      },

      updateProfile: async (profileData: Partial<User['data']>) => {
        try {
          const { data } = await axios.put('/auth/update-profile', profileData);
          set({ user: data });
        } catch (error) {
          console.error('Profil güncellenirken hata:', error);
        }
      },

     
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        user: state.user,
        isAuthenticated: state.isAuthenticated 
      })
    }
  )
);

// Store'u direkt olarak izlemek için subscribe ekleyelim
useAuthStore.subscribe((state) => {
  console.log('Auth Store State Changed:', state);
});

// Debug fonksiyonu ekleyelim
const debugAuth = () => {
  const state = useAuthStore.getState();
  console.log('Current Auth State:', {
    user: state.user,
    isAuthenticated: state.isAuthenticated,
    isLoading: state.isLoading,
    error: state.error
  });
};

// Store'a debug metodunu ekleyelim
export { debugAuth }; 