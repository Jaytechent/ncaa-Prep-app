import React, { useState, useEffect, useCallback } from 'react';
import { Trade, QuizMode, Question, QuizSession, UserStats, View } from './types';
import { INITIAL_QUESTIONS, TRADE_INFO } from './constants';
import { Layout } from './components/Layout';
import { AdminView } from './components/AdminView';
import { apiService } from './services/apiService';
import { LandingView, OfflineBadge } from './components/views/LandingView';

interface AuthViewProps {
  authMode: 'LOGIN' | 'REGISTER';
  setAuthMode: (m: 'LOGIN' | 'REGISTER') => void;
  authData: { name: string; email: string; password: string };
  setAuthData: React.Dispatch<React.SetStateAction<{ name: string; email: string; password: string }>>;
  authError: string;
  onSubmit: (e: React.FormEvent) => void;
}

const AuthView: React.FC<AuthViewProps> = ({
  authMode, setAuthMode, authData, setAuthData, authError, onSubmit,
}) => (
  <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent" />
    <div className="w-full max-w-md bg-slate-900/90 backdrop-blur-xl p-10 rounded-[2rem] shadow-2xl border border-slate-800 relative z-10">
      <div className="w-16 h-1 bg-blue-600 rounded-full mb-8 mx-auto" />
      <h2 className="text-3xl font-black text-white mb-2 text-center uppercase tracking-tight">
        {authMode === 'LOGIN' ? 'Identity Check' : 'Recruit Enrollment'}
      </h2>
      <p className="text-slate-500 mb-8 text-center font-medium">
        Clearance required for professional modules.
      </p>
      {authError && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-500 p-4 rounded-xl text-xs font-bold mb-6 text-center">
          {authError}
        </div>
      )}
      <form onSubmit={onSubmit} className="space-y-5">
        {authMode === 'REGISTER' && (
          <div>
            <label className="block text-xs font-black text-slate-400 mb-2 uppercase tracking-widest">
              Full Name
            </label>
            <input
              type="text"
              required
              value={authData.name}
              onChange={e => setAuthData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full bg-slate-800/50 p-4 rounded-xl border border-slate-700 text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              placeholder="Captain Maverick"
            />
          </div>
        )}
        <div>
          <label className="block text-xs font-black text-slate-400 mb-2 uppercase tracking-widest">
            Aviation ID (Email)
          </label>
          <input
            type="email"
            required
            value={authData.email}
            onChange={e => setAuthData(prev => ({ ...prev, email: e.target.value }))}
            placeholder="name@airline.com"
            className="w-full bg-slate-800/50 p-4 rounded-xl border border-slate-700 text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
          />
        </div>
        <div>
          <label className="block text-xs font-black text-slate-400 mb-2 uppercase tracking-widest">
            Security Pass
          </label>
          <input
            type="password"
            required
            value={authData.password}
            onChange={e => setAuthData(prev => ({ ...prev, password: e.target.value }))}
            placeholder="••••••••"
            className="w-full bg-slate-800/50 p-4 rounded-xl border border-slate-700 text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
          />
        </div>
        <button
          type="submit"
          className="w-full py-5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-black uppercase tracking-widest transition-all mt-4 shadow-lg shadow-blue-600/20"
        >
          {authMode === 'LOGIN' ? 'Authorize Access' : 'Initialize Asset'}
        </button>
      </form>
      <button
        onClick={() => setAuthMode(authMode === 'LOGIN' ? 'REGISTER' : 'LOGIN')}
        className="w-full text-center mt-6 text-xs text-slate-500 hover:text-white transition-colors"
      >
        {authMode === 'LOGIN'
          ? 'Need a clearance? Start Enrollment'
          : 'Already registered? Login to Cockpit'}
      </button>
    </div>
  </div>
);

