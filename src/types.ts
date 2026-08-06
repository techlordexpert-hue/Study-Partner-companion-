export type TabType = "account" | "library" | "pasco" | "focus";

export interface Slide {
  id: string;
  slideNumber: number;
  title: string;
  textContent: string; // Verbatim slide text content in text format
  briefExplanation: string; // Brief, student-friendly explanation
  youtubeTutorialUrl: string; // YouTube tutorial link/embed
  youtubeQuery: string; // Search query for YouTube
  researchTopics: string[]; // Topics for Google/Gemini API research
}

export interface LectureModule {
  id: string;
  code: string;
  title: string;
  subtitle: string;
  description: string;
  iconName: string;
  slides: Slide[];
}

export interface PastQuestion {
  id: string;
  year: string;
  courseCode: string;
  courseTitle: string;
  section: "Section A (MCQ)" | "Section B (Short/Diagram)" | "Section C (Problem/Project)";
  questionNumber: number | string;
  questionText: string;
  options?: string[]; // For MCQs
  correctAnswer?: string; // For MCQs or short answer reference
  explanation: string;
  topic: "DBMS Fundamentals" | "ERD & Relational Model" | "Foreign Key & Relationships" | "Normalization & FDs" | "SQL & DDL/DML" | "Data Abstraction";
  tableContext?: {
    headers: string[];
    rows: string[][];
  };
  sampleSolutionMarkdown?: string; // For mini-projects / SQL DDL / Normalization step-by-step
}

export interface QuizAttempt {
  id: string;
  questionId: string;
  userAnswer: string;
  isCorrect: boolean;
  timestamp: string;
}

export interface QuizSessionStats {
  totalAttempted: number;
  correctCount: number;
  scorePercentage: number;
  timeSpentSeconds: number;
  topicBreakdown: Record<string, { total: number; correct: number }>;
}

export interface FocusSession {
  id: string;
  date: string;
  durationMinutes: number;
  mode: "stopwatch" | "pomodoro";
  moduleRef?: string;
  notes?: string;
}

export interface CustomUploadedSlide {
  id: string;
  title: string;
  uploadedAt: string;
  slides: Slide[];
}

export interface CustomUploadedPasco {
  id: string;
  title: string;
  uploadedAt: string;
  questions: PastQuestion[];
}

export interface UserProfile {
  name: string;
  indexNumber: string;
  institution: string;
  program: string;
  targetGrade: string;
  avatarSeed: string;
  completedSlideIds: string[];
  focusTimeMinutesTotal: number;
  soundEnabled: boolean;
  voiceAlertEnabled: boolean;
  customSlides: CustomUploadedSlide[];
  customPascos: CustomUploadedPasco[];
  savedNotes: Record<string, string>;
  quizHistory: QuizAttempt[];
}
