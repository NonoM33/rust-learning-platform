import type { Quiz } from '../../lib/types';

interface Props {
  quiz: Quiz;
  answers: Record<string, string>;
  score: number;
  onRetry: () => void;
}

export function QuizResult({ quiz, answers, score, onRetry }: Props) {
  const passed = score >= quiz.passingScore;
  const correctCount = quiz.questions.filter(q => {
    const userAnswer = answers[q.id];
    return Array.isArray(q.correctAnswer)
      ? q.correctAnswer.includes(userAnswer)
      : q.correctAnswer === userAnswer;
  }).length;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
        {/* Result Header */}
        <div className={`px-6 py-8 text-center ${passed ? 'bg-green-500' : 'bg-red-500'} text-white`}>
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-white/20 flex items-center justify-center">
            {passed ? (
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
          </div>
          <h2 className="text-2xl font-bold mb-2">
            {passed ? 'Felicitations !' : 'Pas tout a fait...'}
          </h2>
          <p className="text-white/80">
            {passed
              ? 'Tu as reussi ce quiz !'
              : `Il te faut ${quiz.passingScore}% pour valider. Reessaie !`}
          </p>
        </div>

        {/* Score */}
        <div className="px-6 py-6 text-center border-b border-gray-200 dark:border-gray-700">
          <div className="text-5xl font-bold text-gray-900 dark:text-white mb-2">
            {score}%
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            {correctCount} bonnes reponses sur {quiz.questions.length}
          </p>
        </div>

        {/* Review */}
        <div className="px-6 py-6">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Revue des reponses</h3>
          <div className="space-y-4">
            {quiz.questions.map((q, index) => {
              const userAnswer = answers[q.id];
              const isCorrect = Array.isArray(q.correctAnswer)
                ? q.correctAnswer.includes(userAnswer)
                : q.correctAnswer === userAnswer;

              return (
                <div
                  key={q.id}
                  className={`p-4 rounded-lg border-2 ${
                    isCorrect
                      ? 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20'
                      : 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-white text-sm ${isCorrect ? 'bg-green-500' : 'bg-red-500'}`}>
                      {index + 1}
                    </span>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 dark:text-white text-sm mb-2">
                        {q.question}
                      </p>
                      <p className={`text-sm ${isCorrect ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                        Ta reponse: {userAnswer || 'Aucune'}
                      </p>
                      {!isCorrect && (
                        <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                          Bonne reponse: {Array.isArray(q.correctAnswer) ? q.correctAnswer[0] : q.correctAnswer}
                        </p>
                      )}
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 italic">
                        {q.explanation}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Actions */}
        <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700 flex justify-center gap-4">
          <button
            onClick={onRetry}
            className="px-6 py-2 bg-rust-500 text-white rounded-lg hover:bg-rust-600 transition-colors font-medium"
          >
            Reessayer
          </button>
          <a
            href="/lessons"
            className="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors font-medium"
          >
            Retour aux modules
          </a>
        </div>
      </div>
    </div>
  );
}
