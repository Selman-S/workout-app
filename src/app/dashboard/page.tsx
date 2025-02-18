'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import WorkoutCard from '@/components/WorkoutCard';
import workoutData from '@/data/workouts.json';
import { useAuth } from '@/contexts/AuthContext';

type Difficulty = "Başlangıç" | "Orta" | "İleri";

interface DayActivity {
  date: string;
  completed: boolean;
  skipped: boolean;
  duration: number;
}

interface UserGoal {
  type: 'weekly' | 'monthly';
  workoutCount: number;
  duration: number;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  progress: number;
  total: number;
  unlocked: boolean;
}

// Style constants
const gradients = {
  blue: 'bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700',
  green: 'bg-gradient-to-r from-green-500 to-green-600 dark:from-green-600 dark:to-green-700',
  red: 'bg-gradient-to-r from-red-500 to-red-600 dark:from-red-600 dark:to-red-700',
};

function ErrorFallback({ error }: { error: Error }) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">
            Bir hata oluştu
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Uygulama yüklenirken bir sorun oluştu. Lütfen sayfayı yenileyin veya daha sonra tekrar deneyin.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Sayfayı Yenile
          </button>
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [error, setError] = useState<Error | null>(null);
  const [difficulty, setDifficulty] = useState<string>('all');
  const [totalWorkouts, setTotalWorkouts] = useState(0);
  const [totalMinutes, setTotalMinutes] = useState(0);
  const [weeklyProgress, setWeeklyProgress] = useState<DayActivity[]>([]);
  const [performanceScore, setPerformanceScore] = useState(0);
  const [userGoal, setUserGoal] = useState<UserGoal>({
    type: 'weekly',
    workoutCount: 5,
    duration: 200
  });
  
  const [achievements, setAchievements] = useState<Achievement[]>([
    {
      id: 'first_workout',
      title: 'İlk Adım',
      description: 'İlk antrenmanını tamamla',
      progress: 0,
      total: 1,
      unlocked: false
    },
    {
      id: 'consistent_week',
      title: 'Tutarlı Sporcu',
      description: 'Bir hafta boyunca tüm antrenmanları tamamla',
      progress: 0,
      total: 5,
      unlocked: false
    },
    {
      id: 'duration_master',
      title: 'Dayanıklılık Ustası',
      description: 'Toplam 500 dakika antrenman yap',
      progress: 0,
      total: 500,
      unlocked: false
    }
  ]);

  useEffect(() => {
    console.log('Current user:', user);
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  // Load saved data
  useEffect(() => {
    try {
      const savedGoal = localStorage.getItem('userGoal');
      if (savedGoal) {
        setUserGoal(JSON.parse(savedGoal));
      }

      const savedAchievements = localStorage.getItem('achievements');
      if (savedAchievements) {
        setAchievements(JSON.parse(savedAchievements));
      }
    } catch (error) {
      console.error('Error loading saved data:', error);
      setError(error instanceof Error ? error : new Error('Failed to load saved data'));
    }
  }, []);

  // Calculate progress
  useEffect(() => {
    const calculateProgress = () => {
      try {
        let completedWorkouts = 0;
        let totalMins = 0;
        const lastWeekActivity: DayActivity[] = [];
        
        // Create last 7 days
        for (let i = 6; i >= 0; i--) {
          const date = new Date();
          date.setDate(date.getDate() - i);
          lastWeekActivity.push({
            date: date.toISOString().split('T')[0],
            completed: false,
            skipped: false,
            duration: 0
          });
        }

        // Check progress for each workout
        workoutData.workouts.forEach(workout => {
          try {
            const progress = localStorage.getItem(`workout_${workout.id}`);
            if (progress) {
              const data = JSON.parse(progress);
              if (data.lastCompleted) {
                const completionDate = new Date(data.lastCompleted);
                const today = new Date();
                const diffDays = Math.floor((today.getTime() - completionDate.getTime()) / (1000 * 60 * 60 * 24));
                
                if (diffDays < 7) {
                  const dayIndex = 6 - diffDays;
                  lastWeekActivity[dayIndex].completed = true;
                  
                  // Calculate exercise time
                  const exerciseTime = data.exercises.reduce((total: number, ex: any) => {
                    if (ex.completed) {
                      const exercise = workout.exercises.find(e => e.id === ex.id);
                      if (exercise) {
                        return total + (exercise.workTime || 0) * ex.currentSet;
                      }
                    }
                    return total;
                  }, 0);
                  
                  lastWeekActivity[dayIndex].duration = exerciseTime / 60;
                  totalMins += exerciseTime / 60;
                  completedWorkouts++;
                }
              }
            }
          } catch (error) {
            console.error(`Error processing workout ${workout.id}:`, error);
            // Continue with other workouts even if one fails
          }
        });

        // Mark missed workout days
        lastWeekActivity.forEach((day, index) => {
          const dayName = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'][new Date(day.date).getDay()];
          const shouldWorkout = workoutData.workouts.some(w => w.day === dayName);
          if (shouldWorkout && !day.completed) {
            day.skipped = true;
          }
        });

        const score = calculatePerformanceScore(lastWeekActivity);

        setTotalWorkouts(completedWorkouts);
        setTotalMinutes(Math.round(totalMins));
        setWeeklyProgress(lastWeekActivity);
        setPerformanceScore(score);
      } catch (error) {
        console.error('Error calculating progress:', error);
        setError(error instanceof Error ? error : new Error('Failed to calculate progress'));
      }
    };

    calculateProgress();
  }, []);

  // Başarıları güncelle
  useEffect(() => {
    const updateAchievements = () => {
      const newAchievements = [...achievements];
      
      // İlk antrenman başarısı
      if (totalWorkouts > 0) {
        const firstWorkout = newAchievements.find(a => a.id === 'first_workout');
        if (firstWorkout && !firstWorkout.unlocked) {
          firstWorkout.progress = 1;
          firstWorkout.unlocked = true;
        }
      }

      // Tutarlı hafta başarısı
      const consistentWeek = newAchievements.find(a => a.id === 'consistent_week');
      if (consistentWeek) {
        const completedThisWeek = weeklyProgress.filter(day => day.completed).length;
        consistentWeek.progress = completedThisWeek;
        if (completedThisWeek >= consistentWeek.total && !consistentWeek.unlocked) {
          consistentWeek.unlocked = true;
        }
      }

      // Toplam süre başarısı
      const durationMaster = newAchievements.find(a => a.id === 'duration_master');
      if (durationMaster) {
        durationMaster.progress = totalMinutes;
        if (totalMinutes >= durationMaster.total && !durationMaster.unlocked) {
          durationMaster.unlocked = true;
        }
      }

      // Sadece başarılarda değişiklik varsa state'i güncelle
      if (JSON.stringify(newAchievements) !== JSON.stringify(achievements)) {
        setAchievements(newAchievements);
        localStorage.setItem('achievements', JSON.stringify(newAchievements));
      }
    };

    updateAchievements();
  }, [totalWorkouts, weeklyProgress, totalMinutes, achievements]);

  // Performans puanı hesaplama
  const calculatePerformanceScore = (activities: DayActivity[]): number => {
    const totalWorkoutDays = workoutData.workouts.length;
    const lastWeekWorkouts = activities.filter(day => day.completed).length;
    const missedWorkouts = activities.filter(day => day.skipped).length;
    
    // Puanlama kriterleri:
    // 1. Planlanan antrenmanları tamamlama oranı (50 puan)
    // 2. Antrenman süresi tutarlılığı (25 puan)
    // 3. Düzenlilik (25 puan)
    
    const completionScore = (lastWeekWorkouts / totalWorkoutDays) * 50;
    const consistencyScore = missedWorkouts === 0 ? 25 : 25 - (missedWorkouts * 5);
    const durationScore = activities.filter(day => day.duration > 30).length * (25 / totalWorkoutDays);
    
    return Math.round(Math.max(0, Math.min(100, completionScore + consistencyScore + durationScore)));
  };

  const days = [
    'Pazar',
    'Pazartesi',
    'Salı',
    'Çarşamba',
    'Perşembe',
    'Cuma',
    'Cumartesi',
  ];

  const today = days[new Date().getDay()];
  const todaysWorkout = workoutData.workouts.find((w) => w.day === today);

  const filteredWorkouts = workoutData.workouts.filter((workout) => {
    if (difficulty === 'all') return true;
    return workout.difficulty === difficulty;
  });

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return null;
  }

  if (error) {
    return <ErrorFallback error={error} />;
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        {/* Kişisel Gelişim Takibi */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl sm:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-800 dark:from-blue-400 dark:to-blue-600">
              Kişisel Gelişim
            </h2>
            <div className="text-sm text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 px-4 py-2 rounded-full shadow-sm">
              Son güncelleme: {new Date().toLocaleDateString('tr-TR')}
            </div>
          </div>

          {/* İstatistik Kartları */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Performans Puanı
                </h3>
                <div className={`p-2 rounded-lg ${performanceScore >= 70 ? gradients.green : performanceScore >= 40 ? gradients.blue : gradients.red}`}>
                  <span className="text-white text-xs font-medium">
                    {performanceScore >= 70 ? 'Mükemmel' : performanceScore >= 40 ? 'İyi' : 'Geliştirilebilir'}
                  </span>
                </div>
              </div>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {performanceScore}
                <span className="text-lg text-gray-500 dark:text-gray-400">/100</span>
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                Tamamlanan Antrenman
              </h3>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {totalWorkouts}
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                Toplam Süre
              </h3>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {totalMinutes} dakika
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                Haftalık Hedef
              </h3>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {Math.round((weeklyProgress.filter(day => day.completed).length / 5) * 100)}%
              </p>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                Hedef: Haftada 5 gün
              </span>
            </div>
          </div>

          {/* Haftalık Aktivite Grafiği */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
            <h3 className="text-sm text-gray-500 dark:text-gray-400 mb-3">
              Haftalık Aktivite
            </h3>
            <div className="flex items-end justify-between h-32 gap-1">
              {weeklyProgress.map((day, index) => (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div className="w-full flex flex-col items-center">
                    {day.duration > 0 && (
                      <span className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                        {Math.round(day.duration)}dk
                      </span>
                    )}
                    <div
                      className={`w-full rounded-t ${
                        day.completed
                          ? 'bg-blue-500 dark:bg-blue-600'
                          : day.skipped
                          ? 'bg-red-300 dark:bg-red-800'
                          : 'bg-gray-200 dark:bg-gray-700'
                      }`}
                      style={{ height: day.completed ? `${Math.min(100, day.duration)}%` : '20%' }}
                    ></div>
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {['Pz', 'Pt', 'S', 'Ç', 'P', 'C', 'Ct'][new Date(day.date).getDay()]}
                  </span>
                </div>
              ))}
            </div>
            <div className="flex justify-center gap-4 mt-4 text-xs text-gray-500 dark:text-gray-400">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-blue-500 dark:bg-blue-600 rounded"></div>
                <span>Tamamlandı</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-red-300 dark:bg-red-800 rounded"></div>
                <span>Kaçırıldı</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-gray-200 dark:bg-gray-700 rounded"></div>
                <span>Antrenman Yok</span>
              </div>
            </div>
          </div>

          {/* Başarılar */}
          <div className="mt-4 bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Başarılar
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {achievements.map((achievement) => (
                <div
                  key={achievement.id}
                  className={`p-4 rounded-lg border ${
                    achievement.unlocked
                      ? 'border-green-500 dark:border-green-600'
                      : 'border-gray-200 dark:border-gray-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      {achievement.title}
                    </h4>
                    {achievement.unlocked && (
                      <span className="text-green-500">✓</span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    {achievement.description}
                  </p>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                      style={{
                        width: `${Math.min(
                          100,
                          (achievement.progress / achievement.total) * 100
                        )}%`,
                      }}
                    ></div>
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {achievement.progress} / {achievement.total}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Hedefler */}
          <div className="mt-4 bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Hedeflerim
              </h3>
              <button
                onClick={() => {
                  try {
                    const newGoal = {
                      ...userGoal,
                      type: (userGoal.type === 'weekly' ? 'monthly' : 'weekly') as 'weekly' | 'monthly'
                    };
                    setUserGoal(newGoal);
                    localStorage.setItem('userGoal', JSON.stringify(newGoal));
                  } catch (error) {
                    console.error('Error updating goal:', error);
                    setError(error instanceof Error ? error : new Error('Failed to update goal'));
                  }
                }}
                className="text-sm text-blue-500 hover:text-blue-600"
              >
                {userGoal.type === 'weekly' ? 'Aylık Göster' : 'Haftalık Göster'}
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Antrenman Sayısı
                </h4>
                <div className="flex items-end gap-2">
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {weeklyProgress.filter(day => day.completed).length}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    / {userGoal.workoutCount} {userGoal.type === 'weekly' ? 'haftalık' : 'aylık'}
                  </div>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2 mt-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{
                      width: `${Math.min(
                        100,
                        (weeklyProgress.filter(day => day.completed).length / userGoal.workoutCount) * 100
                      )}%`,
                    }}
                  ></div>
                </div>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Toplam Süre
                </h4>
                <div className="flex items-end gap-2">
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {totalMinutes}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    / {userGoal.duration} dakika
                  </div>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2 mt-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{
                      width: `${Math.min(100, (totalMinutes / userGoal.duration) * 100)}%`,
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bugünün antrenmanı */}
        {todaysWorkout ? (
          <div className="mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Bugünün Antrenmanı
            </h2>
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 p-1 rounded-lg">
              <WorkoutCard
                key={todaysWorkout.id}
                {...todaysWorkout}
                difficulty={todaysWorkout.difficulty as Difficulty}
                onClick={() => router.push(`/workout/${todaysWorkout.id}`)}
              />
            </div>
          </div>
        ) : (
          <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-lg p-6 text-center">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Bugün Dinlenme Günü! 🎉
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Dinlenme de antrenman kadar önemli. Yarın yeni bir güne enerjik başlayacaksın!
            </p>
          </div>
        )}

        {/* Tüm antrenmanlar */}
        <div className="mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Tüm Antrenmanlar
          </h2>
          <div className="flex items-center space-x-4 overflow-x-auto pb-2">
            <button
              onClick={() => setDifficulty('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap ${
                difficulty === 'all'
                  ? 'bg-blue-500 text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300'
              }`}
            >
              Tümü
            </button>
            {['Başlangıç', 'Orta', 'İleri'].map((level) => (
              <button
                key={level}
                onClick={() => setDifficulty(level)}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap ${
                  difficulty === level
                    ? 'bg-blue-500 text-white'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                }`}
              >
                {level}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredWorkouts
            .filter((w) => w.id !== todaysWorkout?.id)
            .map((workout) => (
              <WorkoutCard
                key={workout.id}
                {...workout}
                difficulty={workout.difficulty as Difficulty}
                onClick={() => router.push(`/workout/${workout.id}`)}
              />
            ))}
        </div>
      </div>
    </main>
  );
} 