'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import authService from '@/services/authService';

interface FitnessGoal {
  id: string;
  title: string;
  description: string;
}

const fitnessGoals: FitnessGoal[] = [
  {
    id: 'weight-loss',
    title: 'Kilo Vermek',
    description: 'Yağ yakımı odaklı antrenmanlar'
  },
  {
    id: 'muscle-gain',
    title: 'Kas Kazanmak',
    description: 'Güç ve kas kütlesi artışı odaklı antrenmanlar'
  },
  {
    id: 'endurance',
    title: 'Dayanıklılık Kazanmak',
    description: 'Kardiyo ve dayanıklılık odaklı antrenmanlar'
  },
  {
    id: 'general-fitness',
    title: 'Genel Sağlık',
    description: 'Dengeli ve genel fitness odaklı antrenmanlar'
  }
];

const experienceLevels = [
  { id: 'beginner', title: 'Yeni Başlayan', description: 'Düzenli spor yapmıyorum' },
  { id: 'intermediate', title: 'Orta Seviye', description: 'Ara sıra spor yapıyorum' },
  { id: 'advanced', title: 'İleri Seviye', description: 'Düzenli spor yapıyorum' }
];

const workoutDurations = [
  { value: 30, label: '30 dakika', description: 'Hızlı ve etkili antrenmanlar' },
  { value: 45, label: '45 dakika', description: 'Dengeli süre ve verimlilik' },
  { value: 60, label: '60 dakika', description: 'Kapsamlı antrenmanlar' },
  { value: 90, label: '90 dakika', description: 'Detaylı ve yoğun antrenmanlar' }
];

