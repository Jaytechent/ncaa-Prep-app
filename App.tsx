import React, { useState, useEffect, useCallback } from 'react';
import { Trade, QuizMode, Question, QuizSession, UserStats, View } from './types';
import { INITIAL_QUESTIONS, TRADE_INFO } from './constants';
import { Layout } from './components/Layout';
import { AdminView } from './components/AdminView';
import { apiService } from './services/apiService';
import { LandingView, OfflineBadge } from './components/views/LandingView';

// ─── SHARED STYLE TOKENS ─────────────────────────────────────────────────────
const ACCENT = '#0057FF';
const ACCENT_LIGHT = '#EEF3FF';
const MONO = "'Space Mono', 'Courier New', monospace";

// ─── AUTH VIEW ───────────────────────────────────────────────────────────────
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
  <div className="min-h-screen bg-white flex items-center justify-center p-4" style={{ fontFamily: MONO }}>
    {/* Background dot grid */}
    <div
      className="fixed inset-0 pointer-events-none opacity-[0.04]"
      style={{
        backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)',
        backgroundSize: '28px 28px',
      }}
    />

    <div className="w-full max-w-md relative z-10">
      {/* Header bar */}
      <div className="border-2 border-black border-b-0 px-8 pt-6 pb-4 bg-black">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-2 h-2 bg-[#0057FF]" />
          <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.25em]">
            {authMode === 'LOGIN' ? 'Identity Check' : 'Recruit Enrollment'}
          </span>
        </div>
        <h2 className="text-2xl font-black text-white uppercase tracking-tight">
          {authMode === 'LOGIN' ? 'Authorize Access' : 'Initialize Asset'}
        </h2>
        <p className="text-xs text-gray-500 mt-1">Clearance required for professional modules.</p>
      </div>

      {/* Form body */}
      <div className="border-2 border-black border-t-0 bg-white p-8">
        {authError && (
          <div className="border-2 border-black bg-black text-white p-4 text-xs font-bold mb-6 flex items-center gap-3">
            <span className="w-2 h-2 bg-[#0057FF] flex-shrink-0" />
            {authError}
          </div>
        )}

        <form onSubmit={onSubmit} className="flex flex-col gap-0">
          {authMode === 'REGISTER' && (
            <div className="flex flex-col">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-4 pt-3 pb-1 border-2 border-black border-b-0 bg-gray-50">
                Full Name
              </label>
              <input
                type="text"
                required
                value={authData.name}
                onChange={e => setAuthData(prev => ({ ...prev, name: e.target.value }))}
                className="border-2 border-black border-b-0 px-4 py-3 text-sm bg-white focus:outline-none focus:bg-[#EEF3FF] transition-colors"
                style={{ fontFamily: MONO }}
                placeholder="Captain Maverick"
              />
            </div>
          )}

          <div className="flex flex-col">
            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-4 pt-3 pb-1 border-2 border-black border-b-0 bg-gray-50">
              Aviation ID (Email)
            </label>
            <input
              type="email"
              required
              value={authData.email}
              onChange={e => setAuthData(prev => ({ ...prev, email: e.target.value }))}
              placeholder="name@airline.com"
              className="border-2 border-black border-b-0 px-4 py-3 text-sm bg-white focus:outline-none focus:bg-[#EEF3FF] transition-colors"
              style={{ fontFamily: MONO }}
            />
          </div>

          <div className="flex flex-col">
            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-4 pt-3 pb-1 border-2 border-black border-b-0 bg-gray-50">
              Security Pass
            </label>
            <input
              type="password"
              required
              value={authData.password}
              onChange={e => setAuthData(prev => ({ ...prev, password: e.target.value }))}
              placeholder="••••••••"
              className="border-2 border-black px-4 py-3 text-sm bg-white focus:outline-none focus:bg-[#EEF3FF] transition-colors"
              style={{ fontFamily: MONO }}
            />
          </div>

          <button
            type="submit"
            className="py-4 bg-[#0057FF] text-white font-black text-xs uppercase tracking-widest border-2 border-[#0057FF] hover:bg-black hover:border-black transition-colors mt-4"
            style={{ fontFamily: MONO }}
          >
            {authMode === 'LOGIN' ? 'Authorize Access →' : 'Initialize Asset →'}
          </button>
        </form>

        <button
          onClick={() => setAuthMode(authMode === 'LOGIN' ? 'REGISTER' : 'LOGIN')}
          className="w-full text-center mt-4 pt-4 border-t border-black text-[10px] font-bold text-gray-400 hover:text-black transition-colors uppercase tracking-widest"
          style={{ fontFamily: MONO }}
        >
          {authMode === 'LOGIN'
            ? 'Need a clearance? Start Enrollment →'
            : 'Already registered? Login to Cockpit →'}
        </button>
      </div>
    </div>
  </div>
);

