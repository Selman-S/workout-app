'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../../components/Navbar';
import WorkoutCard from '../../components/WorkoutCard';
import workoutData from '../../data/workouts.json';

type Difficulty = "Başlangıç" | "Orta" | "İleri";

export default function WorkoutsPage() {
  const router = useRouter();
  const [selectedDay, setSelectedDay] = useState<string>('all');

  const days = [
    'Pazartesi',
    'Salı',
    'Çarşamba',
    'Perşembe',
    'Cuma',
    'Cumartesi',
    'Pazar',
  ];

  const filteredWorkouts = workoutData.workouts.filter((workout) => {
    if (selectedDay === 'all') return true;
    return workout.day === selectedDay;
  });

  return (
    <main className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Haftalık Antrenman Programı
          </h1>
          
          {/* Gün filtreleme */}
          <div className="overflow-x-auto pb-2">
            <div className="flex space-x-2 min-w-max">
              <button
                onClick={() => setSelectedDay('all')}
                className={`px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap ${
                  selectedDay === 'all'
                    ? 'bg-blue-500 text-white'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                }`}
              >
                Tüm Günler
              </button>
              {days.map((day) => (
                <button
                  key={day}
                  onClick={() => setSelectedDay(day)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap ${
                    selectedDay === day
                      ? 'bg-blue-500 text-white'
                      : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  {day}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Program açıklaması */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Program Hakkında
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
            8 haftalık evde yapılabilecek tam vücut spor programı. İlk 4 hafta adaptasyon, sonraki 4 hafta yoğunluğu artırıyoruz.
          </p>
          <div className="flex flex-wrap gap-2 text-xs">
            <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-2 py-1 rounded">
              Süre: 8 Hafta
            </span>
            <span className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 px-2 py-1 rounded">
              Hedef: Kuvvet ve Dayanıklılık
            </span>
            <span className="bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 px-2 py-1 rounded">
              Ekipman: Vücut Ağırlığı
            </span>
          </div>
        </div>

        {/* Antrenman kartları */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredWorkouts.map((workout) => (
            <WorkoutCard
              key={workout.id}
              {...workout}
              difficulty={workout.difficulty as Difficulty}
              onClick={() => router.push(`/workout/${workout.id}`)}
            />
          ))}
          {filteredWorkouts.length === 0 && (
            <div className="col-span-full text-center py-8">
              <p className="text-gray-600 dark:text-gray-300">
                {selectedDay === 'Perşembe' || selectedDay === 'Pazar'
                  ? 'Bugün dinlenme günü! 😴'
                  : 'Bu güne ait antrenman bulunamadı.'}
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
} 