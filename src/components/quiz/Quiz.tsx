import { useState, useCallback, useEffect } from 'react';
import { QuizQuestion } from './QuizQuestion';
import { QuizResult } from './QuizResult';
import { saveQuizResult } from '../../lib/progress-store';
import type { Quiz as QuizType } from '../../lib/types';

interface QuizProps {
  quiz: QuizType;
}

interface QuizState {
  currentQuestion: number;
  answers: Record<string, string>;
  score: number;
  isComplete: boolean;
  timeRemaining?: number;
}

export function Quiz({ quiz }: QuizProps) {
  const [state, setState] = useState<QuizState>({
    currentQuestion: 0,
    answers: {},
    score: 0,
    isComplete: false,
    timeRemaining: quiz.timeLimit,
  });

  // Timer logic
  useEffect(() => {
    if (!quiz.timeLimit || state.isComplete) return;

    const timer = setInterval(() => {
      setState(prev => {
        if (prev.timeRemaining && prev.timeRemaining <= 1) {
          clearInterval(timer);
          return { ...prev, timeRemaining: 0, isComplete: true };
        }
        return { ...prev, timeRemaining: (prev.timeRemaining || 0) - 1 };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [quiz.timeLimit, state.isComplete]);

  const handleAnswer = useCallback((questionId: string, answer: string) => {
    setState(prev => ({
      ...prev,
      answers: { ...prev.answers, [questionId]: answer },
    }));
  }, []);

  const handleNext = useCallback(() => {
    setState(prev => ({
      ...prev,
      currentQuestion: prev.currentQuestion + 1,
    }));
  }, []);

  const handlePrevious = useCallback(() => {
    setState(prev => ({
      ...prev,
      currentQuestion: Math.max(0, prev.currentQuestion - 1),
    }));
  }, []);

  const handleSubmit = useCallback(() => {
    let correct = 0;
    quiz.questions.forEach(q => {
      const userAnswer = state.answers[q.id];
      const isCorrect = Array.isArray(q.correctAnswer)
        ? q.correctAnswer.includes(userAnswer)
        : q.correctAnswer === userAnswer;
      if (isCorrect) correct++;
    });

    const score = Math.round((correct / quiz.questions.length) * 100);

    saveQuizResult(quiz.id, score, quiz.questions.length, state.answers);

    setState(prev => ({
      ...prev,
      score,
      isComplete: true,
    }));
  }, [quiz, state.answers]);

  const handleRetry = useCallback(() => {
    setState({
      currentQuestion: 0,
      answers: {},
      score: 0,
      isComplete: false,
      timeRemaining: quiz.timeLimit,
    });
  }, [quiz.timeLimit]);

  const currentQ = quiz.questions[state.currentQuestion];
  const isLastQuestion = state.currentQuestion === quiz.questions.length - 1;
  const hasAnswered = currentQ && state.answers[currentQ.id];

  if (state.isComplete) {
    return (
      <QuizResult
        quiz={quiz}
        answers={state.answers}
        score={state.score}
        onRetry={handleRetry}
      />
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 bg-rust-500 text-white">
          <h2 className="text-xl font-bold">{quiz.title}</h2>
          <p className="text-rust-100 text-sm mt-1">{quiz.description}</p>
        </div>

        {/* Progress bar */}
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
            <span>Question {state.currentQuestion + 1} sur {quiz.questions.length}</span>
            {state.timeRemaining !== undefined && (
              <span className={state.timeRemaining < 60 ? 'text-red-500 font-medium' : ''}>
                {Math.floor(state.timeRemaining / 60)}:{String(state.timeRemaining % 60).padStart(2, '0')}
              </span>
            )}
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className="bg-rust-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((state.currentQuestion + 1) / quiz.questions.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Question */}
        <div className="p-6">
          <QuizQuestion
            question={currentQ}
            selectedAnswer={state.answers[currentQ.id]}
            onAnswer={(answer) => handleAnswer(currentQ.id, answer)}
          />
        </div>

        {/* Navigation */}
        <div className="flex justify-between px-6 py-4 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={handlePrevious}
            disabled={state.currentQuestion === 0}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors font-medium"
          >
            Precedent
          </button>

          {isLastQuestion ? (
            <button
              onClick={handleSubmit}
              disabled={!hasAnswered}
              className="px-6 py-2 bg-rust-500 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-rust-600 transition-colors font-medium"
            >
              Terminer le Quiz
            </button>
          ) : (
            <button
              onClick={handleNext}
              disabled={!hasAnswered}
              className="px-4 py-2 bg-rust-500 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-rust-600 transition-colors font-medium"
            >
              Suivant
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