// ─── DASHBOARD ──────────────────────────────────────────────────────────────
interface DashboardViewProps {
  user: any;
  stats: UserStats;
  isOnline: boolean;
  questions: Question[];
  onScramble: () => void;
}
const DashboardView: React.FC<DashboardViewProps> = ({
  user, stats, isOnline, questions, onScramble,
}) => (
  <div className="space-y-8 pb-12">
    <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500' : 'bg-orange-500'}`} />
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
            Status: {isOnline ? 'Operational' : 'Standalone'}
          </span>
        </div>
        <h2 className="text-4xl font-black text-slate-900 leading-none uppercase">
          Commander {user?.name?.split(' ')[1] || user?.name || 'Asset'}
        </h2>
        <p className="text-slate-500 mt-2 font-medium">Readiness: {stats.averageScore}%</p>
      </div>
      <div className="bg-white p-2 rounded-xl border flex gap-4">
        <div className="px-4 py-2 bg-blue-50 rounded-lg text-center">
          <p className="text-[10px] font-black text-blue-400 uppercase">Flight Hours</p>
          <p className="text-xl font-bold text-blue-900">{stats.totalQuizzes * 2}</p>
        </div>
        <div className="px-4 py-2 bg-yellow-50 rounded-lg text-center">
          <p className="text-[10px] font-black text-yellow-600 uppercase">Cert Level</p>
          <p className="text-xl font-bold text-yellow-900">
            {stats.averageScore > 80 ? 'PRO-I' : 'CADET'}
          </p>
        </div>
      </div>
    </header>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
        <p className="text-xs font-black text-slate-400 uppercase tracking-wider mb-3">Avg. Score</p>
        <div className="flex items-end gap-2">
          <span className="text-5xl font-black text-slate-900 tracking-tighter">{stats.averageScore}%</span>
          {stats.averageScore > 0 && <span className="text-green-500 font-black text-sm mb-1.5">↑</span>}
        </div>
      </div>
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
        <p className="text-xs font-black text-slate-400 uppercase tracking-wider mb-3">Data Samples</p>
        <div className="flex items-end gap-2">
          <span className="text-5xl font-black text-slate-900 tracking-tighter">{questions.length}</span>
          <span className="text-slate-400 font-bold text-xs mb-1.5">Live DB</span>
        </div>
      </div>
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
        <p className="text-xs font-black text-slate-400 uppercase tracking-wider mb-3">Missions</p>
        <div className="flex items-end gap-2">
          <span className="text-5xl font-black text-slate-900 tracking-tighter">{stats.totalQuizzes}</span>
          <span className="text-blue-500 font-black text-xs mb-1.5">LOGGED</span>
        </div>
      </div>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <section>
        <h3 className="font-black text-xl uppercase mb-6">Recent Sorties</h3>
        <div className="space-y-4">
          {stats.history.length > 0 ? (
            stats.history.slice(0, 3).map((h, i) => (
              <div key={i} className="flex items-center justify-between p-6 bg-white rounded-2xl border border-slate-100">
                <div className="flex items-center gap-4">
                  <div
                    className={`w-12 h-12 ${h.score / h.total >= 0.7 ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'} rounded-xl flex items-center justify-center font-black text-lg`}
                  >
                    {h.score}/{h.total}
                  </div>
                  <div>
                    <p className="font-black text-slate-900 text-sm uppercase">{h.trade}</p>
                    <p className="text-xs text-slate-400">{new Date(h.date).toLocaleDateString()}</p>
                  </div>
                </div>
                <span className={`text-xs font-black px-3 py-1 rounded-full ${h.score / h.total >= 0.7 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {Math.round((h.score / h.total) * 100)}%
                </span>
              </div>
            ))
          ) : (
            <div className="p-8 bg-white rounded-2xl border border-slate-100 text-center text-slate-400">
              <p className="text-3xl mb-2">🎯</p>
              <p className="font-bold text-sm">No missions logged yet.</p>
              <p className="text-xs mt-1">Complete a quiz to see your history.</p>
            </div>
          )}
        </div>
      </section>
      <section className="bg-slate-950 rounded-3xl p-8 text-white flex flex-col justify-between">
        <div>
          <h3 className="font-black text-3xl mb-3 leading-tight uppercase">Emergency Briefing</h3>
          <p className="text-slate-400 mb-8 max-w-sm font-medium leading-relaxed">
            Simulated blitz assessment. Random trade, maximum difficulty.
          </p>
        </div>
        <button
          onClick={onScramble}
          className="px-10 py-4 bg-white text-slate-950 font-black rounded-xl uppercase hover:bg-yellow-400 transition-all"
        >
          Scramble Now
        </button>
      </section>
    </div>
  </div>
);

// ─── QUIZ ────────────────────────────────────────────────────────────────────
interface QuizViewProps {
  session: QuizSession;
  onAnswer: (questionId: string, answerId: string) => void;
  onNext: () => void;
  onAbort: () => void;
}
const QuizView: React.FC<QuizViewProps> = ({ session, onAnswer, onNext, onAbort }) => {
  const q = session.questions[session.currentQuestionIndex];
  const progress = ((session.currentQuestionIndex + 1) / session.questions.length) * 100;
  const isAnswered = !!session.userAnswers[q.id];
  const userChoice = session.userAnswers[q.id];

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-32">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onAbort}
            className="px-4 py-2 bg-slate-100 rounded-xl text-[10px] font-black text-slate-900 uppercase hover:bg-slate-200 transition-all"
          >
            ✕ Abort
          </button>
          <span className="text-[10px] font-black text-slate-400 uppercase">
            Sector: <span className="text-blue-600">{session.trade}</span>
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-xs font-black text-slate-400">
            {session.currentQuestionIndex + 1} / {session.questions.length}
          </span>
          {session.mode === QuizMode.TIMED && (
            <div className={`text-xl font-black tabular-nums ${session.timeRemaining < 60 ? 'text-red-600' : 'text-slate-700'}`}>
              {Math.floor(session.timeRemaining / 60)}:
              {(session.timeRemaining % 60).toString().padStart(2, '0')}
            </div>
          )}
        </div>
      </div>

      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-blue-600 transition-all duration-700"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="bg-white p-8 md:p-12 rounded-[2rem] shadow-xl border border-slate-100">
        <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-10">{q.text}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {q.options.map(opt => {
            const isCorrect = opt.id === q.correctAnswer;
            const isSelected = userChoice === opt.id;
            let styles = 'border-slate-100 bg-white hover:border-blue-300';
            if (isAnswered) {
              if (isCorrect) styles = 'border-green-500 bg-green-50';
              else if (isSelected) styles = 'border-red-500 bg-red-50';
              else styles = 'opacity-40 border-slate-100 bg-white';
            } else if (isSelected) {
              styles = 'border-blue-600 bg-blue-50';
            }
            return (
              <button
                key={opt.id}
                disabled={isAnswered}
                onClick={() => onAnswer(q.id, opt.id)}
                className={`w-full p-6 rounded-2xl border-2 text-left transition-all flex items-center gap-5 ${styles}`}
              >
                <div
                  className={`w-10 h-10 rounded-xl border-2 flex items-center justify-center font-black text-sm flex-shrink-0 ${isSelected ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-200 text-slate-400'}`}
                >
                  {opt.id}
                </div>
                <span className="font-bold text-slate-700 leading-tight flex-1">{opt.text}</span>
              </button>
            );
          })}
        </div>
        {isAnswered && (
          <div
            className={`mt-10 p-6 rounded-2xl border-2 ${userChoice === q.correctAnswer ? 'bg-green-50 border-green-100 text-green-800' : 'bg-red-50 border-red-100 text-red-800'}`}
          >
            <p className="font-black uppercase text-xs mb-2">
              {userChoice === q.correctAnswer ? '✓ Verified' : '✗ Error Detected'}
            </p>
            <p className="text-sm font-medium leading-relaxed">{q.explanation}</p>
          </div>
        )}
      </div>

      <div className="flex justify-end">
        <button
          onClick={onNext}
          disabled={!isAnswered}
          className={`px-10 py-4 bg-slate-950 text-white rounded-xl font-black uppercase tracking-widest transition-all ${!isAnswered ? 'opacity-30 cursor-not-allowed' : 'hover:bg-blue-600'}`}
        >
          {session.currentQuestionIndex < session.questions.length - 1 ? 'Next Phase →' : 'Finalize Mission'}
        </button>
      </div>
    </div>
  );
};

// ─── TRADE SELECT ────────────────────────────────────────────────────────────
interface TradeSelectViewProps {
  questions: Question[];
  currentTrade: Trade | null;
  setCurrentTrade: (t: Trade) => void;
  onStart: (trade: Trade, mode: QuizMode) => void;
  isLoggedIn: boolean;
  onRequireLogin: () => void;
}
const TradeSelectView: React.FC<TradeSelectViewProps> = ({
  questions, currentTrade, setCurrentTrade, onStart, isLoggedIn, onRequireLogin,
}) => (
  <div className="space-y-10 pb-40">
    <header className="border border-black/20 bg-white p-8">
      <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">Course Operations Board</p>
      <h2 className="mt-3 text-4xl font-black uppercase tracking-tight text-slate-900">Training Sectors</h2>
      <p className="mt-3 text-sm font-medium text-slate-600">
        Browse aviation course sectors by certification route. Authentication is required to launch assessments.
      </p>
    </header>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {TRADE_INFO.map(info => {
        const count = questions.filter(q => q.trade === info.trade).length;
        return (
          <div
            key={info.trade}
            onClick={() => setCurrentTrade(info.trade)}
            className={`cursor-pointer border-2 p-8 transition-all ${
              currentTrade === info.trade
                ? 'border-black bg-slate-100 shadow-[8px_8px_0_0_rgba(15,23,42,0.2)]'
                : 'border-slate-200 bg-white hover:border-black'
            }`}
          >
            <div className={`mb-6 flex h-14 w-14 items-center justify-center border border-black/20 text-3xl ${info.color}`}>
              {info.icon}
            </div>
            <h3 className="font-black text-xl uppercase text-slate-900">{info.trade}</h3>
            <p className={`text-xs font-bold mt-2 uppercase tracking-wider ${count > 0 ? 'text-slate-500' : 'text-red-500'}`}>
              {count > 0 ? `${count} Flight Brief Questions Loaded` : 'No Flight Brief Questions Loaded'}
            </p>
          </div>
        );
      })}
    </div>
    {currentTrade && (
      <div className="fixed inset-x-0 bottom-0 z-50 border-t-2 border-black bg-white/95 p-6 backdrop-blur-xl">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-black uppercase tracking-tight">{currentTrade}</h3>
            <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
              {questions.filter(q => q.trade === currentTrade).length} mission questions available
            </p>
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => (isLoggedIn ? onStart(currentTrade, QuizMode.PRACTICE) : onRequireLogin())}
              className={`px-8 py-4 font-black uppercase transition-all border ${
                isLoggedIn
                  ? 'border-black bg-white hover:bg-black hover:text-white'
                  : 'border-slate-300 bg-slate-200 text-slate-500 hover:bg-slate-300'
              }`}
            >
              {isLoggedIn ? 'Practice Sortie' : 'Authenticate to Fly'}
            </button>
            <button
              onClick={() => (isLoggedIn ? onStart(currentTrade, QuizMode.TIMED) : onRequireLogin())}
              className={`px-8 py-4 font-black uppercase transition-all border ${
                isLoggedIn
                  ? 'border-black bg-black text-white hover:bg-white hover:text-black'
                  : 'border-blue-300 bg-blue-200 text-blue-900 hover:bg-blue-300'
              }`}
            >
              {isLoggedIn ? 'Timed Checkride ⏱' : 'Authenticate to Launch ⏱'}
            </button>
          </div>
        </div>
        {!isLoggedIn && (
          <p className="max-w-4xl mx-auto mt-3 text-xs font-bold uppercase tracking-wide text-amber-700">
            Guest mode allows sector visibility only. Sign in to begin practice sorties or timed checkrides.
          </p>
        )}
      </div>
    )}
  </div>
);

