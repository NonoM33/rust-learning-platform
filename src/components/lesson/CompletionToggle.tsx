import { useState, useEffect } from 'react';
import { isLessonComplete, markLessonComplete, markLessonIncomplete } from '../../lib/progress-store';

interface Props {
  lessonId: string;
}

export function CompletionToggle({ lessonId }: Props) {
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    setCompleted(isLessonComplete(lessonId));
  }, [lessonId]);

  const handleToggle = () => {
    if (completed) {
      markLessonIncomplete(lessonId);
      setCompleted(false);
    } else {
      markLessonComplete(lessonId);
      setCompleted(true);
    }
  };

  return (
    <button
      onClick={handleToggle}
      className={`
        flex items-center gap-3 px-6 py-3 rounded-xl font-medium transition-all w-full
        ${completed
          ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-2 border-green-300 dark:border-green-700'
          : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-2 border-gray-200 dark:border-gray-700 hover:border-rust-300 dark:hover:border-rust-700'
        }
      `}
    >
      <span className={`
        w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0
        ${completed
          ? 'bg-green-500 text-white'
          : 'bg-gray-300 dark:bg-gray-600'
        }
      `}>
        {completed && (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        )}
      </span>
      <span>
        {completed ? 'Lecon terminee !' : 'Marquer comme terminee'}
      </span>
    </button>
  );
}
