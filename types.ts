export interface User {
  name: string;
  email: string;
  avatar?: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

export interface EssayCorrection {
  overallScore: number;
  competency1: { score: number; feedback: string };
  competency2: { score: number; feedback: string };
  competency3: { score: number; feedback: string };
  competency4: { score: number; feedback: string };
  competency5: { score: number; feedback: string };
  generalFeedback: string;
  suggestions: string;
}

export interface QuizResult {
    subject: string;
    topic: string;
    score: number;
    totalQuestions: number;
    date: string;
}

export interface VideoClass {
    videoId: string;
    title: string;
    description: string;
}