// ─── RESULTS ─────────────────────────────────────────────────────────────────
interface ResultsViewProps {
  session: QuizSession | null;
  onHome: () => void;
  onReview: () => void;
  onRetry: () => void;
}
const ResultsView: React.FC<ResultsViewProps> = ({ session, onHome, onReview, onRetry }) => {
  if (!session) return null;
  const score = session.questions.reduce(
    (acc, q) => acc + (session.userAnswers[q.id] === q.correctAnswer ? 1 : 0),
    0
  );
  const pct = Math.round((score / session.questions.length) * 100);
  const passed = pct >= 70;

  return (
    <div className="max-w-xl mx-auto py-20 text-center space-y-8">
      <div className="bg-white p-12 rounded-[2rem] border shadow-xl">
        <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 text-5xl ${passed ? 'bg-green-100' : 'bg-red-100'}`}>
          {passed ? '🏆' : '📋'}
        </div>
        <h2 className="text-4xl font-black uppercase mb-2">{passed ? 'Mission Success' : 'Debrief Required'}</h2>
        <p className="text-slate-400 mb-6">{session.trade}</p>

        <div className="flex items-center justify-center gap-8 mb-8">
          <div>
            <p className="text-5xl font-black text-slate-900">{score}/{session.questions.length}</p>
            <p className="text-xs font-black text-slate-400 uppercase mt-1">Correct</p>
          </div>
          <div className={`text-5xl font-black ${passed ? 'text-green-600' : 'text-red-600'}`}>
            {pct}%
          </div>
        </div>

        <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden mb-8">
          <div
            className={`h-full rounded-full transition-all ${passed ? 'bg-green-500' : 'bg-red-500'}`}
            style={{ width: `${pct}%` }}
          />
        </div>

        <div className="flex gap-3">
          <button
            onClick={onHome}
            className="flex-1 px-6 py-4 bg-slate-100 hover:bg-slate-200 rounded-xl font-black uppercase transition-all"
          >
            Home
          </button>
          <button
            onClick={onReview}
            className="flex-1 px-6 py-4 bg-slate-950 hover:bg-blue-600 text-white rounded-xl font-black uppercase shadow-lg transition-all"
          >
            Review
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── REVIEW ──────────────────────────────────────────────────────────────────
interface ReviewViewProps {
  session: QuizSession | null;
  onClose: () => void;
}
const ReviewView: React.FC<ReviewViewProps> = ({ session, onClose }) => (
  <div className="space-y-10 pb-32 max-w-4xl mx-auto">
    <header className="flex justify-between items-center">
      <h2 className="text-3xl font-black uppercase">Post-Flight Analysis</h2>
      <button
        onClick={onClose}
        className="px-6 py-3 bg-slate-900 hover:bg-blue-600 text-white rounded-xl font-black text-xs uppercase transition-all"
      >
        Close
      </button>
    </header>
    <div className="space-y-6">
      {session?.questions.map((q, idx) => {
        const userAns = session.userAnswers[q.id];
        const isCorrect = userAns === q.correctAnswer;
        return (
          <div
            key={q.id}
            className={`p-8 rounded-[2rem] border-2 bg-white ${isCorrect ? 'border-green-100' : 'border-red-100'}`}
          >
            <div className="flex items-start gap-4 mb-6">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center font-black flex-shrink-0 ${isCorrect ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}
              >
                {idx + 1}
              </div>
              <h4 className="text-xl font-bold pt-1 leading-snug">{q.text}</h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
              {q.options.map(opt => (
                <div
                  key={opt.id}
                  className={`p-4 rounded-xl border text-sm font-bold flex items-center gap-3 ${opt.id === q.correctAnswer ? 'bg-green-50 border-green-200 text-green-900' : opt.id === userAns ? 'bg-red-50 border-red-200 text-red-900' : 'bg-slate-50 border-transparent text-slate-400 opacity-60'}`}
                >
                  <span className="w-6 h-6 rounded flex items-center justify-center border border-current flex-shrink-0">
                    {opt.id}
                  </span>
                  {opt.text}
                </div>
              ))}
            </div>
            <div className="p-6 rounded-2xl bg-slate-900 text-white text-sm font-medium leading-relaxed">
              <p className="text-[10px] font-black text-slate-400 uppercase mb-2">Explanation</p>
              {q.explanation}
            </div>
          </div>
        );
      })}
    </div>
  </div>
);

// ─── PROFILE ─────────────────────────────────────────────────────────────────
interface ProfileViewProps {
  user: any;
  stats: UserStats;
}
const ProfileView: React.FC<ProfileViewProps> = ({ user, stats }) => (
  <div className="max-w-2xl mx-auto py-10 text-center space-y-8">
    <div className="w-28 h-28 rounded-full border-4 border-blue-600 mx-auto flex items-center justify-center text-5xl bg-blue-50 font-black text-blue-400">
      {user?.name?.[0]?.toUpperCase() || 'A'}
    </div>
    <div>
      <h2 className="text-3xl font-black uppercase text-slate-900">{user?.name || 'Asset'}</h2>
      <p className="text-slate-400 text-sm mt-1">{user?.email}</p>
      <span className={`inline-block mt-2 text-xs font-black px-3 py-1 rounded-full uppercase ${user?.role === 'admin' ? 'bg-yellow-100 text-yellow-700' : 'bg-blue-100 text-blue-700'}`}>
        {user?.role || 'user'}
      </span>
    </div>
    <div className="grid grid-cols-2 gap-4">
      <div className="bg-white p-6 rounded-2xl border shadow-sm">
        <p className="text-[10px] font-black text-blue-400 uppercase">Avg Score</p>
        <p className="text-3xl font-black mt-1">{stats.averageScore}%</p>
      </div>
      <div className="bg-white p-6 rounded-2xl border shadow-sm">
        <p className="text-[10px] font-black text-indigo-400 uppercase">Missions</p>
        <p className="text-3xl font-black mt-1">{stats.totalQuizzes}</p>
      </div>
      <div className="bg-white p-6 rounded-2xl border shadow-sm">
        <p className="text-[10px] font-black text-green-400 uppercase">Flight Hours</p>
        <p className="text-3xl font-black mt-1">{stats.totalQuizzes * 2}</p>
      </div>
      <div className="bg-white p-6 rounded-2xl border shadow-sm">
        <p className="text-[10px] font-black text-yellow-500 uppercase">Cert Level</p>
        <p className="text-xl font-black mt-1 text-yellow-600">
          {stats.averageScore > 80 ? 'PRO-I' : stats.averageScore > 60 ? 'INTER' : 'CADET'}
        </p>
      </div>
    </div>
    <button
      onClick={() => { apiService.clearAuth(); window.location.reload(); }}
      className="px-10 py-4 bg-red-600 hover:bg-red-700 text-white rounded-xl font-black uppercase text-xs transition-all"
    >
      Revoke Authorization
    </button>
  </div>
);

// ─── FLEET SPECS ─────────────────────────────────────────────────────────────
const FleetSpecsView: React.FC<{ onBack: () => void }> = ({ onBack }) => (
  <div className="space-y-10 pb-12">
    <header className="flex items-center justify-between">
      <h2 className="text-4xl font-black uppercase">Fleet Intelligence</h2>
      <button onClick={onBack} className="text-blue-600 font-black uppercase text-sm hover:text-blue-700">
        ← Back
      </button>
    </header>
    <p className="text-slate-400">Aviation trade specifications and NCAA certification requirements.</p>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {TRADE_INFO.map(info => (
        <div key={info.trade} className="bg-white p-8 rounded-[2rem] border shadow-sm">
          <div className={`w-14 h-14 ${info.color} rounded-xl flex items-center justify-center text-3xl mb-4 shadow-md`}>
            {info.icon}
          </div>
          <h3 className="font-black text-lg uppercase text-slate-900">{info.trade}</h3>
          <p className="text-xs text-slate-400 mt-2">NCAA Certification Required</p>
        </div>
      ))}
    </div>
  </div>
);

// ─── APP ──────────────────────────────────────────────────────────────────────
const App: React.FC = () => {
  const [view, setView] = useState<View>('LANDING');
  const [questions, setQuestions] = useState<Question[]>(INITIAL_QUESTIONS);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [user, setUser] = useState<any>(null);
  const [currentTrade, setCurrentTrade] = useState<Trade | null>(null);
  const [session, setSession] = useState<QuizSession | null>(null);
  const [stats, setStats] = useState<UserStats>({
    totalQuizzes: 0,
    averageScore: 0,
    bestTrade: null,
    history: [],
  });

  // Auth form state
  const [authMode, setAuthMode] = useState<'LOGIN' | 'REGISTER'>('LOGIN');
  const [authData, setAuthData] = useState({ name: '', email: '', password: '' });
  const [authError, setAuthError] = useState('');

  // Init
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    const saved = localStorage.getItem('ncaa_user_data');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setUser(parsed);
        if (parsed.stats) setStats(parsed.stats);
      } catch { /* ignore */ }
    }

    apiService.fetchQuestions().then(data => {
      if (data.length > 0) setQuestions(data);
    }).catch(() => {});

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Start quiz
  const startQuiz = useCallback((trade: Trade, mode: QuizMode) => {
    if (!user) {
      alert('Login required: you can view course sectors as a guest, but assessment access requires authentication.');
      setView('AUTH');
      return;
    }

    const tradeQs = questions.filter(q => q.trade === trade);
    if (tradeQs.length === 0) {
      alert('No questions found for this trade yet. Ask your admin to add questions.');
      return;
    }
    const shuffled = [...tradeQs].sort(() => Math.random() - 0.5).slice(0, 10);
    setSession({
      trade,
      mode,
      questions: shuffled,
      currentQuestionIndex: 0,
      userAnswers: {},
      startTime: Date.now(),
      timeRemaining: mode === QuizMode.TIMED ? 600 : 0,
    });
    setView('QUIZ');
  }, [questions, user]);

  const handleAnswer = useCallback((questionId: string, answerId: string) => {
    setSession(prev => {
      if (!prev || prev.userAnswers[questionId]) return prev;
      return { ...prev, userAnswers: { ...prev.userAnswers, [questionId]: answerId } };
    });
  }, []);

  const finishQuiz = useCallback(() => {
    setSession(prev => {
      if (!prev) return null;
      const score = prev.questions.reduce(
        (acc, q) => acc + (prev.userAnswers[q.id] === q.correctAnswer ? 1 : 0),
        0
      );
      if (user) {
        apiService.updateStats({ trade: prev.trade, score, total: prev.questions.length })
          .then(updatedStats => {
            if (updatedStats) {
              setStats(updatedStats);
              const updatedUser = { ...user, stats: updatedStats };
              setUser(updatedUser);
              localStorage.setItem('ncaa_user_data', JSON.stringify(updatedUser));
            }
          });
      }
      return { ...prev, endTime: Date.now() };
    });
    setView('RESULTS');
  }, [user]);

  const handleNext = useCallback(() => {
    setSession(prev => {
      if (!prev) return null;
      if (prev.currentQuestionIndex < prev.questions.length - 1) {
        return { ...prev, currentQuestionIndex: prev.currentQuestionIndex + 1 };
      }
      return prev;
    });
    // Check if we just answered the last question
    setSession(prev => {
      if (prev && prev.currentQuestionIndex >= prev.questions.length - 1) {
        finishQuiz();
      }
      return prev;
    });
  }, [finishQuiz]);

  // Cleaner next handler
  const handleNextQuestion = useCallback(() => {
    if (!session) return;
    if (session.currentQuestionIndex < session.questions.length - 1) {
      setSession(s => s ? { ...s, currentQuestionIndex: s.currentQuestionIndex + 1 } : null);
    } else {
      finishQuiz();
    }
  }, [session, finishQuiz]);

  // Timed countdown
  useEffect(() => {
    if (!session || session.mode !== QuizMode.TIMED || session.timeRemaining <= 0 || session.endTime) return;
    const timer = setInterval(() => {
      setSession(prev => {
        if (!prev || prev.endTime) return prev;
        if (prev.timeRemaining <= 1) { clearInterval(timer); return { ...prev, timeRemaining: 0 }; }
        return { ...prev, timeRemaining: prev.timeRemaining - 1 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [session?.mode, session?.endTime, session?.timeRemaining === 0]);

  useEffect(() => {
    if (session?.mode === QuizMode.TIMED && session.timeRemaining === 0 && !session.endTime) {
      finishQuiz();
    }
  }, [session?.timeRemaining, session?.endTime, finishQuiz]);

  // Auth
  const handleAuth = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    try {
      let data;
      if (authMode === 'LOGIN') {
        data = await apiService.login({ email: authData.email, password: authData.password });
      } else {
        data = await apiService.register({ name: authData.name, email: authData.email, password: authData.password });
      }
      setUser(data);
      if (data.stats) setStats(data.stats);
      setView('DASHBOARD');
    } catch (err: any) {
      setAuthError(err.message || 'Authentication failed');
    }
  }, [authMode, authData]);

  const handleAbort = useCallback(() => {
    if (confirm('Abort mission? Progress will not be saved.')) setView('DASHBOARD');
  }, []);

  useEffect(() => {
    const protectedViews: View[] = ['DASHBOARD', 'QUIZ', 'RESULTS', 'REVIEW', 'PROFILE', 'ADMIN'];
    if (!user && protectedViews.includes(view)) {
      setView('AUTH');
    }
  }, [user, view]);


  return (
    <Layout currentView={view} setView={setView} user={user}>
      <OfflineBadge isOnline={isOnline} />

      {view === 'LANDING' && (
        <LandingView onEnter={() => setView('TRADE_SELECT')} onFleet={() => setView('FLEET_SPECS')} />
      )}

      {view === 'AUTH' && (
        <AuthView
          authMode={authMode}
          setAuthMode={setAuthMode}
          authData={authData}
          setAuthData={setAuthData}
          authError={authError}
          onSubmit={handleAuth}
        />
      )}

      {view === 'DASHBOARD' && (
        <DashboardView
          user={user}
          stats={stats}
          isOnline={isOnline}
          questions={questions}
          onScramble={() => startQuiz(Trade.SAFETY_HUMAN_FACTORS, QuizMode.TIMED)}
        />
      )}

      {view === 'TRADE_SELECT' && (
        <TradeSelectView
          questions={questions}
          currentTrade={currentTrade}
          setCurrentTrade={setCurrentTrade}
          onStart={startQuiz}
          isLoggedIn={!!user}
          onRequireLogin={() => setView('AUTH')}
        />
      )}

      {view === 'QUIZ' && session && (
        <QuizView
          session={session}
          onAnswer={handleAnswer}
          onNext={handleNextQuestion}
          onAbort={handleAbort}
        />
      )}

      {view === 'RESULTS' && (
        <ResultsView
          session={session}
          onHome={() => setView('DASHBOARD')}
          onReview={() => setView('REVIEW')}
          onRetry={() => session && startQuiz(session.trade, session.mode)}
        />
      )}

      {view === 'REVIEW' && (
        <ReviewView session={session} onClose={() => setView('DASHBOARD')} />
      )}

      {view === 'ADMIN' && user?.role === 'admin' && (
        <AdminView questions={questions} setQuestions={setQuestions} />
      )}

      {view === 'PROFILE' && <ProfileView user={user} stats={stats} />}

      {view === 'FLEET_SPECS' && <FleetSpecsView onBack={() => setView('LANDING')} />}
    </Layout>
  );
};

export default App;
