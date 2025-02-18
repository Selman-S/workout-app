'use client';

import { useState, useEffect, Suspense, use, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../../../components/Navbar';
import Timer from '../../../components/Timer';
import workoutData from '../../../data/workouts.json';
import useProgress from '../../../hooks/useProgress';

interface PageProps {
  params: Promise<{ id: string }>;
}

// Ana sayfa bileşeni
export default function WorkoutPage({ params }: PageProps) {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <Navbar />
      <Suspense fallback={<WorkoutLoading />}>
        <WorkoutContentWrapper params={params} />
      </Suspense>
    </div>
  );
}

// Yükleme durumu bileşeni
function WorkoutLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 sm:p-6 animate-pulse">
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-8"></div>
        <div className="space-y-4">
          <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    </div>
  );
}

// Params wrapper bileşeni
function WorkoutContentWrapper({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  return <WorkoutContent id={resolvedParams.id} />;
}

// Ana içerik bileşeni
function WorkoutContent({ id }: { id: string }) {
  const router = useRouter();
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [isResting, setIsResting] = useState(false);
  const [currentSet, setCurrentSet] = useState(1);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [isWorkoutComplete, setIsWorkoutComplete] = useState(false);
  const [isTimerStarted, setIsTimerStarted] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [shouldHandleComplete, setShouldHandleComplete] = useState(false);

  const workout = workoutData.workouts.find(
    (w) => w.id === parseInt(id)
  );

  const {
    progress,
    updateExerciseProgress,
    resetWorkoutProgress,
    getLastCompleted,
    getCompletionPercentage,
  } = useProgress(id);

  // İlerlemeyi yükle
  useEffect(() => {
    if (progress && workout) {
      setCurrentExerciseIndex(progress.currentExerciseIndex || 0);
      if (progress.exercises[progress.currentExerciseIndex]) {
        setCurrentSet(progress.exercises[progress.currentExerciseIndex].currentSet || 1);
      }
    }
  }, [progress, workout]);

  if (!workout) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Antrenman bulunamadı
          </h1>
          <button
            onClick={() => router.push('/')}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Ana Sayfaya Dön
          </button>
        </div>
      </div>
    );
  }

  const currentExercise = workout.exercises[currentExerciseIndex];
  const completionPercentage = getCompletionPercentage();
  const lastCompleted = getLastCompleted();

  const handleTimerComplete = useCallback(() => {
    setShouldHandleComplete(true);
  }, []);

  // Timer tamamlandığında state güncellemelerini yönet
  useEffect(() => {
    if (!shouldHandleComplete || !workout) return;

    if (isResting) {
      setIsResting(false);
      
      if (currentSet < currentExercise.sets) {
        // Sonraki sete geç
        const nextSet = currentSet + 1;
        setCurrentSet(nextSet);
        updateExerciseProgress(currentExerciseIndex, nextSet, currentExercise.sets);
        // Otomatik olarak sonraki seti başlat
        setIsTimerStarted(true);
      } else {
        // Egzersiz tamamlandı, son seti kaydet
        updateExerciseProgress(currentExerciseIndex, currentExercise.sets, currentExercise.sets);
        
        // Sonraki egzersize geç
        const nextExerciseIndex = currentExerciseIndex + 1;
        if (nextExerciseIndex < workout.exercises.length) {
          setTimeout(() => {
            setCurrentExerciseIndex(nextExerciseIndex);
            setCurrentSet(1);
            setIsResting(false);
            // Otomatik olarak sonraki egzersizi başlat
            setIsTimerStarted(true);
          }, 500);
        } else {
          setIsWorkoutComplete(true);
        }
      }
    } else {
      // Çalışma süresi bitti, dinlenmeye geç
      setIsResting(true);
      setIsTimerStarted(true);
    }

    setShouldHandleComplete(false);
  }, [shouldHandleComplete, isResting, currentSet, currentExercise, currentExerciseIndex, workout, updateExerciseProgress]);

  const nextExercise = () => {
    if (currentExerciseIndex < workout.exercises.length - 1) {
      setCurrentExerciseIndex(currentExerciseIndex + 1);
      setCurrentSet(1);
      setIsResting(false);
      setIsTimerStarted(false);
    }
  };

  const previousExercise = () => {
    if (currentExerciseIndex > 0) {
      setCurrentExerciseIndex(currentExerciseIndex - 1);
      setCurrentSet(1);
      setIsResting(false);
      setIsTimerStarted(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
              {workout.title}
            </h1>
            {lastCompleted && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Son tamamlanma: {new Date(lastCompleted).toLocaleDateString()}
              </p>
            )}
          </div>
          <div className="flex flex-col sm:items-end gap-2">
            <div className="flex items-center gap-2">
              <span className="text-sm sm:text-lg font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-2 py-1 rounded">
                {workout.day}
              </span>
              <span
                className={`px-2 py-1 rounded text-sm ${
                  workout.difficulty === 'Başlangıç'
                    ? 'bg-green-100 text-green-800'
                    : workout.difficulty === 'Orta'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                {workout.difficulty}
              </span>
            </div>
            <div className="w-full sm:w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
              <div
                className="bg-blue-500 h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${completionPercentage}%` }}
              ></div>
            </div>
          </div>
        </div>

        {isWorkoutComplete ? (
          <div className="text-center py-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Tebrikler! 🎉
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Bugünkü antrenmanı tamamladın!
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => router.push('/')}
                className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Ana Sayfaya Dön
              </button>
              <button
                onClick={() => {
                  setIsWorkoutComplete(false);
                  setCurrentExerciseIndex(0);
                  setCurrentSet(1);
                  setIsResting(false);
                }}
                className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
              >
                Tekrar Başla
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-4">
                <div className="flex items-center gap-4">
                  <button
                    onClick={previousExercise}
                    disabled={currentExerciseIndex === 0}
                    className="p-2 rounded-lg text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 disabled:opacity-50"
                  >
                    ←
                  </button>
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
                    {isResting
                      ? 'Dinlenme'
                      : `Egzersiz ${currentExerciseIndex + 1}/${
                          workout.exercises.length
                        } - Set ${currentSet}/${currentExercise.sets}`}
                  </h2>
                  <button
                    onClick={nextExercise}
                    disabled={currentExerciseIndex === workout.exercises.length - 1}
                    className="p-2 rounded-lg text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 disabled:opacity-50"
                  >
                    →
                  </button>
                </div>
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                  {isResting
                    ? `${currentExercise.restTime} sn dinlenme`
                    : `${currentExercise.workTime || 0} sn çalışma`}
                </span>
              </div>
              {!isResting && (
                <div className="mb-4 bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    {currentExercise.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                    {currentExercise.description}
                  </p>
                  <div className="inline-block text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-600 px-2 py-1 rounded">
                    {currentExercise.sets} set x {currentExercise.reps} tekrar
                  </div>
                </div>
              )}
              <div className="flex flex-col items-center gap-4">
                {!isTimerStarted && !isWorkoutComplete && (
                  <button
                    onClick={() => setIsTimerStarted(true)}
                    className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                  >
                    Başlat
                  </button>
                )}
                {isTimerStarted && (
                  <Timer
                    initialTime={isResting ? currentExercise.restTime : (currentExercise.workTime || 0)}
                    onComplete={handleTimerComplete}
                    isAutoStart={isTimerStarted}
                    isPaused={isPaused}
                    onPause={() => setIsPaused(true)}
                    onResume={() => setIsPaused(false)}
                    onSkip={handleTimerComplete}
                    exerciseName={currentExercise.name}
                    isResting={isResting}
                  />
                )}
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
                  Tüm Egzersizler
                </h2>
                <button
                  onClick={() => setShowResetConfirm(true)}
                  className="text-sm text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                >
                  İlerlemeyi Sıfırla
                </button>
              </div>
              {workout.exercises.map((exercise, index) => (
                <div
                  key={exercise.id}
                  className={`p-4 rounded-lg ${
                    index === currentExerciseIndex
                      ? 'bg-blue-50 dark:bg-blue-900'
                      : progress?.exercises[index]?.completed
                      ? 'bg-green-50 dark:bg-green-900/30'
                      : 'bg-gray-50 dark:bg-gray-700'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white mb-1">
                        {index + 1}. {exercise.name}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                        {exercise.description}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                      <span className="bg-gray-100 dark:bg-gray-600 px-2 py-1 rounded">
                        {exercise.sets} set x {exercise.reps} tekrar
                      </span>
                      <span className="bg-gray-100 dark:bg-gray-600 px-2 py-1 rounded">
                        {exercise.workTime || 0}s çalışma
                      </span>
                      <span className="bg-gray-100 dark:bg-gray-600 px-2 py-1 rounded">
                        {exercise.restTime}s dinlenme
                      </span>
                    </div>
                  </div>
                  {progress?.exercises[index]?.completed && (
                    <div className="mt-2 text-sm text-green-600 dark:text-green-400">
                      ✓ Tamamlandı
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* İlerlemeyi sıfırlama onay modalı */}
      {showResetConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-sm w-full">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              İlerlemeyi Sıfırla
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Bu antrenman için kaydettiğiniz tüm ilerleme silinecek. Emin misiniz?
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white"
              >
                İptal
              </button>
              <button
                onClick={() => {
                  resetWorkoutProgress();
                  setShowResetConfirm(false);
                  setCurrentExerciseIndex(0);
                  setCurrentSet(1);
                  setIsResting(false);
                  setIsWorkoutComplete(false);
                }}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Sıfırla
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 