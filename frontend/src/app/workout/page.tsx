'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import axios from '@/lib/axios';
interface User {
  name: string;
  hasCompletedOnboarding: boolean;
  workoutPlan?: {
    workouts: Array<{
      dayName: string;
      isRestDay: boolean;
      exercises: Array<{
        name: string;
        sets: number;
        reps: string;
        duration?: number;
        restTime: number;
        description: string;
      }>;
      notes?: string;
    }>;
    progress?: {
      completedWorkouts: number;
      totalWorkouts: number;
      lastWorkout?: Date;
    };
  };
  goal?: 'weight-loss' | 'muscle-gain' | 'endurance' | 'general-fitness';
}

export default function WorkoutPage() {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [workoutPlan, setWorkoutPlan] = useState<any>(null);

  useEffect(() => {

    console.log("user:", user);
    

    const fetchWorkoutPlan = async () => {
      // const response = await axios.get('/api/workout-plan');
      const response = JSON.parse(localStorage.getItem('workoutProgram') || '{}');
      console.log("response:", response);
      setWorkoutPlan(response);
      setLoading(false);
    };
    fetchWorkoutPlan();
  }, [user]);


  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  if (!user?.data?.hasCompletedOnboarding) {
    return (
      <div className="relative min-h-screen bg-gray-900 pt-16">
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

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-gradient-to-br from-orange-500/10 to-red-500/10 rounded-2xl p-8 backdrop-blur-lg border border-orange-500/20">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6">
                Kişisel Antrenman Planınızı Oluşturun
              </h2>
              <p className="text-gray-300 mb-8">
                Size özel, hedeflerinize uygun bir antrenman planı oluşturmak için birkaç soruya ihtiyacımız var.
              </p>
              <div className="relative group inline-block">
                <div className="absolute -inset-1 bg-gradient-to-r from-orange-500 via-red-500 to-red-600 rounded-lg blur opacity-25 group-hover:opacity-100 transition duration-300"></div>
                <Link
                  href="/onboarding/step2"
                  className="relative inline-flex items-center px-8 py-4 bg-gradient-to-r from-orange-500 via-red-500 to-red-600 text-white text-lg font-semibold rounded-lg hover:from-orange-400 hover:via-red-400 hover:to-red-500 transition-all duration-300 transform hover:-translate-y-1 hover:scale-[1.02] shadow-xl hover:shadow-2xl"
                >
                  Planımı Oluştur
                  <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!workoutPlan) {

    return (
      <div className="relative min-h-screen bg-gray-900 pt-16">
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

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-gradient-to-br from-orange-500/10 to-red-500/10 rounded-2xl p-8 backdrop-blur-lg border border-orange-500/20">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6">
                Antrenman Planınız Hazırlanıyor
              </h2>
              <p className="text-gray-300 mb-8">
                Bilgileriniz başarıyla kaydedildi. Antrenman planınız oluşturuluyor. Lütfen sayfayı yenileyin.
              </p>
              <div className="relative group inline-block">
                <div className="absolute -inset-1 bg-gradient-to-r from-orange-500 via-red-500 to-red-600 rounded-lg blur opacity-25 group-hover:opacity-100 transition duration-300"></div>
                <button
                  onClick={() => window.location.reload()}
                  className="relative inline-flex items-center px-8 py-4 bg-gradient-to-r from-orange-500 via-red-500 to-red-600 text-white text-lg font-semibold rounded-lg hover:from-orange-400 hover:via-red-400 hover:to-red-500 transition-all duration-300 transform hover:-translate-y-1 hover:scale-[1.02] shadow-xl hover:shadow-2xl"
                >
                  Sayfayı Yenile
                  <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-gray-900 pt-16">
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

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-8">
          {/* Bugünün antrenmanı */}
          <div className="bg-gray-800/80 backdrop-blur-sm rounded-xl p-8 shadow-xl border border-gray-700/50">
            <h2 className="text-2xl font-bold text-white mb-6">Bugünün Antrenmanı</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {workoutPlan.workouts.map((workout: any, workoutIndex: number) => (
                <div key={`workout-${workoutIndex}-${workout.dayName}`} className="bg-gray-700/50 rounded-lg p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-semibold text-white">{workout.dayName}</h3>
                    {workout.isRestDay ? (
                      <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm">
                        Dinlenme Günü
                      </span>
                    ) : (
                      <span className="px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-sm">
                        Antrenman Günü
                      </span>
                    )}
                  </div>
                  
                  <div className="space-y-4">
                    {workout.exercises.map((exercise: any, exerciseIndex: number) => (
                      <div key={`workout-${workoutIndex}-exercise-${exerciseIndex}`} className="bg-gray-800/50 rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="text-lg font-medium text-white">{exercise.name}</h4>
                          {exercise.duration && (
                            <span className="text-sm text-gray-400">
                              {exercise.duration} dk
                            </span>
                          )}
                        </div>
                        
                        <p className="text-gray-400 text-sm mb-3">{exercise.description}</p>
                        
                        {!workout.isRestDay && (
                          <div className="grid grid-cols-3 gap-4 text-sm">
                            <div className="bg-gray-700/30 rounded-lg p-2 text-center">
                              <span className="block text-gray-400">Set</span>
                              <span className="text-white">{exercise.sets}</span>
                            </div>
                            <div className="bg-gray-700/30 rounded-lg p-2 text-center">
                              <span className="block text-gray-400">Tekrar</span>
                              <span className="text-white">{exercise.reps}</span>
                            </div>
                            <div className="bg-gray-700/30 rounded-lg p-2 text-center">
                              <span className="block text-gray-400">Dinlenme</span>
                              <span className="text-white">{exercise.restTime}sn</span>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {workout.notes && (
                    <div className="mt-4 text-sm text-gray-400">
                      <p>{workout.notes}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* İlerleme özeti */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 shadow-xl border border-gray-700/50">
              <h3 className="text-lg font-semibold text-white mb-4">Haftalık İlerleme</h3>
              <div className="flex items-center">
                <div className="flex-1">
                  <div className="h-2 bg-gray-700 rounded-full">
                    <div 
                      className="h-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-full"
                      style={{ 
                        width: `${((workoutPlan?.progress?.completedWorkouts || 0) / 
                        (workoutPlan?.progress?.totalWorkouts || 1)) * 100}%` 
                      }}
                    ></div>
                  </div>
                </div>
                <span className="ml-4 text-white">
                  {workoutPlan?.progress?.completedWorkouts || 0}/
                  {workoutPlan?.progress?.totalWorkouts || 0}
                </span>
              </div>
            </div>

            <div className="bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 shadow-xl border border-gray-700/50">
              <h3 className="text-lg font-semibold text-white mb-4">Program Hedefi</h3>
              <p className="text-gray-400">
                {workoutPlan?.goal === 'weight-loss' && 'Yağ Yakımı'}
                {workoutPlan?.goal === 'muscle-gain' && 'Kas Kazanımı'}
                {workoutPlan?.goal === 'endurance' && 'Dayanıklılık'}
                {workoutPlan?.goal === 'general-fitness' && 'Genel Fitness'}
              </p>
            </div>

            <div className="bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 shadow-xl border border-gray-700/50">
              <h3 className="text-lg font-semibold text-white mb-4">Son Antrenman</h3>
              <p className="text-gray-400">
                {workoutPlan?.progress?.lastWorkout ? (
                  new Date(workoutPlan.progress.lastWorkout).toLocaleDateString('tr-TR')
                ) : (
                  'Henüz antrenman yapılmadı'
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 