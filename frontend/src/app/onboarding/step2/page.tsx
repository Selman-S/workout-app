'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAuthStore } from '@/store/authStore';

interface ValidationRules {
  age: { min: number; max: number; message: string };
  weight: { min: number; max: number; message: string };
  height: { min: number; max: number; message: string };
}

const validationRules: ValidationRules = {
  age: {
    min: 13,
    max: 100,
    message: 'Yaş 13-100 arasında olmalıdır'
  },
  weight: {
    min: 30,
    max: 200,
    message: 'Kilo 30-200 kg arasında olmalıdır'
  },
  height: {
    min: 120,
    max: 250,
    message: 'Boy 120-250 cm arasında olmalıdır'
  }
};

export default function OnboardingStep2() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuthStore();
  const [userData, setUserData] = useState({
    age: '',
    weight: '',
    height: '',
    gender: ''
  });
  const router = useRouter();

  // Profil bilgilerini yükle
  useEffect(() => {
    const loadProfileData = async () => {
      try {
        if (user?.data?._id) {
          const profile = user
          if (profile?.data) {
            setUserData({
              age: profile.data.age?.toString() || '',
              weight: profile.data.weight?.toString() || '',
              height: profile.data.height?.toString() || '',
              gender: profile.data.gender || ''
            });
          }
        }
      } catch (err) {
        console.error('Profil yüklenirken hata:', err);
      }
    };

    loadProfileData();
  }, [user]);

  const validateField = (field: 'age' | 'weight' | 'height', value: string) => {
    const numValue = parseInt(value);
    const rules = validationRules[field];
    
    if (isNaN(numValue)) {
      return `Lütfen geçerli bir ${field === 'age' ? 'yaş' : field === 'weight' ? 'kilo' : 'boy'} giriniz`;
    }
    
    if (numValue < rules.min || numValue > rules.max) {
      return rules.message;
    }
    
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Tüm alanların dolu olduğunu kontrol et
      if (!userData.age || !userData.weight || !userData.height || !userData.gender) {
        throw new Error('Lütfen tüm alanları doldurun');
      }

      // Her alan için validasyon yap
      const ageError = validateField('age', userData.age);
      if (ageError) throw new Error(ageError);

      const weightError = validateField('weight', userData.weight);
      if (weightError) throw new Error(weightError);

      const heightError = validateField('height', userData.height);
      if (heightError) throw new Error(heightError);

      // Verileri localStorage'a kaydet
      localStorage.setItem('userData', JSON.stringify(userData));

      // Step 3'e yönlendir
      router.push('/onboarding/step3');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    // Sadece sayı girişine izin ver
    if (field !== 'gender' && !/^\d*$/.test(value)) {
      return;
    }

    setUserData({ ...userData, [field]: value });
    setError(null); // Her değişiklikte hata mesajını temizle
  };

  return (
    <div className="relative min-h-screen pt-16">
      {/* Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-red-500/20 mix-blend-overlay"></div>
        <Image
          src="https://images.unsplash.com/photo-1599058917765-a780eda07a3e?auto=format&fit=crop&w=1920"
          alt="Background"
          fill
          sizes="100vw"
          style={{ 
            objectFit: 'cover', 
            filter: 'brightness(0.3)'
          }}
          quality={75}
          priority
        />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-md mx-auto px-4 py-12">
        <div className="text-center mb-12 animate-[fadeIn_0.6s_ease-out]">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-6 leading-tight tracking-tight">
            Kişisel Bilgileriniz<br />
            <span className="bg-gradient-to-r from-orange-500 via-red-500 to-red-600 text-transparent bg-clip-text">
              Size Özel Program
            </span>
          </h1>
          <p className="text-xl text-gray-300 mb-8 animate-[fadeIn_0.8s_ease-out]">
            Size en uygun antrenman programını oluşturmak için birkaç bilgiye ihtiyacımız var.
          </p>
          {error && (
            <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-100 animate-[fadeIn_0.3s_ease-out]">
              {error}
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 animate-[fadeIn_1s_ease-out]">
          <div className="bg-gray-900/80 backdrop-blur-lg rounded-xl p-8 shadow-2xl">
            <div className="space-y-6">
              {/* Cinsiyet */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-4">
                  Cinsiyet
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => handleInputChange('gender', 'male')}
                    className={`p-4 rounded-lg text-center transition-all duration-300 ${
                      userData.gender === 'male'
                        ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white'
                        : 'bg-gray-800/50 text-white hover:bg-gray-800/80'
                    }`}
                  >
                    Erkek
                  </button>
                  <button
                    type="button"
                    onClick={() => handleInputChange('gender', 'female')}
                    className={`p-4 rounded-lg text-center transition-all duration-300 ${
                      userData.gender === 'female'
                        ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white'
                        : 'bg-gray-800/50 text-white hover:bg-gray-800/80'
                    }`}
                  >
                    Kadın
                  </button>
                </div>
              </div>

              {/* Yaş */}
              <div>
                <label htmlFor="age" className="block text-sm font-medium text-gray-300 mb-2">
                  Yaş
                </label>
                <input
                  type="text"
                  id="age"
                  value={userData.age}
                  onChange={(e) => handleInputChange('age', e.target.value)}
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-transparent transition-all duration-300"
                  placeholder={`${validationRules.age.min}-${validationRules.age.max} arası`}
                  maxLength={3}
                  required
                />
              </div>

              {/* Kilo */}
              <div>
                <label htmlFor="weight" className="block text-sm font-medium text-gray-300 mb-2">
                  Kilo (kg)
                </label>
                <input
                  type="text"
                  id="weight"
                  value={userData.weight}
                  onChange={(e) => handleInputChange('weight', e.target.value)}
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-transparent transition-all duration-300"
                  placeholder={`${validationRules.weight.min}-${validationRules.weight.max} arası`}
                  maxLength={3}
                  required
                />
              </div>

              {/* Boy */}
              <div>
                <label htmlFor="height" className="block text-sm font-medium text-gray-300 mb-2">
                  Boy (cm)
                </label>
                <input
                  type="text"
                  id="height"
                  value={userData.height}
                  onChange={(e) => handleInputChange('height', e.target.value)}
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-transparent transition-all duration-300"
                  placeholder={`${validationRules.height.min}-${validationRules.height.max} arası`}
                  maxLength={3}
                  required
                />
              </div>
            </div>
          </div>

          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-orange-500 via-red-500 to-red-600 rounded-lg blur opacity-25 group-hover:opacity-100 transition duration-300"></div>
            <button
              type="submit"
              disabled={loading}
              className="relative w-full px-8 py-4 bg-gradient-to-r from-orange-500 via-red-500 to-red-600 text-white text-lg font-semibold rounded-lg hover:from-orange-400 hover:via-red-400 hover:to-red-500 transition-all duration-300 transform hover:-translate-y-1 hover:scale-[1.02] shadow-xl hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? 'Kaydediliyor...' : 'Devam Et'}
            </button>
          </div>
        </form>

        {/* Progress Indicator */}
        <div className="mt-8 flex justify-center gap-2 animate-[fadeIn_1.2s_ease-out]">
          <div className="w-4 h-4 rounded-full bg-gradient-to-r from-orange-500 to-red-500"></div>
          <div className="w-4 h-4 rounded-full bg-gray-700"></div>
        </div>
      </div>
    </div>
  );
} 