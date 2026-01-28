export interface QuizQuestion {
  id: string;
  type: 'multiple-choice' | 'code-output' | 'fill-blank' | 'true-false';
  question: string;
  code?: string;
  options: string[];
  correctAnswer: string | string[];
  explanation: string;
  hint?: string;
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  moduleId: string;
  timeLimit?: number;
  passingScore: number;
  questions: QuizQuestion[];
}

export interface Module {
  id: string;
  number: number;
  title: string;
  description: string;
  lessons: Lesson[];
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  moduleId: string;
  order: number;
  duration?: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

export interface Exercise {
  id: string;
  title: string;
  description: string;
  starterCode: string;
  solution: string;
  tests?: string;
  hints: string[];
}