// ─── DASHBOARD VIEW ───────────────────────────────────────────────────────────
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
  <div className="space-y-0 pb-12" style={{ fontFamily: MONO }}>
    {/* Header */}
    <header className="border-b-2 border-black pb-6 mb-0">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className={`w-2 h-2 ${isOnline ? 'bg-[#0057FF]' : 'bg-orange-500'}`} />
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
              Status: {isOnline ? 'Operational' : 'Standalone'}
            </span>
          </div>
          <h2 className="text-4xl font-black text-black leading-none uppercase tracking-tight">
            Commander {user?.name?.split(' ')[1] || user?.name || 'Asset'}
          </h2>
          <p className="text-xs text-gray-500 mt-2 uppercase tracking-widest">Readiness: {stats.averageScore}%</p>
        </div>
        <div className="border-2 border-black flex">
          <div className="px-6 py-3 border-r-2 border-black text-center">
            <p className="text-[9px] font-black text-[#0057FF] uppercase tracking-widest">Flight Hours</p>
            <p className="text-2xl font-black mt-1">{stats.totalQuizzes * 2}</p>
          </div>
          <div className="px-6 py-3 text-center">
            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Cert Level</p>
            <p className="text-2xl font-black mt-1">{stats.averageScore > 80 ? 'PRO-I' : 'CADET'}</p>
          </div>
        </div>
      </div>
    </header>

    {/* Metric cards */}
    <div className="grid grid-cols-1 md:grid-cols-3 border-b-2 border-black">
      {[
        { label: 'Avg. Score', value: `${stats.averageScore}%`, sub: stats.averageScore > 0 ? '↑ improving' : 'no data yet' },
        { label: 'Data Samples', value: questions.length, sub: 'Live DB' },
        { label: 'Missions', value: stats.totalQuizzes, sub: 'Logged' },
      ].map((item, i) => (
        <div key={item.label} className={`p-8 ${i < 2 ? 'border-b-2 md:border-b-0 md:border-r-2 border-black' : ''}`}>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">{item.label}</p>
          <p className="text-5xl font-black tracking-tight leading-none">{item.value}</p>
          <p className="text-[10px] font-bold text-[#0057FF] uppercase tracking-widest mt-2">{item.sub}</p>
        </div>
      ))}
    </div>

    {/* Lower grid */}
    <div className="grid grid-cols-1 lg:grid-cols-2 border-b-2 border-black">
      {/* Recent missions */}
      <div className="border-b-2 lg:border-b-0 lg:border-r-2 border-black">
        <div className="px-8 py-4 border-b-2 border-black">
          <h3 className="font-black text-sm uppercase tracking-widest">Recent Sorties</h3>
        </div>
        <div>
          {stats.history.length > 0 ? (
            stats.history.slice(0, 3).map((h, i) => {
              const pct = Math.round((h.score / h.total) * 100);
              const passed = pct >= 70;
              return (
                <div key={i} className={`flex items-center justify-between px-8 py-5 ${i < 2 ? 'border-b border-black' : ''}`}>
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 border-2 ${passed ? 'border-[#0057FF] text-[#0057FF]' : 'border-black text-black'} flex items-center justify-center font-black text-sm`}>
                      {h.score}/{h.total}
                    </div>
                    <div>
                      <p className="font-black text-sm uppercase tracking-tight">{h.trade}</p>
                      <p className="text-[10px] text-gray-400">{new Date(h.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <span className={`text-xs font-black px-3 py-1 border ${passed ? 'border-[#0057FF] text-[#0057FF]' : 'border-black text-black'}`}>
                    {pct}%
                  </span>
                </div>
              );
            })
          ) : (
            <div className="px-8 py-12 text-center">
              <p className="text-3xl mb-3">🎯</p>
              <p className="font-black text-sm uppercase">No missions logged yet.</p>
              <p className="text-xs text-gray-400 mt-1">Complete a quiz to see your history.</p>
            </div>
          )}
        </div>
      </div>

      {/* Scramble */}
      <div className="bg-black text-white flex flex-col justify-between p-8 min-h-[240px]">
        <div>
          <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Emergency</p>
          <h3 className="font-black text-3xl uppercase leading-tight mb-3">Emergency<br />Briefing</h3>
          <p className="text-sm text-gray-400 leading-relaxed">
            Simulated blitz assessment. Random trade, maximum difficulty.
          </p>
        </div>
        <button
          onClick={onScramble}
          className="mt-6 px-8 py-4 bg-[#0057FF] text-white font-black text-xs uppercase tracking-widest border-2 border-[#0057FF] hover:bg-white hover:text-black hover:border-white transition-colors self-start"
        >
          Scramble Now →
        </button>
      </div>
    </div>
  </div>
);

// ─── QUIZ VIEW ────────────────────────────────────────────────────────────────
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
    <div className="max-w-4xl mx-auto space-y-6 pb-32" style={{ fontFamily: MONO }}>
      {/* Top bar */}
      <div className="flex items-center justify-between border-b-2 border-black pb-4">
        <div className="flex items-center gap-4">
          <button
            onClick={onAbort}
            className="px-4 py-2 bg-black text-white text-[10px] font-black uppercase tracking-widest hover:bg-[#0057FF] transition-colors"
          >
            ✕ Abort
          </button>
          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
            Sector: <span className="text-[#0057FF]">{session.trade}</span>
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-xs font-black text-gray-400 uppercase tracking-widest">
            {session.currentQuestionIndex + 1} / {session.questions.length}
          </span>
          {session.mode === QuizMode.TIMED && (
            <div className={`text-xl font-black tabular-nums border-2 px-3 py-1 ${session.timeRemaining < 60 ? 'border-red-500 text-red-600' : 'border-black text-black'}`}>
              {Math.floor(session.timeRemaining / 60)}:
              {(session.timeRemaining % 60).toString().padStart(2, '0')}
            </div>
          )}
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full h-2 bg-gray-100 border border-black">
        <div
          className="h-full bg-[#0057FF] transition-all duration-700"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Question card */}
      <div className="border-2 border-black bg-white">
        <div className="p-8 md:p-10 border-b-2 border-black">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">
            Question {session.currentQuestionIndex + 1}
          </p>
          <h2 className="text-xl md:text-2xl font-black text-black leading-snug">{q.text}</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {q.options.map((opt, idx) => {
            const isCorrect = opt.id === q.correctAnswer;
            const isSelected = userChoice === opt.id;
            let bg = 'bg-white hover:bg-gray-50';
            let border = 'border-black';
            let textColor = 'text-black';
            if (isAnswered) {
              if (isCorrect) { bg = 'bg-[#EEF3FF]'; border = 'border-[#0057FF]'; textColor = 'text-[#0057FF]'; }
              else if (isSelected) { bg = 'bg-red-50'; border = 'border-red-500'; textColor = 'text-red-700'; }
              else { bg = 'bg-white'; border = 'border-gray-200'; textColor = 'text-gray-300'; }
            } else if (isSelected) {
              bg = 'bg-[#EEF3FF]'; border = 'border-[#0057FF]'; textColor = 'text-[#0057FF]';
            }
            const borderClass = idx % 2 === 0 ? 'border-r-2' : '';
            const rowClass = idx < 2 ? 'border-b-2' : '';
            return (
              <button
                key={opt.id}
                disabled={isAnswered}
                onClick={() => onAnswer(q.id, opt.id)}
                className={`w-full p-6 text-left transition-all flex items-center gap-4 border-black ${bg} ${borderClass} ${rowClass} ${!isAnswered ? 'cursor-pointer' : 'cursor-default'}`}
                style={{ borderColor: isAnswered && isCorrect ? '#0057FF' : isAnswered && isSelected && !isCorrect ? '#ef4444' : undefined }}
              >
                <div className={`w-9 h-9 border-2 flex items-center justify-center font-black text-sm flex-shrink-0 ${isSelected ? 'bg-[#0057FF] border-[#0057FF] text-white' : 'border-black text-black'}`}>
                  {opt.id}
                </div>
                <span className={`font-bold text-sm leading-tight flex-1 ${textColor}`}>{opt.text}</span>
              </button>
            );
          })}
        </div>

        {isAnswered && (
          <div className={`border-t-2 border-black p-6 ${userChoice === q.correctAnswer ? 'bg-[#EEF3FF]' : 'bg-red-50'}`}>
            <p className="font-black uppercase text-[10px] tracking-widest mb-2 flex items-center gap-2">
              <span className={`w-2 h-2 ${userChoice === q.correctAnswer ? 'bg-[#0057FF]' : 'bg-red-500'}`} />
              {userChoice === q.correctAnswer ? 'Verified — Correct' : 'Error Detected'}
            </p>
            <p className="text-sm leading-relaxed text-gray-700">{q.explanation}</p>
          </div>
        )}
      </div>

      <div className="flex justify-end">
        <button
          onClick={onNext}
          disabled={!isAnswered}
          className={`px-10 py-4 font-black text-xs uppercase tracking-widest border-2 transition-colors ${
            !isAnswered
              ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-black border-black text-white hover:bg-[#0057FF] hover:border-[#0057FF]'
          }`}
          style={{ fontFamily: MONO }}
        >
          {session.currentQuestionIndex < session.questions.length - 1 ? 'Next Phase →' : 'Finalize Mission →'}
        </button>
      </div>
    </div>
  );
};

// ─── TRADE SELECT VIEW ────────────────────────────────────────────────────────
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
  <div className="space-y-0 pb-40" style={{ fontFamily: MONO }}>
    {/* Header */}
    <header className="border-b-2 border-black pb-6 mb-0">
      <h2 className="text-4xl font-black uppercase tracking-tight">Training Sectors</h2>
      <p className="text-xs text-gray-500 mt-2 uppercase tracking-widest">
        Browse aviation courses by license path. Login is required to take any assessment.
      </p>
    </header>

    {/* Trade grid */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 border-t border-gray-100">
      {TRADE_INFO.map((info, idx) => {
        const count = questions.filter(q => q.trade === info.trade).length;
        const isSelected = currentTrade === info.trade;
        return (
          <div
            key={info.trade}
            onClick={() => setCurrentTrade(info.trade)}
            className={`cursor-pointer p-8 border-b-2 border-r-0 transition-all ${
              (idx + 1) % 3 !== 0 ? 'lg:border-r-2' : ''
            } ${(idx + 1) % 2 !== 0 ? 'sm:border-r-2 lg:border-r-0' : ''} border-black ${
              isSelected ? 'bg-black text-white' : 'bg-white hover:bg-gray-50'
            }`}
          >
            <div className={`w-12 h-12 border-2 flex items-center justify-center text-2xl mb-5 ${isSelected ? 'border-[#0057FF]' : 'border-black'}`}>
              {info.icon}
            </div>
            <h3 className={`font-black text-base uppercase tracking-tight mb-1 ${isSelected ? 'text-white' : 'text-black'}`}>
              {info.trade}
            </h3>
            <p className={`text-[10px] font-bold uppercase tracking-widest ${count > 0 ? (isSelected ? 'text-[#7aadff]' : 'text-[#0057FF]') : 'text-red-400'}`}>
              {count > 0 ? `${count} Question Briefs Loaded` : 'No Question Briefs Yet'}
            </p>
            {isSelected && (
              <div className="mt-4 flex items-center gap-2">
                <div className="w-4 h-px bg-[#0057FF]" />
                <span className="text-[9px] font-black uppercase tracking-widest text-[#0057FF]">Selected</span>
              </div>
            )}
          </div>
        );
      })}
    </div>

    {/* Bottom launch bar */}
    {currentTrade && (
      <div className="fixed inset-x-0 bottom-0 bg-white border-t-2 border-black z-50 shadow-2xl">
        <div className="max-w-6xl mx-auto">
          {!isLoggedIn && (
            <div className="border-b border-black px-6 py-2 bg-yellow-50 flex items-center gap-2">
              <span className="w-2 h-2 bg-yellow-500" />
              <p className="text-[10px] font-bold text-yellow-700 uppercase tracking-widest">
                Guest mode: course visibility only — sign in to begin assessments.
              </p>
            </div>
          )}
          <div className="flex items-center justify-between gap-4 px-6 py-4">
            <div>
              <h3 className="text-lg font-black uppercase tracking-tight">{currentTrade}</h3>
              <p className="text-[10px] text-gray-400 uppercase tracking-widest">
                {questions.filter(q => q.trade === currentTrade).length} question briefs available
              </p>
            </div>
            <div className="flex gap-0">
              <button
                onClick={() => (isLoggedIn ? onStart(currentTrade, QuizMode.PRACTICE) : onRequireLogin())}
                className={`px-8 py-4 font-black text-xs uppercase tracking-widest border-2 border-black transition-colors ${
                  isLoggedIn
                    ? 'bg-white text-black hover:bg-black hover:text-white'
                    : 'bg-gray-100 text-gray-400 border-gray-200'
                }`}
              >
                {isLoggedIn ? 'Practice Sortie' : 'Login to Fly'}
              </button>
              <button
                onClick={() => (isLoggedIn ? onStart(currentTrade, QuizMode.TIMED) : onRequireLogin())}
                className={`px-8 py-4 font-black text-xs uppercase tracking-widest border-2 border-l-0 transition-colors ${
                  isLoggedIn
                    ? 'bg-[#0057FF] border-[#0057FF] text-white hover:bg-black hover:border-black'
                    : 'bg-blue-100 border-blue-200 text-blue-400'
                }`}
              >
                {isLoggedIn ? 'Checkride Timer ⏱' : 'Authenticate to Launch ⏱'}
              </button>
            </div>
          </div>
        </div>
      </div>
    )}
  </div>
);

// ─── RESULTS VIEW ─────────────────────────────────────────────────────────────
interface ResultsViewProps {
  session: QuizSession | null;
  onHome: () => void;
  onReview: () => void;
  onRetry: () => void;
}

const ResultsView: React.FC<ResultsViewProps> = ({ session, onHome, onReview, onRetry }) => {
  if (!session) return null;
  const score = session.questions.reduce(
    (acc, q) => acc + (session.userAnswers[q.id] === q.correctAnswer ? 1 : 0), 0
  );
  const pct = Math.round((score / session.questions.length) * 100);
  const passed = pct >= 70;

  return (
    <div className="max-w-xl mx-auto py-12 space-y-0" style={{ fontFamily: MONO }}>
      {/* Status header */}
      <div className={`border-2 border-black p-8 ${passed ? 'bg-[#EEF3FF]' : 'bg-gray-50'}`}>
        <div className="flex items-center gap-3 mb-4">
          <span className={`w-3 h-3 ${passed ? 'bg-[#0057FF]' : 'bg-black'}`} />
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">
            {session.trade}
          </p>
        </div>
        <h2 className="text-4xl font-black uppercase tracking-tight mb-1">
          {passed ? 'Mission Success' : 'Debrief Required'}
        </h2>
        <p className="text-xs text-gray-500 uppercase tracking-widest">
          {passed ? 'Passing threshold exceeded' : 'Score below 70% threshold'}
        </p>
      </div>

      {/* Score display */}
      <div className="border-2 border-t-0 border-black grid grid-cols-2">
        <div className="p-8 border-r-2 border-black">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Correct</p>
          <p className="text-5xl font-black">{score}/{session.questions.length}</p>
        </div>
        <div className="p-8">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Score</p>
          <p className={`text-5xl font-black ${passed ? 'text-[#0057FF]' : 'text-black'}`}>{pct}%</p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="border-2 border-t-0 border-black p-4">
        <div className="w-full h-3 bg-gray-100 border border-black">
          <div
            className={`h-full transition-all ${passed ? 'bg-[#0057FF]' : 'bg-black'}`}
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-0 border-2 border-t-0 border-black">
        <button
          onClick={onHome}
          className="flex-1 py-5 bg-white text-black font-black text-xs uppercase tracking-widest border-r-2 border-black hover:bg-black hover:text-white transition-colors"
        >
          Home
        </button>
        <button
          onClick={onReview}
          className="flex-1 py-5 bg-black text-white font-black text-xs uppercase tracking-widest border-r-2 border-black hover:bg-[#0057FF] transition-colors"
        >
          Review
        </button>
        <button
          onClick={onRetry}
          className="flex-1 py-5 bg-[#0057FF] text-white font-black text-xs uppercase tracking-widest hover:bg-black transition-colors"
        >
          Retry
        </button>
      </div>
    </div>
  );
};

// ─── REVIEW VIEW ──────────────────────────────────────────────────────────────
interface ReviewViewProps {
  session: QuizSession | null;
  onClose: () => void;
}

const ReviewView: React.FC<ReviewViewProps> = ({ session, onClose }) => (
  <div className="space-y-0 pb-32 max-w-4xl mx-auto" style={{ fontFamily: MONO }}>
    <header className="flex justify-between items-center border-b-2 border-black pb-5 mb-0">
      <h2 className="text-3xl font-black uppercase tracking-tight">Post-Flight Analysis</h2>
      <button
        onClick={onClose}
        className="px-6 py-3 bg-black text-white font-black text-[10px] uppercase tracking-widest hover:bg-[#0057FF] transition-colors"
      >
        Close ✕
      </button>
    </header>

    <div>
      {session?.questions.map((q, idx) => {
        const userAns = session.userAnswers[q.id];
        const isCorrect = userAns === q.correctAnswer;
        return (
          <div key={q.id} className={`border-b-2 border-black ${isCorrect ? '' : 'bg-red-50'}`}>
            {/* Question header */}
            <div className={`flex items-start gap-4 p-6 border-b border-black ${isCorrect ? 'bg-[#EEF3FF]' : 'bg-red-100'}`}>
              <div className={`w-8 h-8 border-2 flex items-center justify-center font-black flex-shrink-0 text-xs ${isCorrect ? 'border-[#0057FF] text-[#0057FF]' : 'border-red-500 text-red-600'}`}>
                {idx + 1}
              </div>
              <h4 className="text-base font-bold leading-snug pt-0.5">{q.text}</h4>
            </div>

            {/* Options */}
            <div className="grid grid-cols-1 md:grid-cols-2">
              {q.options.map((opt, oi) => {
                let bg = 'bg-white';
                let textC = 'text-gray-400';
                let borderC = 'border-gray-100';
                if (opt.id === q.correctAnswer) { bg = 'bg-[#EEF3FF]'; textC = 'text-[#0057FF]'; borderC = 'border-[#0057FF]'; }
                else if (opt.id === userAns) { bg = 'bg-red-50'; textC = 'text-red-700'; borderC = 'border-red-300'; }
                return (
                  <div
                    key={opt.id}
                    className={`flex items-center gap-3 p-4 border ${borderC} ${bg} ${oi % 2 === 0 ? 'border-r-0 md:border-r' : ''} border-b`}
                  >
                    <span className={`w-6 h-6 border flex items-center justify-center text-xs font-black flex-shrink-0 border-current ${textC}`}>
                      {opt.id}
                    </span>
                    <span className={`text-sm font-bold ${textC}`}>{opt.text}</span>
                  </div>
                );
              })}
            </div>

            {/* Explanation */}
            <div className="bg-black text-white p-6">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Explanation</p>
              <p className="text-sm leading-relaxed text-gray-300">{q.explanation}</p>
            </div>
          </div>
        );
      })}
    </div>
  </div>
);

// ─── PROFILE VIEW ─────────────────────────────────────────────────────────────
interface ProfileViewProps {
  user: any;
  stats: UserStats;
}

const ProfileView: React.FC<ProfileViewProps> = ({ user, stats }) => (
  <div className="max-w-2xl mx-auto py-8 space-y-0" style={{ fontFamily: MONO }}>
    {/* Identity block */}
    <div className="border-2 border-black">
      <div className="bg-black text-white p-8 flex items-center gap-6 border-b-2 border-black">
        <div className="w-16 h-16 border-2 border-[#0057FF] flex items-center justify-center font-black text-3xl text-[#0057FF] bg-black flex-shrink-0">
          {user?.name?.[0]?.toUpperCase() || 'A'}
        </div>
        <div>
          <h2 className="text-2xl font-black uppercase tracking-tight">{user?.name || 'Asset'}</h2>
          <p className="text-xs text-gray-400 mt-1">{user?.email}</p>
          <span className={`inline-block mt-2 text-[9px] font-black px-3 py-1 uppercase tracking-widest border ${user?.role === 'admin' ? 'border-yellow-400 text-yellow-400' : 'border-[#0057FF] text-[#0057FF]'}`}>
            {user?.role || 'user'}
          </span>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2">
        {[
          { label: 'Avg Score', value: `${stats.averageScore}%`, color: 'text-[#0057FF]' },
          { label: 'Missions', value: stats.totalQuizzes, color: 'text-black' },
          { label: 'Flight Hours', value: stats.totalQuizzes * 2, color: 'text-black' },
          {
            label: 'Cert Level',
            value: stats.averageScore > 80 ? 'PRO-I' : stats.averageScore > 60 ? 'INTER' : 'CADET',
            color: 'text-[#0057FF]',
          },
        ].map((item, i) => (
          <div key={item.label} className={`p-6 ${i % 2 === 0 ? 'border-r-2 border-black' : ''} ${i < 2 ? 'border-b-2 border-black' : ''}`}>
            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2">{item.label}</p>
            <p className={`text-3xl font-black ${item.color}`}>{item.value}</p>
          </div>
        ))}
      </div>
    </div>

    {/* Danger zone */}
    <div className="border-2 border-t-0 border-black p-6 flex items-center justify-between">
      <div>
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Session</p>
        <p className="text-sm font-bold mt-0.5">Revoke authorization and sign out</p>
      </div>
      <button
        onClick={() => { apiService.clearAuth(); window.location.reload(); }}
        className="px-6 py-3 bg-black text-white font-black text-[10px] uppercase tracking-widest border-2 border-black hover:bg-red-600 hover:border-red-600 transition-colors"
      >
        Sign Out
      </button>
    </div>
  </div>
);

// ─── FLEET SPECS VIEW ─────────────────────────────────────────────────────────
const FleetSpecsView: React.FC<{ onBack: () => void }> = ({ onBack }) => (
  <div className="space-y-0 pb-12" style={{ fontFamily: MONO }}>
    <header className="flex items-center justify-between border-b-2 border-black pb-5 mb-0">
      <h2 className="text-4xl font-black uppercase tracking-tight">Fleet Intelligence</h2>
      <button
        onClick={onBack}
        className="px-5 py-3 bg-black text-white font-black text-[10px] uppercase tracking-widest hover:bg-[#0057FF] transition-colors"
      >
        ← Back
      </button>
    </header>
    <p className="text-xs text-gray-500 uppercase tracking-widest py-4 border-b-2 border-black">
      Aviation trade specifications and NCAA certification requirements.
    </p>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 border-t border-gray-100">
      {TRADE_INFO.map((info, idx) => (
        <div
          key={info.trade}
          className={`p-8 border-b-2 border-black ${(idx + 1) % 3 !== 0 ? 'lg:border-r-2 lg:border-r-black' : ''} ${(idx + 1) % 2 !== 0 ? 'sm:border-r-2 sm:border-r-black lg:border-r-0' : ''} hover:bg-black hover:text-white transition-colors group`}
        >
          <div className="w-12 h-12 border-2 border-black group-hover:border-[#0057FF] flex items-center justify-center text-2xl mb-5">
            {info.icon}
          </div>
          <h3 className="font-black text-base uppercase tracking-tight mb-1">{info.trade}</h3>
          <p className="text-[10px] text-gray-400 group-hover:text-gray-500 uppercase tracking-widest">NCAA Certification Required</p>
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

  const [authMode, setAuthMode] = useState<'LOGIN' | 'REGISTER'>('LOGIN');
  const [authData, setAuthData] = useState({ name: '', email: '', password: '' });
  const [authError, setAuthError] = useState('');

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
      trade, mode, questions: shuffled,
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
        (acc, q) => acc + (prev.userAnswers[q.id] === q.correctAnswer ? 1 : 0), 0
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

  const handleNextQuestion = useCallback(() => {
    if (!session) return;
    if (session.currentQuestionIndex < session.questions.length - 1) {
      setSession(s => s ? { ...s, currentQuestionIndex: s.currentQuestionIndex + 1 } : null);
    } else {
      finishQuiz();
    }
  }, [session, finishQuiz]);

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
    if (!user && protectedViews.includes(view)) setView('AUTH');
  }, [user, view]);

  return (
    <Layout currentView={view} setView={setView} user={user}>
      <OfflineBadge isOnline={isOnline} />

      {view === 'LANDING' && (
        <LandingView onEnter={() => setView('TRADE_SELECT')} onFleet={() => setView('FLEET_SPECS')} />
      )}
      {view === 'AUTH' && (
        <AuthView
          authMode={authMode} setAuthMode={setAuthMode}
          authData={authData} setAuthData={setAuthData}
          authError={authError} onSubmit={handleAuth}
        />
      )}
      {view === 'DASHBOARD' && (
        <DashboardView
          user={user} stats={stats} isOnline={isOnline} questions={questions}
          onScramble={() => startQuiz(Trade.SAFETY_HUMAN_FACTORS, QuizMode.TIMED)}
        />
      )}
      {view === 'TRADE_SELECT' && (
        <TradeSelectView
          questions={questions} currentTrade={currentTrade}
          setCurrentTrade={setCurrentTrade} onStart={startQuiz}
          isLoggedIn={!!user} onRequireLogin={() => setView('AUTH')}
        />
      )}
      {view === 'QUIZ' && session && (
        <QuizView session={session} onAnswer={handleAnswer} onNext={handleNextQuestion} onAbort={handleAbort} />
      )}
      {view === 'RESULTS' && (
        <ResultsView
          session={session} onHome={() => setView('DASHBOARD')}
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