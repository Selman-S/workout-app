import { useState, useEffect } from 'react';

interface ExerciseProgress {
  completed: boolean;
  currentSet: number;
  totalSets: number;
}

interface WorkoutProgress {
  lastCompleted?: string;
  currentExerciseIndex: number;
  exercises: ExerciseProgress[];
}

const useProgress = (workoutId: string) => {
  const [progress, setProgress] = useState<WorkoutProgress | null>(null);

  // LocalStorage'dan ilerlemeyi yükle
  useEffect(() => {
    try {
      const savedProgress = localStorage.getItem(`workout_${workoutId}`);
      if (savedProgress) {
        setProgress(JSON.parse(savedProgress));
      } else {
        // İlk kez başlatılıyorsa boş ilerleme oluştur
        setProgress({
          currentExerciseIndex: 0,
          exercises: []
        });
      }
    } catch (error) {
      console.error('Error loading progress:', error);
      setProgress({
        currentExerciseIndex: 0,
        exercises: []
      });
    }
  }, [workoutId]);

  // İlerlemeyi kaydet
  const saveProgress = (newProgress: WorkoutProgress) => {
    try {
      setProgress(newProgress);
      localStorage.setItem(`workout_${workoutId}`, JSON.stringify(newProgress));
    } catch (error) {
      console.error('Error saving progress:', error);
    }
  };

  // Egzersiz ilerlemesini güncelle
  const updateExerciseProgress = (
    exerciseIndex: number,
    currentSet: number,
    totalSets: number
  ) => {
    if (!progress) return;

    const newProgress = { ...progress };
    
    // Egzersiz dizisini güncelle veya oluştur
    if (!newProgress.exercises[exerciseIndex]) {
      newProgress.exercises[exerciseIndex] = {
        completed: false,
        currentSet: 1,
        totalSets
      };
    }

    // Set ilerlemesini güncelle
    newProgress.exercises[exerciseIndex].currentSet = currentSet;
    
    // Eğer son set tamamlandıysa egzersizi tamamlandı olarak işaretle
    if (currentSet >= totalSets) {
      newProgress.exercises[exerciseIndex].completed = true;
      newProgress.exercises[exerciseIndex].currentSet = totalSets;
      
      // Eğer tüm egzersizler tamamlandıysa son tamamlanma tarihini güncelle
      const allCompleted = newProgress.exercises.every((ex) => ex.completed);
      if (allCompleted) {
        newProgress.lastCompleted = new Date().toISOString().split('T')[0];
      }
    }

    // Mevcut egzersiz indeksini güncelle
    newProgress.currentExerciseIndex = exerciseIndex;

    saveProgress(newProgress);
  };

  // Antrenman ilerlemesini sıfırla
  const resetWorkoutProgress = () => {
    const newProgress = {
      currentExerciseIndex: 0,
      exercises: []
    };
    saveProgress(newProgress);
  };

  // Son tamamlanma tarihini kontrol et
  const getLastCompleted = () => {
    return progress?.lastCompleted || null;
  };

  // Antrenmanın tamamlanma yüzdesini hesapla
  const getCompletionPercentage = () => {
    if (!progress?.exercises.length) return 0;

    const completedExercises = progress.exercises.filter((ex) => ex.completed).length;
    const totalExercises = progress.exercises.length;
    
    return Math.round((completedExercises / totalExercises) * 100);
  };

  return {
    progress,
    updateExerciseProgress,
    resetWorkoutProgress,
    getLastCompleted,
    getCompletionPercentage,
  };
};

export default useProgress; 