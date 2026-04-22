import React, { useState, useEffect, useCallback } from 'react';
import { Trade, QuizMode, Question, QuizSession, UserStats, View } from './types';
import { INITIAL_QUESTIONS, TRADE_INFO } from './constants';
import { Layout } from './components/Layout';
import { AdminView } from './components/AdminView';
import { apiService } from './services/apiService';
import { LandingView, OfflineBadge } from './components/views/LandingView';

const MONO = "'Space Mono', 'Courier New', monospace";

// ── Theme helpers ────────────────────────────────────────────────────────────
// Each view receives `dm` (boolean) and builds these class objects locally.
const mkTheme = (dm: boolean) => ({
  page     : dm ? 'bg-[#111111] text-[#f0f0f0]' : 'bg-white text-black',
  border   : dm ? 'border-[#2a2a2a]' : 'border-black',
  panel    : dm ? 'bg-[#1a1a1a]'     : 'bg-gray-50',
  input    : dm ? 'bg-[#222] text-[#f0f0f0] placeholder-[#555]' : 'bg-white text-black placeholder-gray-400',
  text     : dm ? 'text-[#f0f0f0]'   : 'text-black',
  textDim  : dm ? 'text-[#666]'      : 'text-gray-500',
  textMid  : dm ? 'text-[#888]'      : 'text-gray-400',
  accentBg : dm ? 'bg-[#0d1f3c]'     : 'bg-[#EEF3FF]',
  accentText: 'text-[#0057FF]',
  blackSection: dm ? 'bg-[#0a0a0a]'  : 'bg-black',
  rowHover : dm ? 'hover:bg-[#1e1e1e]' : 'hover:bg-gray-50',
});

// ─── AUTH VIEW ───────────────────────────────────────────────────────────────
interface AuthViewProps {
  authMode: 'LOGIN' | 'REGISTER';
  setAuthMode: (m: 'LOGIN' | 'REGISTER') => void;
  authData: { name: string; email: string; password: string };
  setAuthData: React.Dispatch<React.SetStateAction<{ name: string; email: string; password: string }>>;
  authError: string;
  onSubmit: (e: React.FormEvent) => void;
  darkMode: boolean;
}

