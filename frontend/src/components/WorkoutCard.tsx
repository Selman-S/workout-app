'use client';

import useProgress from '../hooks/useProgress';

interface Exercise {
  id: number;
  name: string;
  sets: number;
  reps: number;
  restTime: number;
  workTime?: number;
  description: string;
}

interface WorkoutCardProps {
  id: number;
  title: string;
  description: string;
  exercises: Exercise[];
  duration: string;
  difficulty: 'Başlangıç' | 'Orta' | 'İleri';
  day: string;
  onClick?: () => void;
}

const WorkoutCard: React.FC<WorkoutCardProps> = ({
  id,
  title,
  description,
  exercises,
  duration,
  difficulty,
  day,
  onClick,
}) => {
  const { getCompletionPercentage, getLastCompleted } = useProgress(id.toString());
  const completionPercentage = getCompletionPercentage();
  const lastCompleted = getLastCompleted();

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Başlangıç':
        return 'bg-green-100 text-green-800';
      case 'Orta':
        return 'bg-yellow-100 text-yellow-800';
      case 'İleri':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div
      onClick={onClick}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer mx-2 sm:mx-0 my-2"
    >
      <div className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-3">
          <div>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
              {title}
            </h3>
            {lastCompleted && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Son tamamlanma: {new Date(lastCompleted).toLocaleDateString()}
              </p>
            )}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-2 py-1 rounded">
              {day}
            </span>
            <span
              className={`px-2 py-1 rounded text-sm ${getDifficultyColor(
                difficulty
              )}`}
            >
              {difficulty}
            </span>
          </div>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
          {description}
        </p>
        <div className="flex items-center gap-4 mb-4">
          <div className="inline-block bg-gray-100 dark:bg-gray-700 rounded px-2 py-1 text-sm text-gray-500 dark:text-gray-400">
            {duration}
          </div>
          <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 rounded-full transition-all duration-300"
              style={{ width: `${completionPercentage}%` }}
            ></div>
          </div>
          <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
            {completionPercentage}%
          </span>
        </div>
        <div className="space-y-3">
          {exercises.slice(0, 3).map((exercise) => (
            <div
              key={exercise.id}
              className="text-sm text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-700/50 p-3 rounded"
            >
              <div className="font-medium flex justify-between items-center">
                <span>• {exercise.name}</span>
                <span className="text-xs bg-gray-200 dark:bg-gray-600 px-2 py-1 rounded">
                  {exercise.sets}x{exercise.reps}
                </span>
              </div>
              <div className="text-xs mt-1 text-gray-500 dark:text-gray-400">
                {exercise.description}
              </div>
            </div>
          ))}
          {exercises.length > 3 && (
            <div className="text-sm text-blue-500 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 p-3 rounded text-center">
              +{exercises.length - 3} daha fazla egzersiz
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WorkoutCard; 