export interface LessonProgress {
  lessonId: string;
  completed: boolean;
  completedAt?: string;
}

export interface QuizProgress {
  quizId: string;
  score: number;
  totalQuestions: number;
  completedAt: string;
  answers: Record<string, string>;
}

export interface CourseProgress {
  lessonsCompleted: LessonProgress[];
  quizzesCompleted: QuizProgress[];
  lastVisited: string;
}

const STORAGE_KEY = 'rust-learning-progress';

function createEmptyProgress(): CourseProgress {
  return {
    lessonsCompleted: [],
    quizzesCompleted: [],
    lastVisited: '',
  };
}

export function getProgress(): CourseProgress {
  if (typeof window === 'undefined') {
    return createEmptyProgress();
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored) as CourseProgress;
    }
  } catch (error) {
    console.error('Failed to load progress:', error);
  }

  return createEmptyProgress();
}

export function saveProgress(progress: CourseProgress): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch (error) {
    console.error('Failed to save progress:', error);
  }
}

export function markLessonComplete(lessonId: string): void {
  const progress = getProgress();

  const existing = progress.lessonsCompleted.find(l => l.lessonId === lessonId);

  if (existing) {
    existing.completed = true;
    existing.completedAt = new Date().toISOString();
  } else {
    progress.lessonsCompleted.push({
      lessonId,
      completed: true,
      completedAt: new Date().toISOString(),
    });
  }

  progress.lastVisited = lessonId;
  saveProgress(progress);
}

export function markLessonIncomplete(lessonId: string): void {
  const progress = getProgress();
  const existing = progress.lessonsCompleted.find(l => l.lessonId === lessonId);

  if (existing) {
    existing.completed = false;
    delete existing.completedAt;
  }

  saveProgress(progress);
}

export function isLessonComplete(lessonId: string): boolean {
  const progress = getProgress();
  return progress.lessonsCompleted.some(
    l => l.lessonId === lessonId && l.completed
  );
}

export function saveQuizResult(
  quizId: string,
  score: number,
  totalQuestions: number,
  answers: Record<string, string>
): void {
  const progress = getProgress();

  const existingIndex = progress.quizzesCompleted.findIndex(q => q.quizId === quizId);

  const quizResult: QuizProgress = {
    quizId,
    score,
    totalQuestions,
    completedAt: new Date().toISOString(),
    answers,
  };

  if (existingIndex !== -1) {
    if (score > progress.quizzesCompleted[existingIndex].score) {
      progress.quizzesCompleted[existingIndex] = quizResult;
    }
  } else {
    progress.quizzesCompleted.push(quizResult);
  }

  saveProgress(progress);
}

export function getCompletionPercentage(totalLessons: number): number {
  const progress = getProgress();
  const completed = progress.lessonsCompleted.filter(l => l.completed).length;
  return totalLessons > 0 ? Math.round((completed / totalLessons) * 100) : 0;
}

export function resetProgress(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY);
}
