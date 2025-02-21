'use client';

import { useState, useEffect } from 'react';

interface TimerProps {
  initialTime: number;
  onComplete?: () => void;
  isAutoStart?: boolean;
  isPaused?: boolean;
  onPause?: () => void;
  onResume?: () => void;
  onSkip?: () => void;
  exerciseName?: string;
  isResting?: boolean;
}

const Timer: React.FC<TimerProps> = ({
  initialTime,
  onComplete,
  isAutoStart = false,
  isPaused = false,
  onPause,
  onResume,
  onSkip,
  exerciseName,
  isResting
}) => {
  const [time, setTime] = useState(initialTime);
  const [isActive, setIsActive] = useState(false);
  const [isPreparing, setIsPreparing] = useState(true);
  const [prepTime, setPrepTime] = useState(3);

  useEffect(() => {
    setTime(initialTime);
    setIsActive(isAutoStart);
    if (isAutoStart) {
      setIsPreparing(true);
      setPrepTime(3);
    }
  }, [initialTime, isAutoStart]);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isPreparing && prepTime > 0) {
      interval = setInterval(() => {
        setPrepTime((prev) => prev - 1);
      }, 1000);
    } else if (isPreparing && prepTime === 0) {
      setIsPreparing(false);
      setIsActive(true);
    } else if (isActive && !isPaused && time > 0) {
      interval = setInterval(() => {
        setTime((prevTime) => {
          if (prevTime <= 1) {
            setIsActive(false);
            onComplete?.();
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isActive, isPaused, time, onComplete, isPreparing, prepTime]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const calculateProgress = () => {
    if (isPreparing) {
      return ((3 - prepTime) / 3) * 100;
    }
    return ((initialTime - time) / initialTime) * 100;
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      {/* Hazırlık sayacı */}
      {isPreparing && (
        <div className="text-center">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
            Hazırlan!
          </h3>
          {exerciseName && !isResting && (
            <p className="text-lg text-blue-600 dark:text-blue-400 mb-2">
              {exerciseName}
            </p>
          )}
          <div className="text-4xl font-bold text-gray-900 dark:text-white">
            {prepTime}
          </div>
        </div>
      )}

      {/* Ana timer */}
      {!isPreparing && (
        <div className="relative">
          {/* Dairesel ilerleme çubuğu */}
          <div className="w-48 h-48 relative">
            <svg className="w-full h-full" viewBox="0 0 100 100">
              {/* Arka plan dairesi */}
              <circle
                className="text-gray-200 dark:text-gray-700 stroke-current"
                strokeWidth="8"
                fill="transparent"
                r="45"
                cx="50"
                cy="50"
              />
              {/* İlerleme dairesi */}
              <circle
                className={`${
                  isResting
                    ? 'text-green-500 dark:text-green-400'
                    : 'text-blue-500 dark:text-blue-400'
                } stroke-current`}
                strokeWidth="8"
                strokeLinecap="round"
                fill="transparent"
                r="45"
                cx="50"
                cy="50"
                style={{
                  strokeDasharray: `${2 * Math.PI * 45}`,
                  strokeDashoffset: `${
                    2 * Math.PI * 45 * (1 - calculateProgress() / 100)
                  }`,
                  transform: 'rotate(-90deg)',
                  transformOrigin: '50% 50%',
                  transition: 'stroke-dashoffset 0.3s ease'
                }}
              />
            </svg>
            {/* Zaman göstergesi */}
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-4xl font-bold font-mono text-gray-900 dark:text-white">
                {formatTime(time)}
              </span>
            </div>
          </div>

          {/* Kontrol butonları */}
          <div className="flex space-x-4 mt-4">
            <button
              onClick={isPaused ? onResume : onPause}
              className={`px-6 py-2 rounded-lg text-white font-medium transition-colors ${
                isPaused
                  ? 'bg-green-500 hover:bg-green-600'
                  : 'bg-yellow-500 hover:bg-yellow-600'
              }`}
            >
              {isPaused ? 'Devam Et' : 'Duraklat'}
            </button>
            <button
              onClick={onSkip}
              className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors font-medium"
            >
              Atla
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Timer; 