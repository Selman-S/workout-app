'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAuthStore } from '@/store/authStore';

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

const workoutLocations = [
  { id: 'gym', title: 'Spor Salonu', description: 'Profesyonel ekipmanlarla antrenman' },
  { id: 'home', title: 'Ev', description: 'Minimum ekipmanla ev antrenmanı' }
];

interface ProfileData {
  age: number;
  gender: 'male' | 'female';
  height: number;
  weight: number;
  fitnessLevel: 'beginner' | 'intermediate' | 'advanced';
  goal: 'muscle_gain' | 'fat_loss' | 'endurance' | 'general_fitness';
  workoutDuration: number;
  workoutLocation: 'gym' | 'home';
  workoutPerWeek: number;
}

export default function OnboardingStep3() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { user, updateProfile } = useAuthStore();
  const [userData, setUserData] = useState({
    height: '',
    weight: '',
    age: '',
    gender: '',
    fitnessGoals: 'general-fitness',
    experienceLevels: 'beginner', 
    workoutDurations: 30,
    workoutLocation: 'gym',
    workoutPerWeek: 3
  });

  // Load data from localStorage on client-side only
  useEffect(() => {
    const step2Data = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('step2Data') || '{}') : {};
    setUserData(prevData => ({
      ...prevData,
      height: step2Data?.height || prevData.height,
      weight: step2Data?.weight || prevData.weight,
      age: step2Data?.age || prevData.age,
      gender: step2Data?.gender || prevData.gender,
      fitnessGoals: step2Data?.fitnessGoals || prevData.fitnessGoals,
      experienceLevels: step2Data?.experienceLevels || prevData.experienceLevels,
      workoutDurations: step2Data?.workoutDurations || prevData.workoutDurations,
      workoutLocation: step2Data?.workoutLocation || prevData.workoutLocation,
      workoutPerWeek: step2Data?.workoutPerWeek || prevData.workoutPerWeek
    }));
  }, []);

  // Profil bilgilerini yükle
  useEffect(() => {
    const loadProfileData = async () => {
      try {
        if (user?.data?._id) {
          const profile = user;
          if (profile?.data) {
            setUserData(prevData => ({
              ...prevData,
              fitnessGoals: profile.data.goal || prevData.fitnessGoals,
              experienceLevels: profile.data.fitnessLevel || prevData.experienceLevels,
              workoutDurations: profile.data.workoutDuration || prevData.workoutDurations,
              workoutLocation: profile.data.workoutLocation || prevData.workoutLocation
            }));
          }
        }
      } catch (err) {
        console.error('Profil yüklenirken hata:', err);
      }
    };

    loadProfileData();
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (!user?.data._id) {
        throw new Error('Kullanıcı bilgisi bulunamadı');
      }

      // Step2'den gelen verileri al
      const step2Data = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('userData') || '{}') : {};

      // Profil verilerini birleştir
      const profileData: ProfileData = {
        age: parseInt(step2Data.age),
        gender: step2Data.gender as 'male' | 'female',
        height: parseInt(step2Data.height),
        weight: parseInt(step2Data.weight),
        fitnessLevel: userData.experienceLevels as 'beginner' | 'intermediate' | 'advanced',
        goal: userData.fitnessGoals as 'muscle_gain' | 'fat_loss' | 'endurance' | 'general_fitness',
        workoutPerWeek: userData.workoutPerWeek,
        workoutDuration: userData.workoutDurations,
        workoutLocation: userData.workoutLocation as 'gym' | 'home',
      };

      // Profil güncelleme
      await updateProfile(profileData);

      // Mock program oluştur - hedef ve seviyeye göre özelleştirilmiş
      const mockProgram = generateWorkoutProgram(profileData);

      // Mock programı localStorage'a kaydet
      if (typeof window !== 'undefined') {
        localStorage.setItem('workoutProgram', JSON.stringify(mockProgram));
        localStorage.removeItem('userData');
      }
      
      router.push('/workout');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bir hata oluştu');
      console.error('Onboarding error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Hedef ve seviyeye göre özelleştirilmiş program oluştur
  const generateWorkoutProgram = (profile: ProfileData) => {
    const baseProgram = {
      userId: user?.data._id,
      startDate: new Date(),
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 haftalık program
      workouts: [] as any[]
    };

    // Hedef ve seviyeye göre egzersizleri belirle
    let exercises;
    if (profile.goal === 'muscle_gain') {
      exercises = {
        beginner: [
          { name: 'Dumbbell Squat', sets: 3, reps: 12, weight: 0 },
          { name: 'Push-up', sets: 3, reps: 10, weight: 0 },
          { name: 'Dumbbell Row', sets: 3, reps: 12, weight: 0 }
        ],
        intermediate: [
          { name: 'Barbell Squat', sets: 4, reps: 10, weight: 0 },
          { name: 'Bench Press', sets: 4, reps: 10, weight: 0 },
          { name: 'Bent Over Row', sets: 4, reps: 10, weight: 0 }
        ],
        advanced: [
          { name: 'Front Squat', sets: 5, reps: 8, weight: 0 },
          { name: 'Incline Bench Press', sets: 5, reps: 8, weight: 0 },
          { name: 'Weighted Pull-up', sets: 4, reps: 8, weight: 0 }
        ]
      };
    } else if (profile.goal === 'fat_loss') {
      exercises = {
        beginner: [
          { name: 'Bodyweight Squat', sets: 3, reps: 15, weight: 0 },
          { name: 'Mountain Climbers', sets: 3, duration: '30 sec', weight: 0 },
          { name: 'Plank', sets: 3, duration: '30 sec', weight: 0 }
        ],
        intermediate: [
          { name: 'Jump Squat', sets: 4, reps: 12, weight: 0 },
          { name: 'Burpee', sets: 3, reps: 10, weight: 0 },
          { name: 'Russian Twist', sets: 3, reps: 20, weight: 0 }
        ],
        advanced: [
          { name: 'Box Jump', sets: 4, reps: 10, weight: 0 },
          { name: 'Kettlebell Swing', sets: 4, reps: 15, weight: 0 },
          { name: 'Medicine Ball Slam', sets: 4, reps: 12, weight: 0 }
        ]
      };
    } else {
      exercises = {
        beginner: [
          { name: 'Squat', sets: 3, reps: 12, weight: 0 },
          { name: 'Push-up', sets: 3, reps: 10, weight: 0 },
          { name: 'Plank', sets: 3, duration: '30 sec', weight: 0 }
        ],
        intermediate: [
          { name: 'Lunge', sets: 3, reps: 12, weight: 0 },
          { name: 'Dips', sets: 3, reps: 10, weight: 0 },
          { name: 'Superman', sets: 3, duration: '30 sec', weight: 0 }
        ],
        advanced: [
          { name: 'Pistol Squat', sets: 3, reps: 8, weight: 0 },
          { name: 'Diamond Push-up', sets: 3, reps: 12, weight: 0 },
          { name: 'L-Sit', sets: 3, duration: '20 sec', weight: 0 }
        ]
      };
    }

    // Seçilen egzersizleri programa ekle
    const selectedExercises = exercises[profile.fitnessLevel];
    for (let i = 1; i <= profile.workoutDuration; i++) {
      baseProgram.workouts.push({
        day: i,
        exercises: selectedExercises
      });
    }

    return baseProgram;
  };

  return (
    <div className="relative min-h-screen pt-16">
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
                  onClick={() => setUserData({ ...userData, fitnessGoals: goal.id })}
                  className={`p-6 rounded-lg text-left transition-all duration-300 ${
                    userData.fitnessGoals === goal.id
                      ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-lg transform scale-[1.02]'
                      : 'bg-gray-800/50 text-white hover:bg-gray-800/80'
                  }`}
                >
                  <h3 className="text-lg font-medium mb-2">{goal.title}</h3>
                  <p className={`text-sm ${
                    userData.fitnessGoals === goal.id ? 'text-orange-100' : 'text-gray-400'
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
                  onClick={() => setUserData({ ...userData, experienceLevels: level.id })}
                  className={`p-6 rounded-lg text-left transition-all duration-300 ${
                    userData.experienceLevels === level.id
                      ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-lg transform scale-[1.02]'
                      : 'bg-gray-800/50 text-white hover:bg-gray-800/80'
                  }`}
                >
                  <h3 className="text-lg font-medium mb-2">{level.title}</h3>
                  <p className={`text-sm ${
                    userData.experienceLevels === level.id ? 'text-orange-100' : 'text-gray-400'
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
              value={userData.workoutPerWeek}
              onChange={(e) => setUserData({ ...userData, workoutPerWeek: parseInt(e.target.value) })}
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
                  onClick={() => setUserData({ ...userData, workoutDurations: duration.value })}
                  className={`p-6 rounded-lg text-left transition-all duration-300 ${
                    userData.workoutDurations === duration.value
                      ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-lg transform scale-[1.02]'
                      : 'bg-gray-800/50 text-white hover:bg-gray-800/80'
                  }`}
                >
                  <h3 className="text-lg font-medium mb-2">{duration.label}</h3>
                  <p className={`text-sm ${
                    userData.workoutDurations === duration.value ? 'text-orange-100' : 'text-gray-400'
                  }`}>
                    {duration.description}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Antrenman Yeri */}
          <div className="bg-gray-900/80 backdrop-blur-lg rounded-xl p-8 shadow-2xl">
            <h2 className="text-xl font-semibold text-white mb-6">Nerede Antrenman Yapmak İstersiniz?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {workoutLocations.map((location) => (
                <button
                  key={location.id}
                  type="button"
                  onClick={() => setUserData({ ...userData, workoutLocation: location.id })}
                  className={`p-6 rounded-lg text-left transition-all duration-300 ${
                    userData.workoutLocation === location.id
                      ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-lg transform scale-[1.02]'
                      : 'bg-gray-800/50 text-white hover:bg-gray-800/80'
                  }`}
                >
                  <h3 className="text-lg font-medium mb-2">{location.title}</h3>
                  <p className={`text-sm ${
                    userData.workoutLocation === location.id ? 'text-orange-100' : 'text-gray-400'
                  }`}>
                    {location.description}
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
          <div className="w-4 h-4 rounded-full bg-gradient-to-r from-orange-500 to-red-500"></div>
        </div>
      </div>
    </div>
  );
} 