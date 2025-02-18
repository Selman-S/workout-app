'use client';

interface Exercise {
  id: number;
  name: string;
  sets: number;
  reps: number;
  restTime: number;
}

interface WorkoutCardProps {
  title: string;
  description: string;
  exercises: Exercise[];
  duration: string;
  difficulty: 'Başlangıç' | 'Orta' | 'İleri';
  onClick?: () => void;
}

const WorkoutCard: React.FC<WorkoutCardProps> = ({
  title,
  description,
  exercises,
  duration,
  difficulty,
  onClick,
}) => {
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
      className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
    >
      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          {title}
        </h3>
        <p className="text-gray-600 dark:text-gray-300 mb-4">{description}</p>
        <div className="flex items-center space-x-4 mb-4">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {duration}
          </span>
          <span
            className={`px-2 py-1 rounded-full text-sm ${getDifficultyColor(
              difficulty
            )}`}
          >
            {difficulty}
          </span>
        </div>
        <div className="space-y-2">
          {exercises.slice(0, 3).map((exercise) => (
            <div
              key={exercise.id}
              className="text-sm text-gray-600 dark:text-gray-300"
            >
              • {exercise.name} ({exercise.sets}x{exercise.reps})
            </div>
          ))}
          {exercises.length > 3 && (
            <div className="text-sm text-blue-500">
              +{exercises.length - 3} daha fazla egzersiz
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WorkoutCard; 