import React, { createContext, useContext, useState, useEffect } from 'react';
import authService, { UserData, OnboardingData } from '../services/authService';

interface AuthContextType {
  user: UserData | null;
  loading: boolean;
  error: string | null;
  logout: () => void;
  updateProfile: (data: Partial<OnboardingData>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const user = await authService.getCurrentUser();
        setUser(user);
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    
    initAuth();
  }, []);

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const updateProfile = async (userData: Partial<OnboardingData>) => {
    try {
      setError(null);
      if (!user?._id) throw new Error('No user found');
      const updatedUser = await authService.updateUserProfile(user._id, userData);
      setUser(updatedUser);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while updating profile');
      throw err;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext; 