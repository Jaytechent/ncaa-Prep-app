
export enum Trade {
  B1_ENGINEER = 'B1 Aircraft Maintenance Engineer',
  B2_ENGINEER = 'B2 Aircraft Maintenance Engineer',
  HELICOPTER_PILOT = 'Helicopter Pilot',
  FIXED_WING_PILOT = 'Fixed Wing Pilot',
  FLIGHT_DISPATCHER = 'Flight Dispatcher',
  CABIN_CREW = 'Cabin Crew',
  ATC = 'Air Traffic Controller',
  AVIONICS = 'Avionics Technician',
  GROUND_OPS = 'Ground Operations',
  SAFETY_HUMAN_FACTORS = 'Safety & Human Factors'
}

export enum QuizMode {
  PRACTICE = 'Practice Mode',
  TIMED = 'Timed Exam Mode'
}

export interface Question {
  id: string;
  trade: Trade;
  text: string;
  options: {
    id: string;
    text: string;
  }[];
  correctAnswer: string; // The id of the option
  explanation: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

export interface QuizSession {
  trade: Trade;
  mode: QuizMode;
  questions: Question[];
  currentQuestionIndex: number;
  userAnswers: Record<string, string>;
  startTime: number;
  endTime?: number;
  timeRemaining: number;
}

export interface UserStats {
  totalQuizzes: number;
  averageScore: number;
  bestTrade: Trade | null;
  history: {
    date: string;
    trade: Trade;
    score: number;
    total: number;
  }[];
}

export type View = 'LANDING' | 'AUTH' | 'DASHBOARD' | 'TRADE_SELECT' | 'QUIZ' | 'RESULTS' | 'REVIEW' | 'PROFILE' | 'ADMIN';