const AuthView: React.FC<AuthViewProps> = ({
  authMode, setAuthMode, authData, setAuthData, authError, onSubmit, darkMode,
}) => {
  const t = mkTheme(darkMode);
  const dm = darkMode;
  return (
    <div className={`min-h-screen ${t.page} flex items-center justify-center p-4`} style={{ fontFamily: MONO }}>
      {/* dot grid bg */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage: `radial-gradient(circle, ${dm ? '#fff' : '#000'} 1px, transparent 1px)`,
          backgroundSize: '28px 28px',
        }}
      />
      <div className="w-full max-w-md relative z-10">
        {/* Header bar */}
        <div className={`border-2 ${t.border} border-b-0 px-8 pt-6 pb-4 bg-black`}>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 bg-[#0057FF]" />
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
        <div className={`border-2 ${t.border} border-t-0 ${dm ? 'bg-[#111]' : 'bg-white'} p-8`}>
          {authError && (
            <div className={`border-2 border-black bg-black text-white p-4 text-xs font-bold mb-6 flex items-center gap-3`}>
              <span className="w-2 h-2 bg-[#0057FF] flex-shrink-0" />
              {authError}
            </div>
          )}

          <form onSubmit={onSubmit} className="flex flex-col gap-0">
            {authMode === 'REGISTER' && (
              <>
                <label className={`text-[10px] font-black ${t.textMid} uppercase tracking-widest px-4 pt-3 pb-1 border-2 ${t.border} border-b-0 ${t.panel}`}>Full Name</label>
                <input
                  type="text" required value={authData.name}
                  onChange={e => setAuthData(prev => ({ ...prev, name: e.target.value }))}
                  className={`border-2 ${t.border} border-b-0 px-4 py-3 text-sm ${t.input} focus:outline-none focus:bg-[#0d1f3c] transition-colors`}
                  style={{ fontFamily: MONO }}
                  placeholder="Captain Maverick"
                />
              </>
            )}

            <label className={`text-[10px] font-black ${t.textMid} uppercase tracking-widest px-4 pt-3 pb-1 border-2 ${t.border} border-b-0 ${t.panel}`}>
              Aviation ID (Email)
            </label>
            <input
              type="email" required value={authData.email}
              onChange={e => setAuthData(prev => ({ ...prev, email: e.target.value }))}
              placeholder="name@airline.com"
              className={`border-2 ${t.border} border-b-0 px-4 py-3 text-sm ${t.input} focus:outline-none focus:bg-[#0d1f3c] transition-colors`}
              style={{ fontFamily: MONO }}
            />

            <label className={`text-[10px] font-black ${t.textMid} uppercase tracking-widest px-4 pt-3 pb-1 border-2 ${t.border} border-b-0 ${t.panel}`}>
              Security Pass
            </label>
            <input
              type="password" required value={authData.password}
              onChange={e => setAuthData(prev => ({ ...prev, password: e.target.value }))}
              placeholder="••••••••"
              className={`border-2 ${t.border} px-4 py-3 text-sm ${t.input} focus:outline-none focus:bg-[#0d1f3c] transition-colors`}
              style={{ fontFamily: MONO }}
            />

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
            className={`w-full text-center mt-4 pt-4 border-t ${t.border} text-[10px] font-bold ${t.textMid} hover:text-[#0057FF] transition-colors uppercase tracking-widest`}
            style={{ fontFamily: MONO }}
          >
            {authMode === 'LOGIN' ? 'Need a clearance? Start Enrollment →' : 'Already registered? Login to Cockpit →'}
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── DASHBOARD VIEW ───────────────────────────────────────────────────────────
interface DashboardViewProps {
  user: any; stats: UserStats; isOnline: boolean; questions: Question[];
  onScramble: () => void; darkMode: boolean;
}

const DashboardView: React.FC<DashboardViewProps> = ({ user, stats, isOnline, questions, onScramble, darkMode }) => {
  const t = mkTheme(darkMode);
  return (
    <div className="space-y-0 pb-12" style={{ fontFamily: MONO }}>
      {/* Header */}
      <header className={`border-b-2 ${t.border} pb-6 mb-0`}>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className={`w-2 h-2 ${isOnline ? 'bg-[#0057FF]' : 'bg-orange-500'}`} />
              <span className={`text-[10px] font-black ${t.textMid} uppercase tracking-widest`}>
                Status: {isOnline ? 'Operational' : 'Standalone'}
              </span>
            </div>
            <h2 className={`text-4xl font-black ${t.text} leading-none uppercase tracking-tight`}>
              Commander {user?.name?.split(' ')[1] || user?.name || 'Asset'}
            </h2>
            <p className={`text-xs ${t.textDim} mt-2 uppercase tracking-widest`}>Readiness: {stats.averageScore}%</p>
          </div>
          <div className={`border-2 ${t.border} flex`}>
            <div className={`px-6 py-3 border-r-2 ${t.border} text-center`}>
              <p className="text-[9px] font-black text-[#0057FF] uppercase tracking-widest">Flight Hours</p>
              <p className={`text-2xl font-black mt-1 ${t.text}`}>{stats.totalQuizzes * 2}</p>
            </div>
            <div className="px-6 py-3 text-center">
              <p className={`text-[9px] font-black ${t.textMid} uppercase tracking-widest`}>Cert Level</p>
              <p className={`text-2xl font-black mt-1 ${t.text}`}>{stats.averageScore > 80 ? 'PRO-I' : 'CADET'}</p>
            </div>
          </div>
        </div>
      </header>

      {/* Metric strip */}
      <div className={`grid grid-cols-1 md:grid-cols-3 border-b-2 ${t.border}`}>
        {[
          { label: 'Avg. Score',    value: `${stats.averageScore}%`, sub: stats.averageScore > 0 ? '↑ improving' : 'no data yet' },
          { label: 'Data Samples',  value: questions.length,          sub: 'Live DB'   },
          { label: 'Missions',      value: stats.totalQuizzes,        sub: 'Logged'    },
        ].map((item, i) => (
          <div key={item.label} className={`p-8 ${i < 2 ? `border-b-2 md:border-b-0 md:border-r-2 ${t.border}` : ''}`}>
            <p className={`text-[10px] font-black ${t.textMid} uppercase tracking-widest mb-3`}>{item.label}</p>
            <p className={`text-5xl font-black tracking-tight leading-none ${t.text}`}>{item.value}</p>
            <p className="text-[10px] font-bold text-[#0057FF] uppercase tracking-widest mt-2">{item.sub}</p>
          </div>
        ))}
      </div>

      {/* Lower grid */}
      <div className={`grid grid-cols-1 lg:grid-cols-2 border-b-2 ${t.border}`}>
        {/* Recent sorties */}
        <div className={`border-b-2 lg:border-b-0 lg:border-r-2 ${t.border}`}>
          <div className={`px-8 py-4 border-b-2 ${t.border}`}>
            <h3 className={`font-black text-sm uppercase tracking-widest ${t.text}`}>Recent Sorties</h3>
          </div>
          {stats.history.length > 0 ? (
            stats.history.slice(0, 3).map((h, i) => {
              const pct = Math.round((h.score / h.total) * 100);
              const passed = pct >= 70;
              return (
                <div key={i} className={`flex items-center justify-between px-8 py-5 ${i < 2 ? `border-b ${t.border}` : ''} ${t.rowHover} transition-colors`}>
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 border-2 flex items-center justify-center font-black text-sm ${passed ? 'border-[#0057FF] text-[#0057FF]' : `${t.border} ${t.text}`}`}>
                      {h.score}/{h.total}
                    </div>
                    <div>
                      <p className={`font-black text-sm uppercase tracking-tight ${t.text}`}>{h.trade}</p>
                      <p className={`text-[10px] ${t.textDim}`}>{new Date(h.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <span className={`text-xs font-black px-3 py-1 border ${passed ? 'border-[#0057FF] text-[#0057FF]' : `${t.border} ${t.text}`}`}>
                    {pct}%
                  </span>
                </div>
              );
            })
          ) : (
            <div className="px-8 py-12 text-center">
              <p className="text-3xl mb-3">🎯</p>
              <p className={`font-black text-sm uppercase ${t.text}`}>No missions logged yet.</p>
              <p className={`text-xs ${t.textDim} mt-1`}>Complete a quiz to see your history.</p>
            </div>
          )}
        </div>

        {/* Scramble */}
        <div className={`${t.blackSection} text-white flex flex-col justify-between p-8 min-h-[240px]`}>
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
};

// ─── QUIZ VIEW ────────────────────────────────────────────────────────────────
interface QuizViewProps {
  session: QuizSession; onAnswer:(id:string,a:string)=>void;
  onNext:()=>void; onAbort:()=>void; darkMode: boolean;
}

const QuizView: React.FC<QuizViewProps> = ({ session, onAnswer, onNext, onAbort, darkMode }) => {
  const t = mkTheme(darkMode);
  const q = session.questions[session.currentQuestionIndex];
  const progress = ((session.currentQuestionIndex + 1) / session.questions.length) * 100;
  const isAnswered = !!session.userAnswers[q.id];
  const userChoice = session.userAnswers[q.id];

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-32" style={{ fontFamily: MONO }}>
      {/* Top bar */}
      <div className={`flex items-center justify-between border-b-2 ${t.border} pb-4`}>
        <div className="flex items-center gap-4">
          <button onClick={onAbort} className="px-4 py-2 bg-black text-white text-[10px] font-black uppercase tracking-widest hover:bg-[#0057FF] transition-colors">
            ✕ Abort
          </button>
          <span className={`text-[10px] font-black ${t.textMid} uppercase tracking-widest`}>
            Sector: <span className="text-[#0057FF]">{session.trade}</span>
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span className={`text-xs font-black ${t.textMid} uppercase tracking-widest`}>
            {session.currentQuestionIndex + 1} / {session.questions.length}
          </span>
          {session.mode === QuizMode.TIMED && (
            <div className={`text-xl font-black tabular-nums border-2 px-3 py-1 ${session.timeRemaining < 60 ? 'border-red-500 text-red-500' : `${t.border} ${t.text}`}`}>
              {Math.floor(session.timeRemaining / 60)}:{(session.timeRemaining % 60).toString().padStart(2, '0')}
            </div>
          )}
        </div>
      </div>

      {/* Progress */}
      <div className={`w-full h-2 ${darkMode ? 'bg-[#222]' : 'bg-gray-100'} border ${t.border}`}>
        <div className="h-full bg-[#0057FF] transition-all duration-700" style={{ width: `${progress}%` }} />
      </div>

      {/* Question card */}
      <div className={`border-2 ${t.border}`}>
        <div className={`p-8 border-b-2 ${t.border} ${t.panel}`}>
          <p className={`text-[10px] font-black ${t.textMid} uppercase tracking-widest mb-3`}>Question {session.currentQuestionIndex + 1}</p>
          <h2 className={`text-xl md:text-2xl font-black ${t.text} leading-snug`}>{q.text}</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {q.options.map((opt, idx) => {
            const isCorrect = opt.id === q.correctAnswer;
            const isSelected = userChoice === opt.id;
            let cls = darkMode
              ? `bg-[#111] hover:bg-[#1a1a1a] ${t.text}`
              : 'bg-white hover:bg-gray-50 text-black';
            if (isAnswered) {
              if (isCorrect)      cls = `${t.accentBg} text-[#0057FF]`;
              else if (isSelected) cls = 'bg-red-950 text-red-400';
              else                 cls = darkMode ? 'bg-[#111] text-[#333]' : 'bg-white text-gray-200';
            } else if (isSelected) {
              cls = `${t.accentBg} text-[#0057FF]`;
            }
            return (
              <button
                key={opt.id}
                disabled={isAnswered}
                onClick={() => onAnswer(q.id, opt.id)}
                className={`w-full p-6 text-left transition-all flex items-center gap-4 ${cls} border-b ${idx % 2 === 0 ? 'md:border-r' : ''} ${t.border}`}
              >
                <div className={`w-9 h-9 border-2 flex items-center justify-center font-black text-sm flex-shrink-0 ${isSelected ? 'bg-[#0057FF] border-[#0057FF] text-white' : t.border + ' ' + t.text}`}>
                  {opt.id}
                </div>
                <span className="font-bold text-sm leading-tight flex-1">{opt.text}</span>
              </button>
            );
          })}
        </div>

        {isAnswered && (
          <div className={`border-t-2 ${t.border} p-6 ${userChoice === q.correctAnswer ? t.accentBg : 'bg-red-950'}`}>
            <p className="font-black uppercase text-[10px] tracking-widest mb-2 flex items-center gap-2">
              <span className={`w-2 h-2 ${userChoice === q.correctAnswer ? 'bg-[#0057FF]' : 'bg-red-500'}`} />
              {userChoice === q.correctAnswer ? 'Verified — Correct' : 'Error Detected'}
            </p>
            <p className={`text-sm leading-relaxed ${userChoice === q.correctAnswer ? 'text-[#0057FF]' : 'text-red-300'}`}>
              {q.explanation}
            </p>
          </div>
        )}
      </div>

      <div className="flex justify-end">
        <button
          onClick={onNext} disabled={!isAnswered}
          className={`px-10 py-4 font-black text-xs uppercase tracking-widest border-2 transition-colors ${
            !isAnswered
              ? darkMode ? 'bg-[#1a1a1a] border-[#2a2a2a] text-[#333] cursor-not-allowed' : 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed'
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
  questions:Question[]; currentTrade:Trade|null; setCurrentTrade:(t:Trade)=>void;
  onStart:(t:Trade,m:QuizMode)=>void; isLoggedIn:boolean; onRequireLogin:()=>void;
  darkMode: boolean;
}

const TradeSelectView: React.FC<TradeSelectViewProps> = ({
  questions, currentTrade, setCurrentTrade, onStart, isLoggedIn, onRequireLogin, darkMode,
}) => {
  const t = mkTheme(darkMode);
  return (
    <div className="space-y-0 pb-40" style={{ fontFamily: MONO }}>
      <header className={`border-b-2 ${t.border} pb-6`}>
        <h2 className={`text-4xl font-black uppercase tracking-tight ${t.text}`}>Training Sectors</h2>
        <p className={`text-xs ${t.textDim} mt-2 uppercase tracking-widest`}>
          Browse aviation courses by license path. Login required for assessments.
        </p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {TRADE_INFO.map((info, idx) => {
          const count = questions.filter(q => q.trade === info.trade).length;
          const isSelected = currentTrade === info.trade;
          const borderR = (idx + 1) % 3 !== 0 ? `lg:border-r-2` : '';
          const borderR2 = (idx + 1) % 2 !== 0 ? `sm:border-r-2 lg:border-r-0` : '';
          return (
            <div
              key={info.trade}
              onClick={() => setCurrentTrade(info.trade)}
              className={`cursor-pointer p-8 border-b-2 ${t.border} ${borderR} ${borderR2} transition-all ${
                isSelected
                  ? 'bg-[#0057FF] text-white'
                  : darkMode ? 'bg-[#111] hover:bg-[#1a1a1a]' : 'bg-white hover:bg-gray-50'
              }`}
            >
              <div className={`w-12 h-12 border-2 flex items-center justify-center text-2xl mb-5 ${isSelected ? 'border-white' : t.border}`}>
                {info.icon}
              </div>
              <h3 className={`font-black text-base uppercase tracking-tight mb-1 ${isSelected ? 'text-white' : t.text}`}>
                {info.trade}
              </h3>
              <p className={`text-[10px] font-bold uppercase tracking-widest ${
                count > 0
                  ? isSelected ? 'text-blue-200' : 'text-[#0057FF]'
                  : 'text-red-400'
              }`}>
                {count > 0 ? `${count} Question Briefs Loaded` : 'No Question Briefs Yet'}
              </p>
              {isSelected && (
                <div className="mt-4 flex items-center gap-2">
                  <div className="w-4 h-px bg-white" />
                  <span className="text-[9px] font-black uppercase tracking-widest text-blue-200">Selected</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Launch bar */}
      {currentTrade && (
        <div className={`fixed inset-x-0 bottom-0 ${darkMode ? 'bg-[#0a0a0a]' : 'bg-white'} border-t-2 ${t.border} z-50 shadow-2xl`}>
          <div className="max-w-6xl mx-auto">
            {!isLoggedIn && (
              <div className={`border-b ${t.border} px-6 py-2 ${darkMode ? 'bg-[#1a1200]' : 'bg-yellow-50'} flex items-center gap-2`}>
                <span className="w-2 h-2 bg-yellow-500" />
                <p className="text-[10px] font-bold text-yellow-600 uppercase tracking-widest">
                  Guest mode: course visibility only — sign in to begin assessments.
                </p>
              </div>
            )}
            <div className="flex items-center justify-between gap-4 px-6 py-4">
              <div>
                <h3 className={`text-lg font-black uppercase tracking-tight ${t.text}`}>{currentTrade}</h3>
                <p className={`text-[10px] ${t.textDim} uppercase tracking-widest`}>
                  {questions.filter(q => q.trade === currentTrade).length} question briefs available
                </p>
              </div>
              <div className="flex gap-0">
                <button
                  onClick={() => (isLoggedIn ? onStart(currentTrade, QuizMode.PRACTICE) : onRequireLogin())}
                  className={`px-8 py-4 font-black text-xs uppercase tracking-widest border-2 ${t.border} transition-colors ${
                    isLoggedIn
                      ? darkMode ? 'bg-[#111] text-[#f0f0f0] hover:bg-[#0057FF] hover:text-white hover:border-[#0057FF]' : 'bg-white text-black hover:bg-black hover:text-white'
                      : darkMode ? 'bg-[#1a1a1a] text-[#444] border-[#2a2a2a]' : 'bg-gray-100 text-gray-400 border-gray-200'
                  }`}
                >
                  {isLoggedIn ? 'Practice Sortie' : 'Login to Fly'}
                </button>
                <button
                  onClick={() => (isLoggedIn ? onStart(currentTrade, QuizMode.TIMED) : onRequireLogin())}
                  className={`px-8 py-4 font-black text-xs uppercase tracking-widest border-2 border-l-0 transition-colors ${
                    isLoggedIn
                      ? 'bg-[#0057FF] border-[#0057FF] text-white hover:bg-black hover:border-black'
                      : 'bg-blue-900/30 border-blue-800 text-blue-600'
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
};

// ─── RESULTS VIEW ─────────────────────────────────────────────────────────────
interface ResultsViewProps {
  session:QuizSession|null; onHome:()=>void; onReview:()=>void; onRetry:()=>void; darkMode:boolean;
}

const ResultsView: React.FC<ResultsViewProps> = ({ session, onHome, onReview, onRetry, darkMode }) => {
  if (!session) return null;
  const t = mkTheme(darkMode);
  const score = session.questions.reduce((acc, q) => acc + (session.userAnswers[q.id] === q.correctAnswer ? 1 : 0), 0);
  const pct = Math.round((score / session.questions.length) * 100);
  const passed = pct >= 70;

  return (
    <div className="max-w-xl mx-auto py-12 space-y-0" style={{ fontFamily: MONO }}>
      <div className={`border-2 ${t.border} p-8 ${passed ? t.accentBg : darkMode ? 'bg-[#1a1a1a]' : 'bg-gray-50'}`}>
        <div className="flex items-center gap-3 mb-4">
          <span className={`w-3 h-3 ${passed ? 'bg-[#0057FF]' : 'bg-black'}`} />
          <p className={`text-[10px] font-black ${t.textMid} uppercase tracking-widest`}>{session.trade}</p>
        </div>
        <h2 className={`text-4xl font-black uppercase tracking-tight mb-1 ${t.text}`}>
          {passed ? 'Mission Success' : 'Debrief Required'}
        </h2>
        <p className={`text-xs ${t.textDim} uppercase tracking-widest`}>
          {passed ? 'Passing threshold exceeded' : 'Score below 70% threshold'}
        </p>
      </div>

      <div className={`border-2 border-t-0 ${t.border} grid grid-cols-2`}>
        <div className={`p-8 border-r-2 ${t.border}`}>
          <p className={`text-[10px] font-black ${t.textMid} uppercase tracking-widest mb-2`}>Correct</p>
          <p className={`text-5xl font-black ${t.text}`}>{score}/{session.questions.length}</p>
        </div>
        <div className="p-8">
          <p className={`text-[10px] font-black ${t.textMid} uppercase tracking-widest mb-2`}>Score</p>
          <p className={`text-5xl font-black ${passed ? 'text-[#0057FF]' : t.text}`}>{pct}%</p>
        </div>
      </div>

      <div className={`border-2 border-t-0 ${t.border} p-4`}>
        <div className={`w-full h-3 ${darkMode ? 'bg-[#222]' : 'bg-gray-100'} border ${t.border}`}>
          <div className={`h-full ${passed ? 'bg-[#0057FF]' : 'bg-black'}`} style={{ width: `${pct}%` }} />
        </div>
      </div>

      <div className={`flex gap-0 border-2 border-t-0 ${t.border}`}>
        <button onClick={onHome}   className={`flex-1 py-5 ${darkMode ? 'bg-[#111] text-[#f0f0f0]' : 'bg-white text-black'} font-black text-xs uppercase tracking-widest border-r-2 ${t.border} hover:bg-black hover:text-white transition-colors`}>Home</button>
        <button onClick={onReview} className={`flex-1 py-5 ${t.blackSection} text-white font-black text-xs uppercase tracking-widest border-r-2 ${t.border} hover:bg-[#0057FF] transition-colors`}>Review</button>
        <button onClick={onRetry}  className="flex-1 py-5 bg-[#0057FF] text-white font-black text-xs uppercase tracking-widest hover:bg-black transition-colors">Retry</button>
      </div>
    </div>
  );
};

// ─── REVIEW VIEW ──────────────────────────────────────────────────────────────
interface ReviewViewProps { session:QuizSession|null; onClose:()=>void; darkMode:boolean; }

const ReviewView: React.FC<ReviewViewProps> = ({ session, onClose, darkMode }) => {
  const t = mkTheme(darkMode);
  return (
    <div className="space-y-0 pb-32 max-w-4xl mx-auto" style={{ fontFamily: MONO }}>
      <header className={`flex justify-between items-center border-b-2 ${t.border} pb-5 mb-0`}>
        <h2 className={`text-3xl font-black uppercase tracking-tight ${t.text}`}>Post-Flight Analysis</h2>
        <button onClick={onClose} className="px-6 py-3 bg-black text-white font-black text-[10px] uppercase tracking-widest hover:bg-[#0057FF] transition-colors">
          Close ✕
        </button>
      </header>

      <div>
        {session?.questions.map((q, idx) => {
          const userAns = session.userAnswers[q.id];
          const isCorrect = userAns === q.correctAnswer;
          return (
            <div key={q.id} className={`border-b-2 ${t.border} ${isCorrect ? '' : darkMode ? 'bg-red-950/30' : 'bg-red-50'}`}>
              <div className={`flex items-start gap-4 p-6 border-b ${t.border} ${isCorrect ? t.accentBg : darkMode ? 'bg-red-950/50' : 'bg-red-100'}`}>
                <div className={`w-8 h-8 border-2 flex items-center justify-center font-black flex-shrink-0 text-xs ${isCorrect ? 'border-[#0057FF] text-[#0057FF]' : 'border-red-500 text-red-500'}`}>
                  {idx + 1}
                </div>
                <h4 className={`text-base font-bold leading-snug pt-0.5 ${t.text}`}>{q.text}</h4>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2">
                {q.options.map((opt, oi) => {
                  let bg = darkMode ? 'bg-[#111]' : 'bg-white';
                  let tc = t.textDim;
                  let bc = t.border;
                  if (opt.id === q.correctAnswer) { bg = t.accentBg; tc = 'text-[#0057FF]'; bc = 'border-[#0057FF]'; }
                  else if (opt.id === userAns)    { bg = darkMode ? 'bg-red-950' : 'bg-red-50'; tc = 'text-red-500'; bc = 'border-red-400'; }
                  return (
                    <div key={opt.id} className={`flex items-center gap-3 p-4 border ${bc} ${bg} ${oi % 2 === 0 ? 'border-r-0 md:border-r' : ''} border-b`}>
                      <span className={`w-6 h-6 border flex items-center justify-center text-xs font-black flex-shrink-0 border-current ${tc}`}>{opt.id}</span>
                      <span className={`text-sm font-bold ${tc}`}>{opt.text}</span>
                    </div>
                  );
                })}
              </div>

              <div className={`${t.blackSection} text-white p-6`}>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Explanation</p>
                <p className="text-sm leading-relaxed text-gray-300">{q.explanation}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ─── PROFILE VIEW ─────────────────────────────────────────────────────────────
interface ProfileViewProps { user:any; stats:UserStats; darkMode:boolean; }

const ProfileView: React.FC<ProfileViewProps> = ({ user, stats, darkMode }) => {
  const t = mkTheme(darkMode);
  return (
    <div className="max-w-2xl mx-auto py-8 space-y-0" style={{ fontFamily: MONO }}>
      <div className={`border-2 ${t.border}`}>
        <div className={`${t.blackSection} text-white p-8 flex items-center gap-6 border-b-2 ${t.border}`}>
          <div className="w-16 h-16 border-2 border-[#0057FF] flex items-center justify-center font-black text-3xl text-[#0057FF] flex-shrink-0">
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

        <div className="grid grid-cols-2">
          {[
            { label:'Avg Score',    value:`${stats.averageScore}%`,           color:'text-[#0057FF]' },
            { label:'Missions',     value:stats.totalQuizzes,                  color:t.text           },
            { label:'Flight Hours', value:stats.totalQuizzes * 2,              color:t.text           },
            { label:'Cert Level',   value:stats.averageScore>80?'PRO-I':stats.averageScore>60?'INTER':'CADET', color:'text-[#0057FF]' },
          ].map((item, i) => (
            <div key={item.label} className={`p-6 ${i%2===0?`border-r-2 ${t.border}`:''} ${i<2?`border-b-2 ${t.border}`:''}`}>
              <p className={`text-[9px] font-black ${t.textMid} uppercase tracking-widest mb-2`}>{item.label}</p>
              <p className={`text-3xl font-black ${item.color}`}>{item.value}</p>
            </div>
          ))}
        </div>
      </div>

      <div className={`border-2 border-t-0 ${t.border} p-6 flex items-center justify-between`}>
        <div>
          <p className={`text-[10px] font-black ${t.textMid} uppercase tracking-widest`}>Session</p>
          <p className={`text-sm font-bold mt-0.5 ${t.text}`}>Revoke authorization and sign out</p>
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
};

// ─── FLEET SPECS VIEW ─────────────────────────────────────────────────────────
const FleetSpecsView: React.FC<{ onBack:()=>void; darkMode:boolean }> = ({ onBack, darkMode }) => {
  const t = mkTheme(darkMode);
  return (
    <div className="space-y-0 pb-12" style={{ fontFamily: MONO }}>
      <header className={`flex items-center justify-between border-b-2 ${t.border} pb-5`}>
        <h2 className={`text-4xl font-black uppercase tracking-tight ${t.text}`}>Fleet Intelligence</h2>
        <button onClick={onBack} className="px-5 py-3 bg-black text-white font-black text-[10px] uppercase tracking-widest hover:bg-[#0057FF] transition-colors">
          ← Back
        </button>
      </header>
      <p className={`text-xs ${t.textDim} uppercase tracking-widest py-4 border-b-2 ${t.border}`}>
        Aviation trade specifications and NCAA certification requirements.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {TRADE_INFO.map((info, idx) => (
          <div
            key={info.trade}
            className={`p-8 border-b-2 ${t.border} ${(idx+1)%3!==0?`lg:border-r-2 ${t.border}`:''} ${(idx+1)%2!==0?`sm:border-r-2 ${t.border} lg:border-r-0`:''} ${darkMode?'bg-[#111] hover:bg-[#1a1a1a]':'bg-white hover:bg-black hover:text-white'} transition-colors group`}
          >
            <div className={`w-12 h-12 border-2 ${t.border} group-hover:border-[#0057FF] flex items-center justify-center text-2xl mb-5`}>
              {info.icon}
            </div>
            <h3 className={`font-black text-base uppercase tracking-tight mb-1 ${t.text} group-hover:text-inherit`}>{info.trade}</h3>
            <p className={`text-[10px] ${t.textDim} uppercase tracking-widest`}>NCAA Certification Required</p>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── APP ──────────────────────────────────────────────────────────────────────
const App: React.FC = () => {
  const [view, setView]       = useState<View>('LANDING');
  const [questions, setQuestions] = useState<Question[]>(INITIAL_QUESTIONS);
  const [isOnline, setIsOnline]   = useState(navigator.onLine);
  const [user, setUser]           = useState<any>(null);
  const [currentTrade, setCurrentTrade] = useState<Trade | null>(null);
  const [session, setSession]     = useState<QuizSession | null>(null);
  const [stats, setStats]         = useState<UserStats>({ totalQuizzes:0, averageScore:0, bestTrade:null, history:[] });
  const [authMode, setAuthMode]   = useState<'LOGIN'|'REGISTER'>('LOGIN');
  const [authData, setAuthData]   = useState({ name:'', email:'', password:'' });
  const [authError, setAuthError] = useState('');

  // ── Dark mode — persisted ─────────────────────────────────────
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    try { return localStorage.getItem('ncaa_theme') === 'dark'; } catch { return false; }
  });
  const toggleDark = useCallback(() => {
    setDarkMode(prev => {
      const next = !prev;
      try { localStorage.setItem('ncaa_theme', next ? 'dark' : 'light'); } catch {}
      return next;
    });
  }, []);

  useEffect(() => {
    const handleOnline  = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online',  handleOnline);
    window.addEventListener('offline', handleOffline);
    const saved = localStorage.getItem('ncaa_user_data');
    if (saved) {
      try { const p = JSON.parse(saved); setUser(p); if (p.stats) setStats(p.stats); } catch {}
    }
    apiService.fetchQuestions().then(d => { if (d.length > 0) setQuestions(d); }).catch(() => {});
    return () => { window.removeEventListener('online', handleOnline); window.removeEventListener('offline', handleOffline); };
  }, []);

  const startQuiz = useCallback((trade: Trade, mode: QuizMode) => {
    if (!user) { alert('Login required.'); setView('AUTH'); return; }
    const tradeQs = questions.filter(q => q.trade === trade);
    if (tradeQs.length === 0) { alert('No questions found for this trade yet.'); return; }
    const shuffled = [...tradeQs].sort(() => Math.random() - 0.5).slice(0, 10);
    setSession({ trade, mode, questions: shuffled, currentQuestionIndex:0, userAnswers:{}, startTime: Date.now(), timeRemaining: mode === QuizMode.TIMED ? 600 : 0 });
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
      const score = prev.questions.reduce((acc, q) => acc + (prev.userAnswers[q.id] === q.correctAnswer ? 1 : 0), 0);
      if (user) {
        apiService.updateStats({ trade: prev.trade, score, total: prev.questions.length }).then(updatedStats => {
          if (updatedStats) {
            setStats(updatedStats);
            const upd = { ...user, stats: updatedStats };
            setUser(upd);
            localStorage.setItem('ncaa_user_data', JSON.stringify(upd));
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
    } else { finishQuiz(); }
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
    if (session?.mode === QuizMode.TIMED && session.timeRemaining === 0 && !session.endTime) finishQuiz();
  }, [session?.timeRemaining, session?.endTime, finishQuiz]);

  const handleAuth = useCallback(async (e: React.FormEvent) => {
    e.preventDefault(); setAuthError('');
    try {
      let data;
      if (authMode === 'LOGIN') data = await apiService.login({ email: authData.email, password: authData.password });
      else data = await apiService.register({ name: authData.name, email: authData.email, password: authData.password });
      setUser(data);
      if (data.stats) setStats(data.stats);
      setView('DASHBOARD');
    } catch (err: any) { setAuthError(err.message || 'Authentication failed'); }
  }, [authMode, authData]);

  const handleAbort = useCallback(() => {
    if (confirm('Abort mission? Progress will not be saved.')) setView('DASHBOARD');
  }, []);

  useEffect(() => {
    const protectedViews: View[] = ['DASHBOARD','QUIZ','RESULTS','REVIEW','PROFILE','ADMIN'];
    if (!user && protectedViews.includes(view)) setView('AUTH');
  }, [user, view]);

  return (
    <Layout currentView={view} setView={setView} user={user} darkMode={darkMode} toggleDark={toggleDark}>
      <OfflineBadge isOnline={isOnline} />
      {view === 'LANDING'       && <LandingView onEnter={() => setView('TRADE_SELECT')} onFleet={() => setView('FLEET_SPECS')} />}
      {view === 'AUTH'          && <AuthView authMode={authMode} setAuthMode={setAuthMode} authData={authData} setAuthData={setAuthData} authError={authError} onSubmit={handleAuth} darkMode={darkMode} />}
      {view === 'DASHBOARD'     && <DashboardView user={user} stats={stats} isOnline={isOnline} questions={questions} onScramble={() => startQuiz(Trade.SAFETY_HUMAN_FACTORS, QuizMode.TIMED)} darkMode={darkMode} />}
      {view === 'TRADE_SELECT'  && <TradeSelectView questions={questions} currentTrade={currentTrade} setCurrentTrade={setCurrentTrade} onStart={startQuiz} isLoggedIn={!!user} onRequireLogin={() => setView('AUTH')} darkMode={darkMode} />}
      {view === 'QUIZ'  && session && <QuizView session={session} onAnswer={handleAnswer} onNext={handleNextQuestion} onAbort={handleAbort} darkMode={darkMode} />}
      {view === 'RESULTS'       && <ResultsView session={session} onHome={() => setView('DASHBOARD')} onReview={() => setView('REVIEW')} onRetry={() => session && startQuiz(session.trade, session.mode)} darkMode={darkMode} />}
      {view === 'REVIEW'        && <ReviewView session={session} onClose={() => setView('DASHBOARD')} darkMode={darkMode} />}
      {view === 'ADMIN' && user?.role === 'admin' && <AdminView questions={questions} setQuestions={setQuestions} />}
      {view === 'PROFILE'       && <ProfileView user={user} stats={stats} darkMode={darkMode} />}
      {view === 'FLEET_SPECS'   && <FleetSpecsView onBack={() => setView('LANDING')} darkMode={darkMode} />}
    </Layout>
  );
};

export default App;