export default function OnboardingStep3() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userData, setUserData] = useState({
    name: '',
    age: '',
    weight: '',
    height: '',
    goal: '',
    fitnessLevel: '',
    daysPerWeek: '3',
    workoutDuration: 45
  });
  const router = useRouter();

  useEffect(() => {
    const savedData = localStorage.getItem('userData');
    if (savedData) {
      setUserData(prevData => ({ ...prevData, ...JSON.parse(savedData) }));
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (!userData.goal || !userData.fitnessLevel) {
        throw new Error('Lütfen tüm alanları doldurun');
      }

      // localStorage'dan önceki adımlardaki verileri al
      const savedData = localStorage.getItem('userData');
      const previousData = savedData ? JSON.parse(savedData) : {};

      const userDataToSubmit = {
        ...previousData,
        ...userData,
        age: parseInt(previousData.age),
        weight: parseInt(previousData.weight),
        height: parseInt(previousData.height),
        daysPerWeek: parseInt(userData.daysPerWeek),
        workoutDuration: userData.workoutDuration,
        hasCompletedOnboarding: true
      };

      console.log('Submitting user data:', userDataToSubmit); // Debug log

      // Mevcut kullanıcı bilgilerini al
      const currentUser = await authService.getCurrentUser();
      
      if (!currentUser?._id) {
        throw new Error('Kullanıcı bilgileri bulunamadı');
      }

      // Kullanıcı profilini güncelle
      const response = await authService.updateUserProfile(currentUser._id, userDataToSubmit);
      
      if (response) {
        try {
          // Workout planı oluştur
          await authService.generateWorkoutPlan(currentUser._id, {
            ...userDataToSubmit,
            userId: currentUser._id
          });
          
          // localStorage'ı temizle
          localStorage.removeItem('userData');
          
          // Workout sayfasına yönlendir
          router.push('/workout');
        } catch (error) {
          console.error('Error generating workout plan:', error);
          setError('Antrenman planı oluşturulurken bir hata oluştu');
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bir hata oluştu');
      console.error('Onboarding error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen">
      {/* Background */}
      <div className="fixed inset-0 z-0">
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
      <div className="relative z-10 max-w-2xl mx-auto px-4 py-12">
        <div className="text-center mb-12 animate-[fadeIn_0.6s_ease-out]">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-6 leading-tight tracking-tight">
            Son Adım! 🎯<br />
            <span className="bg-gradient-to-r from-orange-500 via-red-500 to-red-600 text-transparent bg-clip-text">
              Hedeflerinizi Belirleyelim
            </span>
          </h1>
          <p className="text-xl text-gray-300 mb-8 animate-[fadeIn_0.8s_ease-out]">
            Size özel programınızı oluşturmak için son birkaç detaya ihtiyacımız var.
          </p>
          {error && (
            <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-100 animate-[fadeIn_0.3s_ease-out]">
              {error}
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-8 animate-[fadeIn_1s_ease-out]">
          {/* Fitness Hedefi */}
          <div className="bg-gray-900/80 backdrop-blur-lg rounded-xl p-8 shadow-2xl">
            <h2 className="text-xl font-semibold text-white mb-6">Fitness Hedefleriniz</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {fitnessGoals.map((goal) => (
                <button
                  key={goal.id}
                  type="button"
                  onClick={() => setUserData({ ...userData, goal: goal.id })}
                  className={`p-6 rounded-lg text-left transition-all duration-300 ${
                    userData.goal === goal.id
                      ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-lg transform scale-[1.02]'
                      : 'bg-gray-800/50 text-white hover:bg-gray-800/80'
                  }`}
                >
                  <h3 className="text-lg font-medium mb-2">{goal.title}</h3>
                  <p className={`text-sm ${
                    userData.goal === goal.id ? 'text-orange-100' : 'text-gray-400'
                  }`}>
                    {goal.description}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Deneyim Seviyesi */}
          <div className="bg-gray-900/80 backdrop-blur-lg rounded-xl p-8 shadow-2xl">
            <h2 className="text-xl font-semibold text-white mb-6">Deneyim Seviyeniz</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {experienceLevels.map((level) => (
                <button
                  key={level.id}
                  type="button"
                  onClick={() => setUserData({ ...userData, fitnessLevel: level.id })}
                  className={`p-6 rounded-lg text-left transition-all duration-300 ${
                    userData.fitnessLevel === level.id
                      ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-lg transform scale-[1.02]'
                      : 'bg-gray-800/50 text-white hover:bg-gray-800/80'
                  }`}
                >
                  <h3 className="text-lg font-medium mb-2">{level.title}</h3>
                  <p className={`text-sm ${
                    userData.fitnessLevel === level.id ? 'text-orange-100' : 'text-gray-400'
                  }`}>
                    {level.description}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Haftalık Antrenman Günü */}
          <div className="bg-gray-900/80 backdrop-blur-lg rounded-xl p-8 shadow-2xl">
            <h2 className="text-xl font-semibold text-white mb-6">Haftada Kaç Gün Antrenman Yapmak İstersiniz?</h2>
            <select
              value={userData.daysPerWeek}
              onChange={(e) => setUserData({ ...userData, daysPerWeek: e.target.value })}
              className="w-full px-6 py-4 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-transparent transition-all duration-300"
            >
              <option value="3">3 gün / hafta</option>
              <option value="4">4 gün / hafta</option>
              <option value="5">5 gün / hafta</option>
              <option value="6">6 gün / hafta</option>
            </select>
          </div>

          {/* Antrenman Süresi */}
          <div className="bg-gray-900/80 backdrop-blur-lg rounded-xl p-8 shadow-2xl">
            <h2 className="text-xl font-semibold text-white mb-6">Günlük Antrenman Süreniz</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {workoutDurations.map((duration) => (
                <button
                  key={duration.value}
                  type="button"
                  onClick={() => setUserData({ ...userData, workoutDuration: duration.value })}
                  className={`p-6 rounded-lg text-left transition-all duration-300 ${
                    userData.workoutDuration === duration.value
                      ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-lg transform scale-[1.02]'
                      : 'bg-gray-800/50 text-white hover:bg-gray-800/80'
                  }`}
                >
                  <h3 className="text-lg font-medium mb-2">{duration.label}</h3>
                  <p className={`text-sm ${
                    userData.workoutDuration === duration.value ? 'text-orange-100' : 'text-gray-400'
                  }`}>
                    {duration.description}
                  </p>
                </button>
              ))}
            </div>
          </div>

          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-orange-500 via-red-500 to-red-600 rounded-lg blur opacity-25 group-hover:opacity-100 transition duration-300"></div>
            <button
              type="submit"
              disabled={loading}
              className="relative w-full px-8 py-4 bg-gradient-to-r from-orange-500 via-red-500 to-red-600 text-white text-lg font-semibold rounded-lg hover:from-orange-400 hover:via-red-400 hover:to-red-500 transition-all duration-300 transform hover:-translate-y-1 hover:scale-[1.02] shadow-xl hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? 'Program Oluşturuluyor...' : 'Programımı Oluştur'}
            </button>
          </div>
        </form>

        {/* Progress Indicator */}
        <div className="mt-8 flex justify-center gap-2 animate-[fadeIn_1.2s_ease-out]">
          <div className="w-4 h-4 rounded-full bg-gray-700"></div>
          <div className="w-4 h-4 rounded-full bg-gray-700"></div>
          <div className="w-4 h-4 rounded-full bg-gradient-to-r from-orange-500 to-red-500"></div>
        </div>
      </div>
    </div>
  );
} 