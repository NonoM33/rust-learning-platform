import type { QuizQuestion as QuestionType } from '../../lib/types';

interface Props {
  question: QuestionType;
  selectedAnswer?: string;
  onAnswer: (answer: string) => void;
}

export function QuizQuestion({ question, selectedAnswer, onAnswer }: Props) {
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
        {question.question}
      </h3>

      {/* Code snippet if present */}
      {question.code && (
        <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
          <pre className="font-mono text-sm text-gray-100">
            <code>{question.code}</code>
          </pre>
        </div>
      )}

      {/* Options */}
      <div className="space-y-3">
        {question.options.map((option, index) => (
          <label
            key={index}
            className={`
              flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all
              ${selectedAnswer === option
                ? 'border-rust-500 bg-rust-50 dark:bg-rust-900/20'
                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
              }
            `}
          >
            <input
              type="radio"
              name={`question-${question.id}`}
              value={option}
              checked={selectedAnswer === option}
              onChange={() => onAnswer(option)}
              className="sr-only"
            />
            <span className={`
              w-8 h-8 flex items-center justify-center rounded-full border-2 mr-4 font-medium text-sm
              ${selectedAnswer === option
                ? 'border-rust-500 bg-rust-500 text-white'
                : 'border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400'
              }
            `}>
              {String.fromCharCode(65 + index)}
            </span>
            <span className="text-gray-700 dark:text-gray-300 flex-1">{option}</span>
          </label>
        ))}
      </div>

      {/* Hint */}
      {question.hint && (
        <details className="mt-4">
          <summary className="cursor-pointer text-sm text-rust-500 hover:text-rust-600 font-medium">
            Besoin d'un indice ?
          </summary>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 pl-4 border-l-2 border-rust-500">
            {question.hint}
          </p>
        </details>
      )}
    </div>
  );
}
