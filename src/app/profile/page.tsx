'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import authService from '@/services/authService';

interface WorkoutPlan {
  days: WorkoutDay[];
}

interface WorkoutDay {
  day: number;
  exercises: Exercise[];
}

interface Exercise {
  name: string;
  sets: number;
  reps: string;
  duration?: number;
  restTime: number;
}

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [workoutPlan, setWorkoutPlan] = useState<WorkoutPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await authService.getCurrentUser();
        setUser(userData);
        generateWorkoutPlan(userData);
      } catch (error) {
        console.error('Error fetching user data:', error);
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [router]);

  const generateWorkoutPlan = (userData: any) => {
    const { fitnessLevel, goal, daysPerWeek, workoutDuration, age, weight, height } = userData;
    
    // BMI hesaplama
    const heightInMeters = height / 100;
    const bmi = weight / (heightInMeters * heightInMeters);
    
    // Temel egzersiz havuzu
    const exercises = {
      cardio: [
        { name: 'Yürüyüş', duration: 20, intensity: 'low' },
        { name: 'Koşu', duration: 15, intensity: 'medium' },
        { name: 'HIIT Koşu', duration: 10, intensity: 'high' }
      ],
      strength: [
        { name: 'Push-up', sets: 3, reps: '10-12', restTime: 60 },
        { name: 'Squat', sets: 3, reps: '12-15', restTime: 60 },
        { name: 'Plank', sets: 3, reps: '30 saniye', restTime: 45 },
        { name: 'Dumbbell Row', sets: 3, reps: '12-15', restTime: 60 }
      ],
      flexibility: [
        { name: 'Stretching', duration: 10, intensity: 'low' },
        { name: 'Yoga', duration: 15, intensity: 'medium' }
      ]
    };

    // Fitness seviyesine göre egzersiz yoğunluğu ayarlama
    const intensityMultiplier = {
      beginner: 0.7,
      intermediate: 1,
      advanced: 1.3
    };

    // Hedeflere göre egzersiz dağılımı
    const goalDistribution = {
      'weight-loss': { cardio: 0.5, strength: 0.4, flexibility: 0.1 },
      'muscle-gain': { cardio: 0.2, strength: 0.7, flexibility: 0.1 },
      'endurance': { cardio: 0.6, strength: 0.3, flexibility: 0.1 },
      'general-fitness': { cardio: 0.4, strength: 0.4, flexibility: 0.2 }
    };

    // Antrenman planı oluşturma
    const workoutDays: WorkoutDay[] = [];
    
    for (let day = 1; day <= parseInt(daysPerWeek); day++) {
      const dayExercises: Exercise[] = [];
      const distribution = goalDistribution[goal as keyof typeof goalDistribution];
      let remainingDuration = workoutDuration;

      // Kardio egzersizleri ekleme
      const cardioDuration = Math.floor(workoutDuration * distribution.cardio);
      const cardioExercise = exercises.cardio.find(e => 
        e.intensity === (fitnessLevel === 'beginner' ? 'low' : fitnessLevel === 'intermediate' ? 'medium' : 'high')
      );
      if (cardioExercise) {
        dayExercises.push({
          name: cardioExercise.name,
          duration: Math.floor(cardioDuration * intensityMultiplier[fitnessLevel as keyof typeof intensityMultiplier]),
          sets: 1,
          reps: 'Sürekli',
          restTime: 60
        });
        remainingDuration -= cardioDuration;
      }

      // Kuvvet egzersizleri ekleme
      const strengthDuration = Math.floor(remainingDuration * (distribution.strength / (distribution.strength + distribution.flexibility)));
      const strengthExercises = exercises.strength.slice(0, 3);
      strengthExercises.forEach(exercise => {
        dayExercises.push({
          name: exercise.name,
          sets: Math.floor(exercise.sets * intensityMultiplier[fitnessLevel as keyof typeof intensityMultiplier]),
          reps: exercise.reps,
          restTime: exercise.restTime
        });
      });

      // Esneklik egzersizleri ekleme
      const flexibilityExercise = exercises.flexibility[0];
      dayExercises.push({
        name: flexibilityExercise.name,
        duration: flexibilityExercise.duration,
        sets: 1,
        reps: 'Sürekli',
        restTime: 30
      });

      workoutDays.push({ day, exercises: dayExercises });
    }

    setWorkoutPlan({ days: workoutDays });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-gray-800 rounded-lg shadow-xl p-8">
          <h1 className="text-3xl font-bold text-white mb-8">Profil ve Antrenman Planı</h1>
          
          {user && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div className="bg-gray-700 rounded-lg p-6">
                <h2 className="text-xl font-semibold text-white mb-4">Kişisel Bilgiler</h2>
                <div className="space-y-2 text-gray-300">
                  <p><span className="font-medium">İsim:</span> {user.name}</p>
                  <p><span className="font-medium">Yaş:</span> {user.age}</p>
                  <p><span className="font-medium">Boy:</span> {user.height} cm</p>
                  <p><span className="font-medium">Kilo:</span> {user.weight} kg</p>
                  <p><span className="font-medium">Fitness Seviyesi:</span> {user.fitnessLevel}</p>
                  <p><span className="font-medium">Hedef:</span> {user.goal}</p>
                </div>
              </div>

              <div className="bg-gray-700 rounded-lg p-6">
                <h2 className="text-xl font-semibold text-white mb-4">Antrenman Tercihleri</h2>
                <div className="space-y-2 text-gray-300">
                  <p><span className="font-medium">Haftalık Antrenman:</span> {user.daysPerWeek} gün</p>
                  <p><span className="font-medium">Antrenman Süresi:</span> {user.workoutDuration} dakika</p>
                </div>
              </div>
            </div>
          )}

          {workoutPlan && (
            <div className="mt-8">
              <h2 className="text-2xl font-bold text-white mb-6">Kişisel Antrenman Planı</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {workoutPlan.days.map((day) => (
                  <div key={day.day} className="bg-gray-700 rounded-lg p-6">
                    <h3 className="text-xl font-semibold text-white mb-4">Gün {day.day}</h3>
                    <div className="space-y-4">
                      {day.exercises.map((exercise, index) => (
                        <div key={index} className="bg-gray-600 rounded-lg p-4">
                          <h4 className="text-lg font-medium text-white mb-2">{exercise.name}</h4>
                          <div className="text-gray-300 space-y-1">
                            {exercise.duration ? (
                              <p>Süre: {exercise.duration} dakika</p>
                            ) : (
                              <>
                                <p>Set: {exercise.sets}</p>
                                <p>Tekrar: {exercise.reps}</p>
                              </>
                            )}
                            <p>Dinlenme: {exercise.restTime} saniye</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 