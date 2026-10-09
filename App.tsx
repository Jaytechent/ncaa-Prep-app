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
  onForgot: () => void;
  darkMode: boolean;
}

const AuthView: React.FC<AuthViewProps> = ({
  authMode, setAuthMode, authData, setAuthData, authError, onSubmit, onForgot, darkMode,
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

          {authMode === 'LOGIN' && (
            <button
              type="button"
              onClick={onForgot}
              className={`w-full text-center mt-4 text-[10px] font-bold ${t.textMid} hover:text-[#0057FF] transition-colors uppercase tracking-widest`}
              style={{ fontFamily: MONO }}
            >
              Forgot your security pass? →
            </button>
          )}

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

// ─── FORGOT / RESET PASSWORD VIEWS ───────────────────────────────────────────
const AuthShell: React.FC<{ eyebrow: string; title: string; subtitle: string; darkMode: boolean; children: React.ReactNode }> = ({
  eyebrow, title, subtitle, darkMode, children,
}) => {
  const t = mkTheme(darkMode);
  const dm = darkMode;
  return (
    <div className={`min-h-screen ${t.page} flex items-center justify-center p-4`} style={{ fontFamily: MONO }}>
      <div className="w-full max-w-md relative z-10">
        <div className={`border-2 ${t.border} border-b-0 px-8 pt-6 pb-4 bg-black`}>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 bg-[#0057FF]" />
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.25em]">{eyebrow}</span>
          </div>
          <h2 className="text-2xl font-black text-white uppercase tracking-tight">{title}</h2>
          <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
        </div>
        <div className={`border-2 ${t.border} border-t-0 ${dm ? 'bg-[#111]' : 'bg-white'} p-8`}>{children}</div>
      </div>
    </div>
  );
};

const ForgotPasswordView: React.FC<{ onBack: () => void; darkMode: boolean }> = ({ onBack, darkMode }) => {
  const t = mkTheme(darkMode);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setMessage(''); setLoading(true);
    try { setMessage(await apiService.forgotPassword(email)); }
    catch (err: any) { setError(err.message || 'Something went wrong'); }
    finally { setLoading(false); }
  };

  return (
    <AuthShell eyebrow="Credential Recovery" title="Reset Security Pass" subtitle="We'll email you a secure reset link." darkMode={darkMode}>
      {error && <div className="border-2 border-black bg-black text-white p-4 text-xs font-bold mb-6">{error}</div>}
      {message && <div className="border-2 border-[#0057FF] text-[#0057FF] p-4 text-xs font-bold mb-6">{message}</div>}
      <form onSubmit={submit} className="flex flex-col">
        <label className={`text-[10px] font-black ${t.textMid} uppercase tracking-widest px-4 pt-3 pb-1 border-2 ${t.border} border-b-0 ${t.panel}`}>Aviation ID (Email)</label>
        <input
          type="email" required value={email} onChange={e => setEmail(e.target.value)}
          placeholder="name@airline.com"
          className={`border-2 ${t.border} px-4 py-3 text-sm ${t.input} focus:outline-none focus:bg-[#0d1f3c] transition-colors`}
          style={{ fontFamily: MONO }}
        />
        <button
          type="submit" disabled={loading}
          className="py-4 bg-[#0057FF] text-white font-black text-xs uppercase tracking-widest border-2 border-[#0057FF] hover:bg-black hover:border-black transition-colors mt-4 disabled:opacity-50"
          style={{ fontFamily: MONO }}
        >
          {loading ? 'Sending…' : 'Send Reset Link →'}
        </button>
      </form>
      <button
        onClick={onBack}
        className={`w-full text-center mt-4 pt-4 border-t ${t.border} text-[10px] font-bold ${t.textMid} hover:text-[#0057FF] transition-colors uppercase tracking-widest`}
        style={{ fontFamily: MONO }}
      >
        ← Back to Login
      </button>
    </AuthShell>
  );
};

const ResetPasswordView: React.FC<{ token: string; onDone: () => void; darkMode: boolean }> = ({ token, onDone, darkMode }) => {
  const t = mkTheme(darkMode);
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (password.length < 6) return setError('Password must be at least 6 characters');
    if (password !== confirm) return setError('Passwords do not match');
    setLoading(true);
    try {
      setMessage(await apiService.resetPassword(token, password));
      setTimeout(onDone, 2000);
    } catch (err: any) { setError(err.message || 'Reset failed'); }
    finally { setLoading(false); }
  };

  const field = `border-2 ${t.border} px-4 py-3 text-sm ${t.input} focus:outline-none focus:bg-[#0d1f3c] transition-colors`;
  const label = `text-[10px] font-black ${t.textMid} uppercase tracking-widest px-4 pt-3 pb-1 border-2 ${t.border} border-b-0 ${t.panel}`;

  return (
    <AuthShell eyebrow="Credential Recovery" title="New Security Pass" subtitle="Choose a new password for your account." darkMode={darkMode}>
      {error && <div className="border-2 border-black bg-black text-white p-4 text-xs font-bold mb-6">{error}</div>}
      {message && <div className="border-2 border-[#0057FF] text-[#0057FF] p-4 text-xs font-bold mb-6">{message} Redirecting to login…</div>}
      {!message && (
        <form onSubmit={submit} className="flex flex-col">
          <label className={label}>New Password</label>
          <input type="password" required value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" className={`${field} border-b-0`} style={{ fontFamily: MONO }} />
          <label className={label}>Confirm Password</label>
          <input type="password" required value={confirm} onChange={e => setConfirm(e.target.value)} placeholder="••••••••" className={field} style={{ fontFamily: MONO }} />
          <button
            type="submit" disabled={loading}
            className="py-4 bg-[#0057FF] text-white font-black text-xs uppercase tracking-widest border-2 border-[#0057FF] hover:bg-black hover:border-black transition-colors mt-4 disabled:opacity-50"
            style={{ fontFamily: MONO }}
          >
            {loading ? 'Saving…' : 'Set New Password →'}
          </button>
        </form>
      )}
    </AuthShell>
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
  const [resetToken, setResetToken] = useState('');

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

  // Arriving from the reset email: /?reset_token=...
  useEffect(() => {
    const token = new URLSearchParams(window.location.search).get('reset_token');
    if (token) {
      setResetToken(token);
      setView('RESET_PASSWORD');
      window.history.replaceState({}, '', window.location.pathname); // keep token out of the address bar
    }
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
      {view === 'AUTH'          && <AuthView authMode={authMode} setAuthMode={setAuthMode} authData={authData} setAuthData={setAuthData} authError={authError} onSubmit={handleAuth} onForgot={() => { setAuthError(''); setView('FORGOT_PASSWORD'); }} darkMode={darkMode} />}
      {view === 'FORGOT_PASSWORD' && <ForgotPasswordView onBack={() => { setAuthMode('LOGIN'); setView('AUTH'); }} darkMode={darkMode} />}
      {view === 'RESET_PASSWORD'  && <ResetPasswordView token={resetToken} onDone={() => { setAuthMode('LOGIN'); setView('AUTH'); }} darkMode={darkMode} />}
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

// import React, { useState, useEffect, useCallback } from 'react';
// import { Trade, QuizMode, Question, QuizSession, UserStats, View } from './types';
// import { INITIAL_QUESTIONS, TRADE_INFO } from './constants';
// import { Layout } from './components/Layout';
// import { AdminView } from './components/AdminView';
// import { apiService } from './services/apiService';

// // ─── OFFLINE BADGE ─────────────────────────────────────────────────────────
// const OfflineBadge: React.FC<{ isOnline: boolean }> = ({ isOnline }) => (
//   <div
//     className={`fixed top-4 left-1/2 -translate-x-1/2 z-[100] px-4 py-1.5 rounded-full border text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-lg backdrop-blur-md transition-all ${
//       isOnline
//         ? 'bg-green-500/10 border-green-500/30 text-green-500'
//         : 'bg-orange-500/10 border-orange-500/30 text-orange-500 animate-pulse'
//     }`}
//   >
//     <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500' : 'bg-orange-500'}`} />
//     {isOnline ? 'Cloud Sync Online' : 'Local Offline Mode Active'}
//   </div>
// );

// // ─── LANDING ────────────────────────────────────────────────────────────────

// const AgustaW109Nigerian = () => (
//   <svg viewBox="0 0 620 240" xmlns="http://www.w3.org/2000/svg" role="presentation" aria-hidden="true">
//     <defs>
//       {/* Main fuselage gradient - deep Nigerian green */}
//       <linearGradient id="body-grad" x1="0%" y1="0%" x2="0%" y2="100%">
//         <stop offset="0%" stopColor="#1a7a1a" />
//         <stop offset="40%" stopColor="#006400" />
//         <stop offset="100%" stopColor="#003d00" />
//       </linearGradient>
//       {/* Lighter green for top panels */}
//       <linearGradient id="top-grad" x1="0%" y1="0%" x2="0%" y2="100%">
//         <stop offset="0%" stopColor="#2a9a2a" />
//         <stop offset="100%" stopColor="#006400" />
//       </linearGradient>
//       {/* Cockpit glass */}
//       <linearGradient id="glass-grad" x1="0%" y1="0%" x2="100%" y2="100%">
//         <stop offset="0%" stopColor="#7dd3fc" stopOpacity="0.95" />
//         <stop offset="50%" stopColor="#0ea5e9" stopOpacity="0.85" />
//         <stop offset="100%" stopColor="#0369a1" stopOpacity="0.9" />
//       </linearGradient>
//       {/* Gold accent */}
//       <linearGradient id="gold-grad" x1="0%" y1="0%" x2="0%" y2="100%">
//         <stop offset="0%" stopColor="#fbbf24" />
//         <stop offset="100%" stopColor="#d97706" />
//       </linearGradient>
//       {/* Engine pod */}
//       <linearGradient id="engine-grad" x1="0%" y1="0%" x2="0%" y2="100%">
//         <stop offset="0%" stopColor="#374151" />
//         <stop offset="50%" stopColor="#1f2937" />
//         <stop offset="100%" stopColor="#111827" />
//       </linearGradient>
//       {/* Tail boom */}
//       <linearGradient id="tail-grad" x1="0%" y1="0%" x2="100%" y2="0%">
//         <stop offset="0%" stopColor="#006400" />
//         <stop offset="70%" stopColor="#004d00" />
//         <stop offset="100%" stopColor="#002800" />
//       </linearGradient>
//       {/* Skid shadow */}
//       <linearGradient id="skid-grad" x1="0%" y1="0%" x2="0%" y2="100%">
//         <stop offset="0%" stopColor="#9ca3af" />
//         <stop offset="100%" stopColor="#4b5563" />
//       </linearGradient>
//     </defs>

//     {/* ── TAIL BOOM ──────────────────────────────────────────── */}
//     <path
//       d="M390 102 L560 88 Q585 87 595 95 Q598 100 592 108 Q586 114 560 114 L390 118 Z"
//       fill="url(#tail-grad)"
//       stroke="#002800" strokeWidth="1"
//     />
//     {/* Tail boom detail stripe - white */}
//     <path
//       d="M420 105 L555 93 L558 98 L422 110 Z"
//       fill="white" opacity="0.3"
//     />

//     {/* ── HORIZONTAL STABILIZER ─────────────────────────────── */}
//     <path d="M540 88 L575 68 L585 70 L565 90 Z" fill="#005000" stroke="#002800" strokeWidth="1" />
//     <path d="M540 114 L575 134 L585 132 L565 112 Z" fill="#005000" stroke="#002800" strokeWidth="1" />

//     {/* ── TAIL ROTOR MOUNT ──────────────────────────────────── */}
//     <ellipse cx="590" cy="101" rx="9" ry="9" fill="#1f2937" stroke="#374151" strokeWidth="1.5" />
//     {/* Tail rotor blades */}
//     <g className="rotor-tail">
//       <rect x="576" y="99" width="28" height="4" rx="2" fill="#d1d5db" />
//       <rect x="588" y="87" width="4" height="28" rx="2" fill="#d1d5db" />
//     </g>

//     {/* ── MAIN FUSELAGE BODY ─────────────────────────────────── */}
//     {/* Lower belly */}
//     <path
//       d="M130 148 L360 148 Q400 148 410 138 L390 118 L390 102 L410 82 Q400 72 360 72 L130 72 Q80 72 55 90 Q30 108 30 110 Q30 120 55 130 Q80 148 130 148 Z"
//       fill="url(#body-grad)"
//       stroke="#002800" strokeWidth="1.5"
//     />

//     {/* ── NIGERIAN FLAG STRIPE (green-white-green on fuselage) ── */}
//     {/* White center stripe */}
//     <path
//       d="M150 72 L350 72 L350 148 L150 148 Z"
//       fill="white" opacity="0.12"
//     />
//     {/* Green left stripe */}
//     <path
//       d="M130 74 L195 74 L195 146 L130 146 Q90 143 65 128 L65 92 Q90 77 130 74 Z"
//       fill="#006400" opacity="0.9"
//     />
//     {/* White band */}
//     <path
//       d="M195 74 L240 74 L240 146 L195 146 Z"
//       fill="white" opacity="0.85"
//     />
//     {/* Green center */}
//     <path
//       d="M240 74 L310 74 L310 146 L240 146 Z"
//       fill="#006400" opacity="0.9"
//     />
//     {/* White band 2 */}
//     <path
//       d="M310 74 L355 74 L355 146 L310 146 Z"
//       fill="white" opacity="0.85"
//     />
//     {/* Green right */}
//     <path
//       d="M355 74 L390 80 L390 120 L355 146 Z"
//       fill="#006400" opacity="0.9"
//     />

//     {/* ── TOP FUSELAGE PANELS ────────────────────────────────── */}
//     <path
//       d="M140 72 L370 72 L380 62 L380 58 L140 58 Q100 58 75 68 L75 72 Z"
//       fill="url(#top-grad)"
//       stroke="#002800" strokeWidth="1"
//     />

//     {/* ── GOLD ACCENT STRIPE (top of fuselage) ─────────────── */}
//     <path
//       d="M120 58 L380 58 L382 54 L118 54 Z"
//       fill="url(#gold-grad)"
//       opacity="0.9"
//     />

//     {/* ── ENGINE PODS (twin turboshaft on top) ──────────────── */}
//     <rect x="180" y="40" width="90" height="22" rx="8" fill="url(#engine-grad)" stroke="#374151" strokeWidth="1.5" />
//     <rect x="280" y="40" width="90" height="22" rx="8" fill="url(#engine-grad)" stroke="#374151" strokeWidth="1.5" />
//     {/* Engine exhausts */}
//     <ellipse cx="268" cy="46" rx="7" ry="5" fill="#1f2937" stroke="#6b7280" strokeWidth="1" />
//     <ellipse cx="368" cy="46" rx="7" ry="5" fill="#1f2937" stroke="#6b7280" strokeWidth="1" />
//     {/* Exhaust glow */}
//     <ellipse cx="268" cy="46" rx="4" ry="3" fill="#f97316" opacity="0.6" />
//     <ellipse cx="368" cy="46" rx="4" ry="3" fill="#f97316" opacity="0.6" />
//     {/* Engine intake grill detail */}
//     <line x1="195" y1="44" x2="195" y2="58" stroke="#6b7280" strokeWidth="1" />
//     <line x1="205" y1="44" x2="205" y2="58" stroke="#6b7280" strokeWidth="1" />
//     <line x1="215" y1="44" x2="215" y2="58" stroke="#6b7280" strokeWidth="1" />
//     <line x1="295" y1="44" x2="295" y2="58" stroke="#6b7280" strokeWidth="1" />
//     <line x1="305" y1="44" x2="305" y2="58" stroke="#6b7280" strokeWidth="1" />
//     <line x1="315" y1="44" x2="315" y2="58" stroke="#6b7280" strokeWidth="1" />

//     {/* ── MAIN ROTOR MAST ────────────────────────────────────── */}
//     <rect x="270" y="22" width="12" height="22" rx="3" fill="#374151" stroke="#6b7280" strokeWidth="1" />
//     <ellipse cx="276" cy="22" rx="10" ry="5" fill="#4b5563" />

//     {/* ── MAIN ROTOR BLADES ─────────────────────────────────── */}
//     <g className="rotor-main" style={{ transformOrigin: '276px 20px' }}>
//       {/* Blade 1 - right */}
//       <path d="M276 20 L560 10 L558 30 L276 20 Z" fill="#1f2937" stroke="#374151" strokeWidth="0.5" />
//       {/* Blade 2 - left */}
//       <path d="M276 20 L-8 10 L-6 30 L276 20 Z" fill="#1f2937" stroke="#374151" strokeWidth="0.5" />
//       {/* Blade 3 - forward */}
//       <path d="M276 20 L278 -270 L298 -268 L276 20 Z" fill="#374151" stroke="#4b5563" strokeWidth="0.5" />
//       {/* Hub */}
//       <circle cx="276" cy="20" r="10" fill="#6b7280" stroke="#9ca3af" strokeWidth="1.5" />
//       <circle cx="276" cy="20" r="5" fill="#374151" />
//     </g>

//     {/* ── NOSE / COCKPIT ────────────────────────────────────── */}
//     {/* Nose cone - gold */}
//     <path
//       d="M130 72 Q80 72 55 90 Q30 108 30 110 Q30 120 55 130 Q80 148 130 148 L140 148 L140 72 Z"
//       fill="url(#gold-grad)"
//       stroke="#d97706" strokeWidth="1.5"
//     />
//     {/* Nose tip */}
//     <path
//       d="M55 90 Q30 108 30 110 Q30 120 55 130 L65 128 Q50 115 50 110 Q50 105 65 92 Z"
//       fill="#d97706"
//     />

//     {/* Cockpit windows - large and blue */}
//     {/* Left pilot window */}
//     <path
//       d="M80 80 Q68 82 64 95 Q62 103 64 115 Q68 125 80 126 L128 124 L128 78 Z"
//       fill="url(#glass-grad)"
//       stroke="#0284c7" strokeWidth="1.5"
//       opacity="0.92"
//     />
//     {/* Right pilot window */}
//     <path
//       d="M128 78 L140 78 L140 122 L128 122 Z"
//       fill="url(#glass-grad)"
//       stroke="#0284c7" strokeWidth="1"
//       opacity="0.88"
//     />
//     {/* Window frame */}
//     <path
//       d="M80 80 Q68 82 64 95 Q62 103 64 115 Q68 125 80 126 L128 124 L128 78 Z"
//       fill="none"
//       stroke="#fed7aa" strokeWidth="2"
//     />
//     {/* Glare highlight */}
//     <path
//       d="M72 85 Q66 88 66 96 L72 95 Z"
//       fill="white" opacity="0.4"
//     />

//     {/* Cabin windows (passenger) */}
//     <rect x="158" y="84" width="38" height="30" rx="6" fill="url(#glass-grad)" stroke="#0284c7" strokeWidth="1.5" opacity="0.85" />
//     <rect x="210" y="84" width="38" height="30" rx="6" fill="url(#glass-grad)" stroke="#0284c7" strokeWidth="1.5" opacity="0.85" />
//     <rect x="262" y="84" width="38" height="30" rx="6" fill="url(#glass-grad)" stroke="#0284c7" strokeWidth="1.5" opacity="0.85" />
//     {/* Cabin window glare */}
//     <rect x="160" y="86" width="12" height="8" rx="3" fill="white" opacity="0.3" />
//     <rect x="212" y="86" width="12" height="8" rx="3" fill="white" opacity="0.3" />
//     <rect x="264" y="86" width="12" height="8" rx="3" fill="white" opacity="0.3" />

//     {/* ── REGISTRATION TEXT ──────────────────────────────────── */}
//     <text
//       x="220" y="142"
//       fontFamily="monospace" fontWeight="bold" fontSize="11"
//       fill="#1a1a1a" opacity="0.9"
//       textAnchor="middle"
//     >5N-NCA</text>

//     {/* ── BELLY DETAIL ──────────────────────────────────────── */}
//     <path d="M160 148 L350 148 L352 154 L158 154 Z" fill="#003d00" opacity="0.6" />

//     {/* ── LANDING SKIDS ─────────────────────────────────────── */}
//     {/* Front skid strut */}
//     <line x1="148" y1="148" x2="138" y2="185" stroke="url(#skid-grad)" strokeWidth="5" strokeLinecap="round" />
//     {/* Rear skid strut */}
//     <line x1="340" y1="148" x2="350" y2="185" stroke="url(#skid-grad)" strokeWidth="5" strokeLinecap="round" />
//     {/* Front cross strut */}
//     <line x1="110" y1="175" x2="175" y2="175" stroke="#6b7280" strokeWidth="3.5" strokeLinecap="round" />
//     {/* Rear cross strut */}
//     <line x1="320" y1="185" x2="385" y2="185" stroke="#6b7280" strokeWidth="3.5" strokeLinecap="round" />
//     {/* Front skid rail */}
//     <path d="M85 185 Q100 190 175 185 Q190 182 195 178" fill="none" stroke="url(#skid-grad)" strokeWidth="5" strokeLinecap="round" />
//     {/* Rear skid rail */}
//     <path d="M300 180 Q340 188 410 182 Q420 178 425 174" fill="none" stroke="url(#skid-grad)" strokeWidth="5" strokeLinecap="round" />

//     {/* ── RUNNING LIGHTS ────────────────────────────────────── */}
//     {/* Nav light red - left */}
//     <circle cx="40" cy="110" r="5" fill="#ef4444" opacity="0.9" />
//     <circle cx="40" cy="110" r="8" fill="#ef4444" opacity="0.2" />
//     {/* Anti-collision beacon - top */}
//     <circle cx="276" cy="15" r="4" fill="#fbbf24" opacity="0.95" />
//     <circle cx="276" cy="15" r="7" fill="#fbbf24" opacity="0.2" />
//     {/* Tail position light */}
//     <circle cx="596" cy="101" r="3" fill="#60a5fa" opacity="0.9" />

//     {/* ── NIGERIAN COAT OF ARMS (simplified eagle emblem) ───── */}
//     <g transform="translate(172, 95)" opacity="0.7">
//       <circle cx="8" cy="8" r="7" fill="#fbbf24" />
//       <text x="8" y="12" textAnchor="middle" fontSize="9" fill="#006400" fontWeight="bold">✦</text>
//     </g>

//     {/* ── DOOR PANEL LINES ──────────────────────────────────── */}
//     <line x1="152" y1="75" x2="152" y2="146" stroke="#002800" strokeWidth="1" opacity="0.5" />
//     <line x1="202" y1="75" x2="202" y2="146" stroke="#002800" strokeWidth="0.8" opacity="0.4" />
//     <line x1="302" y1="75" x2="302" y2="146" stroke="#002800" strokeWidth="0.8" opacity="0.4" />

//     {/* ── PITOT TUBE ────────────────────────────────────────── */}
//     <line x1="30" y1="108" x2="8" y2="106" stroke="#9ca3af" strokeWidth="2" />
//     <circle cx="8" cy="106" r="2" fill="#9ca3af" />
//   </svg>
// );

// // ─── LANDING VIEW ────────────────────────────────────────────────────────────
// const LandingView: React.FC<{ onEnter: () => void; onFleet: () => void }> = ({ onEnter, onFleet }) => {
//   const missionTracks = [
//     { title: 'Pilot Ground School', details: 'IFR procedures, abnormal checklist drills, and recurrent checkride prep.' },
//     { title: 'Maintenance Certification', details: 'AMM-driven troubleshooting flows, MEL decisions, and release-to-service scenarios.' },
//     { title: 'Operations Control', details: 'Dispatch release planning, ATC phraseology, and weather-risk decision exercises.' },
//   ];

//   const metrics = [
//     { label: 'Scenario Library', value: '1,200+' },
//     { label: 'Active Cadets', value: '8.4K' },
//     { label: 'Avg Readiness Gain', value: '+32%' },
//     { label: 'Mission Uptime', value: '99.9%' },
//   ];

//   const operations = [
//     {
//       title: 'Adaptive Mission Engine',
//       copy: 'Each quiz path adjusts in real time based on your response confidence and weak areas.',
//     },
//     {
//       title: 'Command Analytics',
//       copy: 'Live heatmaps show where your crew loses points so revision time stays tactical.',
//     },
//     {
//       title: 'Offline-First Field Mode',
//       copy: 'Continue training with local persistence, then sync back once internet is restored.',
//     },
//   ];

//   return (
//     <div className="bg-[#020617] text-white relative overflow-x-hidden">
//       <div className="fixed inset-0 pointer-events-none z-0">
//         <div className="battle-grid" />
//         <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(14,116,255,0.26),transparent_40%),radial-gradient(circle_at_80%_20%,rgba(16,185,129,0.2),transparent_36%),radial-gradient(circle_at_50%_85%,rgba(251,191,36,0.16),transparent_45%)]" />
//         <div className="battle-pulse battle-pulse-a" />
//         <div className="battle-pulse battle-pulse-b" />
//       </div>

//       <section className="min-h-screen relative z-10 px-6 pt-28 pb-20 flex items-center">
//         <div className="max-w-6xl mx-auto w-full grid lg:grid-cols-2 gap-14 items-center">
//           <div>
//             <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-blue-400/40 bg-blue-500/10 text-xs font-black uppercase tracking-[0.2em] text-blue-300 mb-6">
//               <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping" />
//               Mission Command Portal
//             </div>
//             <h1 className="text-5xl md:text-7xl font-black leading-[0.92] tracking-tight mb-6">
//               Train Like
//               <span className="block text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-200 to-emerald-300">
//                 Flight Operations
//               </span>
//             </h1>
//             <p className="text-slate-300 text-lg leading-relaxed max-w-xl mb-9">
//               NCAA Prep is an aviation exam-readiness platform for pilots, engineers, dispatchers, cabin crew, and ATC trainees.
//               Build knowledge with role-specific question banks, timed assessments, and post-flight debrief analytics.
//             </p>
//             <div className="flex flex-col sm:flex-row gap-4">
//               <button
//                 onClick={onEnter}
//                 className="px-8 py-4 rounded-xl font-black tracking-wide bg-blue-600 hover:bg-blue-500 transition-all shadow-[0_0_40px_rgba(37,99,235,0.4)]"
//               >
//                  COURSE CATALOG
//               </button>
//               <button
//                 onClick={onFleet}
//                 className="px-8 py-4 rounded-xl font-black tracking-wide border border-slate-500/60 bg-slate-900/50 hover:bg-slate-800/80 transition-all"
//               >
//                 MISSION OVERVIEW
//               </button>
//             </div>
//           </div>

//           <div className="relative">
//             <div className="agusta-landing-wrapper" aria-hidden="true">
//               <div className="agusta-shadow-right" />
//               <div className="agusta-shadow-left" />
//               <div className="agusta-helicopter agusta-helicopter-right">
//                 <AgustaW109Nigerian />
//               </div>
//               <div className="agusta-helicopter agusta-helicopter-left">
//                 <AgustaW109Nigerian />
//               </div>
//             </div>
//             <div className="relative min-h-[440px] rounded-3xl border border-white/10 bg-slate-950/40 backdrop-blur-sm overflow-hidden" />
//           </div>
//         </div>
//       </section>

//       <section className="relative z-10 px-6 py-20 border-y border-white/10 bg-slate-950/50">
//         <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
//           {metrics.map(metric => (
//             <div key={metric.label} className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
//               <p className="text-xs uppercase tracking-widest text-slate-400 font-bold">{metric.label}</p>
//               <p className="text-3xl md:text-4xl font-black mt-3 text-white">{metric.value}</p>
//             </div>
//           ))}
//         </div>
//       </section>

//       <section className="relative z-10 px-6 py-24">
//         <div className="max-w-6xl mx-auto">
//           <h2 className="text-4xl md:text-5xl font-black mb-4">Mission Tracks</h2>
//           <p className="text-slate-300 max-w-2xl mb-10">Structured pathways designed to mirror real aviation pressure and cadence.</p>
//           <div className="grid md:grid-cols-3 gap-6">
//             {missionTracks.map(track => (
//               <article key={track.title} className="rounded-3xl border border-white/10 bg-gradient-to-b from-white/10 to-white/0 p-7 hover:-translate-y-1 transition-transform">
//                 <div className="w-10 h-10 rounded-lg bg-blue-500/20 border border-blue-300/30 mb-4" />
//                 <h3 className="text-xl font-black mb-3">{track.title}</h3>
//                 <p className="text-slate-300 leading-relaxed">{track.details}</p>
//               </article>
//             ))}
//           </div>
//         </div>
//       </section>

//       <section className="relative z-10 px-6 py-24 bg-slate-900/50 border-y border-white/10">
//         <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-8 items-start">
//           <div>
//             <h2 className="text-4xl md:text-5xl font-black mb-4">Training Operations</h2>
//             <p className="text-slate-300 leading-relaxed max-w-xl">
//               Every module is built for NCAA-style aviation certification prep with realistic operational pressure
//               and role-specific performance feedback.
//             </p>
//           </div>
//           <div className="space-y-4">
//             {operations.map((item, idx) => (
//               <div key={item.title} className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
//                 <p className="text-xs uppercase tracking-[0.2em] text-blue-300 font-black mb-2">0{idx + 1}</p>
//                 <h3 className="text-2xl font-black mb-2">{item.title}</h3>
//                 <p className="text-slate-300">{item.copy}</p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       <section className="relative z-10 px-6 pt-24 pb-32">
//         <div className="max-w-6xl mx-auto rounded-3xl border border-white/10 bg-gradient-to-r from-blue-900/50 via-slate-900/70 to-emerald-900/40 p-10 md:p-14 text-center">
//           <p className="text-xs uppercase tracking-[0.25em] text-blue-200 font-black mb-4">Final Call</p>
//           <h2 className="text-4xl md:text-5xl font-black mb-5">Ready for your next certification sortie?</h2>
//           <p className="text-slate-200 max-w-2xl mx-auto mb-8">
//             Browse course sectors now, then sign in to launch graded practice or timed check assessments.
//           </p>
//           <div className="flex flex-col sm:flex-row justify-center gap-4">
//             <button onClick={onEnter} className="px-8 py-4 rounded-xl font-black bg-white text-slate-900 hover:bg-blue-100 transition-all">
//               VIEW COURSES
//             </button>
//             <button onClick={onFleet} className="px-8 py-4 rounded-xl font-black border border-white/40 hover:bg-white/10 transition-all">
//               OPEN ROLE BRIEFS
//             </button>
//           </div>
//         </div>
//       </section>
//     </div>
//   );
// };

// // ─── AUTH ───────────────────────────────────────────────────────────────────
// interface AuthViewProps {
//   authMode: 'LOGIN' | 'REGISTER';
//   setAuthMode: (m: 'LOGIN' | 'REGISTER') => void;
//   authData: { name: string; email: string; password: string };
//   setAuthData: React.Dispatch<React.SetStateAction<{ name: string; email: string; password: string }>>;
//   authError: string;
//   onSubmit: (e: React.FormEvent) => void;
//   onForgot: () => void;
// }
// const AuthView: React.FC<AuthViewProps> = ({
//   authMode, setAuthMode, authData, setAuthData, authError, onSubmit, onForgot, darkMode,
// })=> (
//   <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
//     <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent" />
//     <div className="w-full max-w-md bg-slate-900/90 backdrop-blur-xl p-10 rounded-[2rem] shadow-2xl border border-slate-800 relative z-10">
//       <div className="w-16 h-1 bg-blue-600 rounded-full mb-8 mx-auto" />
//       <h2 className="text-3xl font-black text-white mb-2 text-center uppercase tracking-tight">
//         {authMode === 'LOGIN' ? 'Identity Check' : 'Recruit Enrollment'}
//       </h2>
//       <p className="text-slate-500 mb-8 text-center font-medium">
//         Clearance required for professional modules.
//       </p>
//       {authError && (
//         <div className="bg-red-500/10 border border-red-500/30 text-red-500 p-4 rounded-xl text-xs font-bold mb-6 text-center">
//           {authError}
//         </div>
//       )}
//       <form onSubmit={onSubmit} className="space-y-5">
//         {authMode === 'REGISTER' && (
//           <div>
//             <label className="block text-xs font-black text-slate-400 mb-2 uppercase tracking-widest">
//               Full Name
//             </label>
//             <input
//               type="text"
//               required
//               value={authData.name}
//               onChange={e => setAuthData(prev => ({ ...prev, name: e.target.value }))}
//               className="w-full bg-slate-800/50 p-4 rounded-xl border border-slate-700 text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
//               placeholder="Captain Maverick"
//             />
//           </div>
//         )}
//         <div>
//           <label className="block text-xs font-black text-slate-400 mb-2 uppercase tracking-widest">
//             Aviation ID (Email)
//           </label>
//           <input
//             type="email"
//             required
//             value={authData.email}
//             onChange={e => setAuthData(prev => ({ ...prev, email: e.target.value }))}
//             placeholder="name@airline.com"
//             className="w-full bg-slate-800/50 p-4 rounded-xl border border-slate-700 text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
//           />
//         </div>
//         <div>
//           <label className="block text-xs font-black text-slate-400 mb-2 uppercase tracking-widest">
//             Security Pass
//           </label>
//           <input
//             type="password"
//             required
//             value={authData.password}
//             onChange={e => setAuthData(prev => ({ ...prev, password: e.target.value }))}
//             placeholder="••••••••"
//             className="w-full bg-slate-800/50 p-4 rounded-xl border border-slate-700 text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
//           />
//         </div>
//         <button
//           type="submit"
//           className="w-full py-5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-black uppercase tracking-widest transition-all mt-4 shadow-lg shadow-blue-600/20"
//         >
//           {authMode === 'LOGIN' ? 'Authorize Access' : 'Initialize Asset'}
//         </button>
//       </form>
//       <button
//         onClick={() => setAuthMode(authMode === 'LOGIN' ? 'REGISTER' : 'LOGIN')}
//         className="w-full text-center mt-6 text-xs text-slate-500 hover:text-white transition-colors"
//       >



//                 {authMode === 'LOGIN' && (
//             <button
//               type="button"
//               onClick={onForgot}
//               className={`w-full text-center mt-4 text-[10px] font-bold ${t.textMid} hover:text-[#0057FF] transition-colors uppercase tracking-widest`}
//               style={{ fontFamily: MONO }}
//             >
//               Forgot your security pass? →
//             </button>
//           )}
//           ? 'Need a clearance? Start Enrollment'
//           : 'Already registered? Login to Cockpit'
//       </button>
//     </div>
//   </div>
// );

// // ─── FORGOT / RESET PASSWORD VIEWS ───────────────────────────────────────────
// const AuthShell: React.FC<{ eyebrow: string; title: string; subtitle: string; darkMode: boolean; children: React.ReactNode }> = ({
//   eyebrow, title, subtitle, darkMode, children,
// }) => {
//   const t = mkTheme(darkMode);
//   const dm = darkMode;
//   return (
//     <div className={`min-h-screen ${t.page} flex items-center justify-center p-4`} style={{ fontFamily: MONO }}>
//       <div className="w-full max-w-md relative z-10">
//         <div className={`border-2 ${t.border} border-b-0 px-8 pt-6 pb-4 bg-black`}>
//           <div className="flex items-center gap-2 mb-1">
//             <span className="w-2 h-2 bg-[#0057FF]" />
//             <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.25em]">{eyebrow}</span>
//           </div>
//           <h2 className="text-2xl font-black text-white uppercase tracking-tight">{title}</h2>
//           <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
//         </div>
//         <div className={`border-2 ${t.border} border-t-0 ${dm ? 'bg-[#111]' : 'bg-white'} p-8`}>{children}</div>
//       </div>
//     </div>
//   );
// };

// const ForgotPasswordView: React.FC<{ onBack: () => void; darkMode: boolean }> = ({ onBack, darkMode }) => {
//   const t = mkTheme(darkMode);
//   const [email, setEmail] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState('');
//   const [error, setError] = useState('');

//   const submit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError(''); setMessage(''); setLoading(true);
//     try { setMessage(await apiService.forgotPassword(email)); }
//     catch (err: any) { setError(err.message || 'Something went wrong'); }
//     finally { setLoading(false); }
//   };

//   return (
//     <AuthShell eyebrow="Credential Recovery" title="Reset Security Pass" subtitle="We'll email you a secure reset link." darkMode={darkMode}>
//       {error && <div className="border-2 border-black bg-black text-white p-4 text-xs font-bold mb-6">{error}</div>}
//       {message && <div className="border-2 border-[#0057FF] text-[#0057FF] p-4 text-xs font-bold mb-6">{message}</div>}
//       <form onSubmit={submit} className="flex flex-col">
//         <label className={`text-[10px] font-black ${t.textMid} uppercase tracking-widest px-4 pt-3 pb-1 border-2 ${t.border} border-b-0 ${t.panel}`}>Aviation ID (Email)</label>
//         <input
//           type="email" required value={email} onChange={e => setEmail(e.target.value)}
//           placeholder="name@airline.com"
//           className={`border-2 ${t.border} px-4 py-3 text-sm ${t.input} focus:outline-none focus:bg-[#0d1f3c] transition-colors`}
//           style={{ fontFamily: MONO }}
//         />
//         <button
//           type="submit" disabled={loading}
//           className="py-4 bg-[#0057FF] text-white font-black text-xs uppercase tracking-widest border-2 border-[#0057FF] hover:bg-black hover:border-black transition-colors mt-4 disabled:opacity-50"
//           style={{ fontFamily: MONO }}
//         >
//           {loading ? 'Sending…' : 'Send Reset Link →'}
//         </button>
//       </form>
//       <button
//         onClick={onBack}
//         className={`w-full text-center mt-4 pt-4 border-t ${t.border} text-[10px] font-bold ${t.textMid} hover:text-[#0057FF] transition-colors uppercase tracking-widest`}
//         style={{ fontFamily: MONO }}
//       >
//         ← Back to Login
//       </button>
//     </AuthShell>
//   );
// };

// const ResetPasswordView: React.FC<{ token: string; onDone: () => void; darkMode: boolean }> = ({ token, onDone, darkMode }) => {
//   const t = mkTheme(darkMode);
//   const [password, setPassword] = useState('');
//   const [confirm, setConfirm] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState('');
//   const [error, setError] = useState('');

//   const submit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError('');
//     if (password.length < 6) return setError('Password must be at least 6 characters');
//     if (password !== confirm) return setError('Passwords do not match');
//     setLoading(true);
//     try {
//       setMessage(await apiService.resetPassword(token, password));
//       setTimeout(onDone, 2000);
//     } catch (err: any) { setError(err.message || 'Reset failed'); }
//     finally { setLoading(false); }
//   };

//   const field = `border-2 ${t.border} px-4 py-3 text-sm ${t.input} focus:outline-none focus:bg-[#0d1f3c] transition-colors`;
//   const label = `text-[10px] font-black ${t.textMid} uppercase tracking-widest px-4 pt-3 pb-1 border-2 ${t.border} border-b-0 ${t.panel}`;

//   return (
//     <AuthShell eyebrow="Credential Recovery" title="New Security Pass" subtitle="Choose a new password for your account." darkMode={darkMode}>
//       {error && <div className="border-2 border-black bg-black text-white p-4 text-xs font-bold mb-6">{error}</div>}
//       {message && <div className="border-2 border-[#0057FF] text-[#0057FF] p-4 text-xs font-bold mb-6">{message} Redirecting to login…</div>}
//       {!message && (
//         <form onSubmit={submit} className="flex flex-col">
//           <label className={label}>New Password</label>
//           <input type="password" required value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" className={`${field} border-b-0`} style={{ fontFamily: MONO }} />
//           <label className={label}>Confirm Password</label>
//           <input type="password" required value={confirm} onChange={e => setConfirm(e.target.value)} placeholder="••••••••" className={field} style={{ fontFamily: MONO }} />
//           <button
//             type="submit" disabled={loading}
//             className="py-4 bg-[#0057FF] text-white font-black text-xs uppercase tracking-widest border-2 border-[#0057FF] hover:bg-black hover:border-black transition-colors mt-4 disabled:opacity-50"
//             style={{ fontFamily: MONO }}
//           >
//             {loading ? 'Saving…' : 'Set New Password →'}
//           </button>
//         </form>
//       )}
//     </AuthShell>
//   );
// };
// // ─── DASHBOARD ──────────────────────────────────────────────────────────────
// interface DashboardViewProps {
//   user: any;
//   stats: UserStats;
//   isOnline: boolean;
//   questions: Question[];
//   onScramble: () => void;
// }
// const DashboardView: React.FC<DashboardViewProps> = ({
//   user, stats, isOnline, questions, onScramble,
// }) => (
//   <div className="space-y-8 pb-12">
//     <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
//       <div>
//         <div className="flex items-center gap-2 mb-1">
//           <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500' : 'bg-orange-500'}`} />
//           <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
//             Status: {isOnline ? 'Operational' : 'Standalone'}
//           </span>
//         </div>
//         <h2 className="text-4xl font-black text-slate-900 leading-none uppercase">
//           Commander {user?.name?.split(' ')[1] || user?.name || 'Asset'}
//         </h2>
//         <p className="text-slate-500 mt-2 font-medium">Readiness: {stats.averageScore}%</p>
//       </div>
//       <div className="bg-white p-2 rounded-xl border flex gap-4">
//         <div className="px-4 py-2 bg-blue-50 rounded-lg text-center">
//           <p className="text-[10px] font-black text-blue-400 uppercase">Flight Hours</p>
//           <p className="text-xl font-bold text-blue-900">{stats.totalQuizzes * 2}</p>
//         </div>
//         <div className="px-4 py-2 bg-yellow-50 rounded-lg text-center">
//           <p className="text-[10px] font-black text-yellow-600 uppercase">Cert Level</p>
//           <p className="text-xl font-bold text-yellow-900">
//             {stats.averageScore > 80 ? 'PRO-I' : 'CADET'}
//           </p>
//         </div>
//       </div>
//     </header>

//     <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//       <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
//         <p className="text-xs font-black text-slate-400 uppercase tracking-wider mb-3">Avg. Score</p>
//         <div className="flex items-end gap-2">
//           <span className="text-5xl font-black text-slate-900 tracking-tighter">{stats.averageScore}%</span>
//           {stats.averageScore > 0 && <span className="text-green-500 font-black text-sm mb-1.5">↑</span>}
//         </div>
//       </div>
//       <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
//         <p className="text-xs font-black text-slate-400 uppercase tracking-wider mb-3">Data Samples</p>
//         <div className="flex items-end gap-2">
//           <span className="text-5xl font-black text-slate-900 tracking-tighter">{questions.length}</span>
//           <span className="text-slate-400 font-bold text-xs mb-1.5">Live DB</span>
//         </div>
//       </div>
//       <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
//         <p className="text-xs font-black text-slate-400 uppercase tracking-wider mb-3">Missions</p>
//         <div className="flex items-end gap-2">
//           <span className="text-5xl font-black text-slate-900 tracking-tighter">{stats.totalQuizzes}</span>
//           <span className="text-blue-500 font-black text-xs mb-1.5">LOGGED</span>
//         </div>
//       </div>
//     </div>

//     <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//       <section>
//         <h3 className="font-black text-xl uppercase mb-6">Recent Sorties</h3>
//         <div className="space-y-4">
//           {stats.history.length > 0 ? (
//             stats.history.slice(0, 3).map((h, i) => (
//               <div key={i} className="flex items-center justify-between p-6 bg-white rounded-2xl border border-slate-100">
//                 <div className="flex items-center gap-4">
//                   <div
//                     className={`w-12 h-12 ${h.score / h.total >= 0.7 ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'} rounded-xl flex items-center justify-center font-black text-lg`}
//                   >
//                     {h.score}/{h.total}
//                   </div>
//                   <div>
//                     <p className="font-black text-slate-900 text-sm uppercase">{h.trade}</p>
//                     <p className="text-xs text-slate-400">{new Date(h.date).toLocaleDateString()}</p>
//                   </div>
//                 </div>
//                 <span className={`text-xs font-black px-3 py-1 rounded-full ${h.score / h.total >= 0.7 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
//                   {Math.round((h.score / h.total) * 100)}%
//                 </span>
//               </div>
//             ))
//           ) : (
//             <div className="p-8 bg-white rounded-2xl border border-slate-100 text-center text-slate-400">
//               <p className="text-3xl mb-2">🎯</p>
//               <p className="font-bold text-sm">No missions logged yet.</p>
//               <p className="text-xs mt-1">Complete a quiz to see your history.</p>
//             </div>
//           )}
//         </div>
//       </section>
//       <section className="bg-slate-950 rounded-3xl p-8 text-white flex flex-col justify-between">
//         <div>
//           <h3 className="font-black text-3xl mb-3 leading-tight uppercase">Emergency Briefing</h3>
//           <p className="text-slate-400 mb-8 max-w-sm font-medium leading-relaxed">
//             Simulated blitz assessment. Random trade, maximum difficulty.
//           </p>
//         </div>
//         <button
//           onClick={onScramble}
//           className="px-10 py-4 bg-white text-slate-950 font-black rounded-xl uppercase hover:bg-yellow-400 transition-all"
//         >
//           Scramble Now
//         </button>
//       </section>
//     </div>
//   </div>
// );

// // ─── QUIZ ────────────────────────────────────────────────────────────────────
// interface QuizViewProps {
//   session: QuizSession;
//   onAnswer: (questionId: string, answerId: string) => void;
//   onNext: () => void;
//   onAbort: () => void;
// }
// const QuizView: React.FC<QuizViewProps> = ({ session, onAnswer, onNext, onAbort }) => {
//   const q = session.questions[session.currentQuestionIndex];
//   const progress = ((session.currentQuestionIndex + 1) / session.questions.length) * 100;
//   const isAnswered = !!session.userAnswers[q.id];
//   const userChoice = session.userAnswers[q.id];

//   return (
//     <div className="max-w-4xl mx-auto space-y-8 pb-32">
//       <div className="flex items-center justify-between">
//         <div className="flex items-center gap-4">
//           <button
//             onClick={onAbort}
//             className="px-4 py-2 bg-slate-100 rounded-xl text-[10px] font-black text-slate-900 uppercase hover:bg-slate-200 transition-all"
//           >
//             ✕ Abort
//           </button>
//           <span className="text-[10px] font-black text-slate-400 uppercase">
//             Sector: <span className="text-blue-600">{session.trade}</span>
//           </span>
//         </div>
//         <div className="flex items-center gap-4">
//           <span className="text-xs font-black text-slate-400">
//             {session.currentQuestionIndex + 1} / {session.questions.length}
//           </span>
//           {session.mode === QuizMode.TIMED && (
//             <div className={`text-xl font-black tabular-nums ${session.timeRemaining < 60 ? 'text-red-600' : 'text-slate-700'}`}>
//               {Math.floor(session.timeRemaining / 60)}:
//               {(session.timeRemaining % 60).toString().padStart(2, '0')}
//             </div>
//           )}
//         </div>
//       </div>

//       <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
//         <div
//           className="h-full bg-blue-600 transition-all duration-700"
//           style={{ width: `${progress}%` }}
//         />
//       </div>

//       <div className="bg-white p-8 md:p-12 rounded-[2rem] shadow-xl border border-slate-100">
//         <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-10">{q.text}</h2>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           {q.options.map(opt => {
//             const isCorrect = opt.id === q.correctAnswer;
//             const isSelected = userChoice === opt.id;
//             let styles = 'border-slate-100 bg-white hover:border-blue-300';
//             if (isAnswered) {
//               if (isCorrect) styles = 'border-green-500 bg-green-50';
//               else if (isSelected) styles = 'border-red-500 bg-red-50';
//               else styles = 'opacity-40 border-slate-100 bg-white';
//             } else if (isSelected) {
//               styles = 'border-blue-600 bg-blue-50';
//             }
//             return (
//               <button
//                 key={opt.id}
//                 disabled={isAnswered}
//                 onClick={() => onAnswer(q.id, opt.id)}
//                 className={`w-full p-6 rounded-2xl border-2 text-left transition-all flex items-center gap-5 ${styles}`}
//               >
//                 <div
//                   className={`w-10 h-10 rounded-xl border-2 flex items-center justify-center font-black text-sm flex-shrink-0 ${isSelected ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-200 text-slate-400'}`}
//                 >
//                   {opt.id}
//                 </div>
//                 <span className="font-bold text-slate-700 leading-tight flex-1">{opt.text}</span>
//               </button>
//             );
//           })}
//         </div>
//         {isAnswered && (
//           <div
//             className={`mt-10 p-6 rounded-2xl border-2 ${userChoice === q.correctAnswer ? 'bg-green-50 border-green-100 text-green-800' : 'bg-red-50 border-red-100 text-red-800'}`}
//           >
//             <p className="font-black uppercase text-xs mb-2">
//               {userChoice === q.correctAnswer ? '✓ Verified' : '✗ Error Detected'}
//             </p>
//             <p className="text-sm font-medium leading-relaxed">{q.explanation}</p>
//           </div>
//         )}
//       </div>

//       <div className="flex justify-end">
//         <button
//           onClick={onNext}
//           disabled={!isAnswered}
//           className={`px-10 py-4 bg-slate-950 text-white rounded-xl font-black uppercase tracking-widest transition-all ${!isAnswered ? 'opacity-30 cursor-not-allowed' : 'hover:bg-blue-600'}`}
//         >
//           {session.currentQuestionIndex < session.questions.length - 1 ? 'Next Phase →' : 'Finalize Mission'}
//         </button>
//       </div>
//     </div>
//   );
// };

// // ─── TRADE SELECT ────────────────────────────────────────────────────────────
// interface TradeSelectViewProps {
//   questions: Question[];
//   currentTrade: Trade | null;
//   setCurrentTrade: (t: Trade) => void;
//   onStart: (trade: Trade, mode: QuizMode) => void;
//   isLoggedIn: boolean;
//   onRequireLogin: () => void;
// }
// const TradeSelectView: React.FC<TradeSelectViewProps> = ({
//   questions, currentTrade, setCurrentTrade, onStart, isLoggedIn, onRequireLogin,
// }) => (
//   <div className="space-y-10 pb-40">
//     <header>
//       <h2 className="text-4xl font-black uppercase">Training Sectors</h2>
//       <p className="text-slate-400 mt-2">Browse aviation courses by license path. Login is required to take any assessment.</p>
//     </header>
//     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//       {TRADE_INFO.map(info => {
//         const count = questions.filter(q => q.trade === info.trade).length;
//         return (
//           <div
//             key={info.trade}
//             onClick={() => setCurrentTrade(info.trade)}
//             className={`cursor-pointer p-8 rounded-[2rem] border-2 transition-all ${currentTrade === info.trade ? 'border-blue-600 bg-blue-50 shadow-lg' : 'border-slate-100 bg-white hover:border-slate-200 shadow-sm'}`}
//           >
//             <div className={`w-14 h-14 ${info.color} rounded-xl flex items-center justify-center text-3xl mb-6 shadow-md`}>
//               {info.icon}
//             </div>
//             <h3 className="font-black text-xl uppercase text-slate-900">{info.trade}</h3>
//             <p className={`text-xs font-bold mt-2 uppercase ${count > 0 ? 'text-slate-400' : 'text-red-400'}`}>
//               {count > 0 ? `${count} Question Briefs Loaded` : 'No Question Briefs Yet'}
//             </p>
//           </div>
//         );
//       })}
//     </div>
//     {currentTrade && (
//       <div className="fixed inset-x-0 bottom-0 p-6 bg-white/95 backdrop-blur-xl border-t z-50 shadow-2xl">
//         <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
//           <div>
//             <h3 className="text-xl font-black uppercase">{currentTrade}</h3>
//             <p className="text-slate-400 text-sm">
//               {questions.filter(q => q.trade === currentTrade).length} question briefs available
//             </p>
//           </div>
//           <div className="flex gap-4">
//             <button
//               onClick={() => (isLoggedIn ? onStart(currentTrade, QuizMode.PRACTICE) : onRequireLogin())}
//               className={`px-8 py-4 font-black rounded-xl uppercase transition-all ${isLoggedIn ? 'bg-slate-100 hover:bg-slate-200' : 'bg-slate-200 text-slate-500 hover:bg-slate-300'}`}
//             >
//               {isLoggedIn ? 'Practice Sortie' : 'Login to Fly'}
//             </button>
//             <button
//               onClick={() => (isLoggedIn ? onStart(currentTrade, QuizMode.TIMED) : onRequireLogin())}
//               className={`px-8 py-4 font-black rounded-xl uppercase shadow-lg transition-all ${isLoggedIn ? 'bg-blue-600 hover:bg-blue-500 text-white' : 'bg-blue-200 text-blue-800 hover:bg-blue-300'}`}
//             >
//               {isLoggedIn ? 'Checkride Timer ⏱' : 'Authenticate to Launch ⏱'}
//             </button>
//           </div>
//         </div>
//         {!isLoggedIn && (
//           <p className="max-w-4xl mx-auto mt-3 text-xs font-bold text-amber-700">
//             Guest mode allows course visibility only. Sign in to begin practice sorties or timed checkrides.
//           </p>
//         )}
//       </div>
//     )}
//   </div>
// );

// // ─── RESULTS ─────────────────────────────────────────────────────────────────
// interface ResultsViewProps {
//   session: QuizSession | null;
//   onHome: () => void;
//   onReview: () => void;
//   onRetry: () => void;
// }
// const ResultsView: React.FC<ResultsViewProps> = ({ session, onHome, onReview, onRetry }) => {
//   if (!session) return null;
//   const score = session.questions.reduce(
//     (acc, q) => acc + (session.userAnswers[q.id] === q.correctAnswer ? 1 : 0),
//     0
//   );
//   const pct = Math.round((score / session.questions.length) * 100);
//   const passed = pct >= 70;

//   return (
//     <div className="max-w-xl mx-auto py-20 text-center space-y-8">
//       <div className="bg-white p-12 rounded-[2rem] border shadow-xl">
//         <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 text-5xl ${passed ? 'bg-green-100' : 'bg-red-100'}`}>
//           {passed ? '🏆' : '📋'}
//         </div>
//         <h2 className="text-4xl font-black uppercase mb-2">{passed ? 'Mission Success' : 'Debrief Required'}</h2>
//         <p className="text-slate-400 mb-6">{session.trade}</p>

//         <div className="flex items-center justify-center gap-8 mb-8">
//           <div>
//             <p className="text-5xl font-black text-slate-900">{score}/{session.questions.length}</p>
//             <p className="text-xs font-black text-slate-400 uppercase mt-1">Correct</p>
//           </div>
//           <div className={`text-5xl font-black ${passed ? 'text-green-600' : 'text-red-600'}`}>
//             {pct}%
//           </div>
//         </div>

//         <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden mb-8">
//           <div
//             className={`h-full rounded-full transition-all ${passed ? 'bg-green-500' : 'bg-red-500'}`}
//             style={{ width: `${pct}%` }}
//           />
//         </div>

//         <div className="flex gap-3">
//           <button
//             onClick={onHome}
//             className="flex-1 px-6 py-4 bg-slate-100 hover:bg-slate-200 rounded-xl font-black uppercase transition-all"
//           >
//             Home
//           </button>
//           <button
//             onClick={onReview}
//             className="flex-1 px-6 py-4 bg-slate-950 hover:bg-blue-600 text-white rounded-xl font-black uppercase shadow-lg transition-all"
//           >
//             Review
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// // ─── REVIEW ──────────────────────────────────────────────────────────────────
// interface ReviewViewProps {
//   session: QuizSession | null;
//   onClose: () => void;
// }
// const ReviewView: React.FC<ReviewViewProps> = ({ session, onClose }) => (
//   <div className="space-y-10 pb-32 max-w-4xl mx-auto">
//     <header className="flex justify-between items-center">
//       <h2 className="text-3xl font-black uppercase">Post-Flight Analysis</h2>
//       <button
//         onClick={onClose}
//         className="px-6 py-3 bg-slate-900 hover:bg-blue-600 text-white rounded-xl font-black text-xs uppercase transition-all"
//       >
//         Close
//       </button>
//     </header>
//     <div className="space-y-6">
//       {session?.questions.map((q, idx) => {
//         const userAns = session.userAnswers[q.id];
//         const isCorrect = userAns === q.correctAnswer;
//         return (
//           <div
//             key={q.id}
//             className={`p-8 rounded-[2rem] border-2 bg-white ${isCorrect ? 'border-green-100' : 'border-red-100'}`}
//           >
//             <div className="flex items-start gap-4 mb-6">
//               <div
//                 className={`w-10 h-10 rounded-xl flex items-center justify-center font-black flex-shrink-0 ${isCorrect ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}
//               >
//                 {idx + 1}
//               </div>
//               <h4 className="text-xl font-bold pt-1 leading-snug">{q.text}</h4>
//             </div>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
//               {q.options.map(opt => (
//                 <div
//                   key={opt.id}
//                   className={`p-4 rounded-xl border text-sm font-bold flex items-center gap-3 ${opt.id === q.correctAnswer ? 'bg-green-50 border-green-200 text-green-900' : opt.id === userAns ? 'bg-red-50 border-red-200 text-red-900' : 'bg-slate-50 border-transparent text-slate-400 opacity-60'}`}
//                 >
//                   <span className="w-6 h-6 rounded flex items-center justify-center border border-current flex-shrink-0">
//                     {opt.id}
//                   </span>
//                   {opt.text}
//                 </div>
//               ))}
//             </div>
//             <div className="p-6 rounded-2xl bg-slate-900 text-white text-sm font-medium leading-relaxed">
//               <p className="text-[10px] font-black text-slate-400 uppercase mb-2">Explanation</p>
//               {q.explanation}
//             </div>
//           </div>
//         );
//       })}
//     </div>
//   </div>
// );

// // ─── PROFILE ─────────────────────────────────────────────────────────────────
// interface ProfileViewProps {
//   user: any;
//   stats: UserStats;
// }
// const ProfileView: React.FC<ProfileViewProps> = ({ user, stats }) => (
//   <div className="max-w-2xl mx-auto py-10 text-center space-y-8">
//     <div className="w-28 h-28 rounded-full border-4 border-blue-600 mx-auto flex items-center justify-center text-5xl bg-blue-50 font-black text-blue-400">
//       {user?.name?.[0]?.toUpperCase() || 'A'}
//     </div>
//     <div>
//       <h2 className="text-3xl font-black uppercase text-slate-900">{user?.name || 'Asset'}</h2>
//       <p className="text-slate-400 text-sm mt-1">{user?.email}</p>
//       <span className={`inline-block mt-2 text-xs font-black px-3 py-1 rounded-full uppercase ${user?.role === 'admin' ? 'bg-yellow-100 text-yellow-700' : 'bg-blue-100 text-blue-700'}`}>
//         {user?.role || 'user'}
//       </span>
//     </div>
//     <div className="grid grid-cols-2 gap-4">
//       <div className="bg-white p-6 rounded-2xl border shadow-sm">
//         <p className="text-[10px] font-black text-blue-400 uppercase">Avg Score</p>
//         <p className="text-3xl font-black mt-1">{stats.averageScore}%</p>
//       </div>
//       <div className="bg-white p-6 rounded-2xl border shadow-sm">
//         <p className="text-[10px] font-black text-indigo-400 uppercase">Missions</p>
//         <p className="text-3xl font-black mt-1">{stats.totalQuizzes}</p>
//       </div>
//       <div className="bg-white p-6 rounded-2xl border shadow-sm">
//         <p className="text-[10px] font-black text-green-400 uppercase">Flight Hours</p>
//         <p className="text-3xl font-black mt-1">{stats.totalQuizzes * 2}</p>
//       </div>
//       <div className="bg-white p-6 rounded-2xl border shadow-sm">
//         <p className="text-[10px] font-black text-yellow-500 uppercase">Cert Level</p>
//         <p className="text-xl font-black mt-1 text-yellow-600">
//           {stats.averageScore > 80 ? 'PRO-I' : stats.averageScore > 60 ? 'INTER' : 'CADET'}
//         </p>
//       </div>
//     </div>
//     <button
//       onClick={() => { apiService.clearAuth(); window.location.reload(); }}
//       className="px-10 py-4 bg-red-600 hover:bg-red-700 text-white rounded-xl font-black uppercase text-xs transition-all"
//     >
//       Revoke Authorization
//     </button>
//   </div>
// );

// // ─── FLEET SPECS ─────────────────────────────────────────────────────────────
// const FleetSpecsView: React.FC<{ onBack: () => void }> = ({ onBack }) => (
//   <div className="space-y-10 pb-12">
//     <header className="flex items-center justify-between">
//       <h2 className="text-4xl font-black uppercase">Fleet Intelligence</h2>
//       <button onClick={onBack} className="text-blue-600 font-black uppercase text-sm hover:text-blue-700">
//         ← Back
//       </button>
//     </header>
//     <p className="text-slate-400">Aviation trade specifications and NCAA certification requirements.</p>
//     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//       {TRADE_INFO.map(info => (
//         <div key={info.trade} className="bg-white p-8 rounded-[2rem] border shadow-sm">
//           <div className={`w-14 h-14 ${info.color} rounded-xl flex items-center justify-center text-3xl mb-4 shadow-md`}>
//             {info.icon}
//           </div>
//           <h3 className="font-black text-lg uppercase text-slate-900">{info.trade}</h3>
//           <p className="text-xs text-slate-400 mt-2">NCAA Certification Required</p>
//         </div>
//       ))}
//     </div>
//   </div>
// );

// // ─── APP ──────────────────────────────────────────────────────────────────────
// const App: React.FC = () => {
//   const [view, setView] = useState<View>('LANDING');
//   const [questions, setQuestions] = useState<Question[]>(INITIAL_QUESTIONS);
//   const [isOnline, setIsOnline] = useState(navigator.onLine);
//   const [user, setUser] = useState<any>(null);
//     const [resetToken, setResetToken] = useState('');
//   const [currentTrade, setCurrentTrade] = useState<Trade | null>(null);
//   const [session, setSession] = useState<QuizSession | null>(null);
//   const [stats, setStats] = useState<UserStats>({
//     totalQuizzes: 0,
//     averageScore: 0,
//     bestTrade: null,
//     history: [],
//   });

//   // Auth form state
//   const [authMode, setAuthMode] = useState<'LOGIN' | 'REGISTER'>('LOGIN');
//   const [authData, setAuthData] = useState({ name: '', email: '', password: '' });
//   const [authError, setAuthError] = useState('');


//     // Arriving from the reset email: /?reset_token=...
//   useEffect(() => {
//     const token = new URLSearchParams(window.location.search).get('reset_token');
//     if (token) {
//       setResetToken(token);
//       setView('RESET_PASSWORD');
//       window.history.replaceState({}, '', window.location.pathname); // keep token out of the address bar
//     }
//   }, []);

//   // Init
//   useEffect(() => {
//     const handleOnline = () => setIsOnline(true);
//     const handleOffline = () => setIsOnline(false);
//     window.addEventListener('online', handleOnline);
//     window.addEventListener('offline', handleOffline);

//     const saved = localStorage.getItem('ncaa_user_data');
//     if (saved) {
//       try {
//         const parsed = JSON.parse(saved);
//         setUser(parsed);
//         if (parsed.stats) setStats(parsed.stats);
//       } catch { /* ignore */ }
//     }

//     apiService.fetchQuestions().then(data => {
//       if (data.length > 0) setQuestions(data);
//     }).catch(() => {});

//     return () => {
//       window.removeEventListener('online', handleOnline);
//       window.removeEventListener('offline', handleOffline);
//     };
//   }, []);

//   // Start quiz
//   const startQuiz = useCallback((trade: Trade, mode: QuizMode) => {
//     if (!user) {
//       alert('Login required: you can view course sectors as a guest, but assessment access requires authentication.');
//       setView('AUTH');
//       return;
//     }

//     const tradeQs = questions.filter(q => q.trade === trade);
//     if (tradeQs.length === 0) {
//       alert('No questions found for this trade yet. Ask your admin to add questions.');
//       return;
//     }
//     const shuffled = [...tradeQs].sort(() => Math.random() - 0.5).slice(0, 10);
//     setSession({
//       trade,
//       mode,
//       questions: shuffled,
//       currentQuestionIndex: 0,
//       userAnswers: {},
//       startTime: Date.now(),
//       timeRemaining: mode === QuizMode.TIMED ? 600 : 0,
//     });
//     setView('QUIZ');
//   }, [questions, user]);

//   const handleAnswer = useCallback((questionId: string, answerId: string) => {
//     setSession(prev => {
//       if (!prev || prev.userAnswers[questionId]) return prev;
//       return { ...prev, userAnswers: { ...prev.userAnswers, [questionId]: answerId } };
//     });
//   }, []);

//   const finishQuiz = useCallback(() => {
//     setSession(prev => {
//       if (!prev) return null;
//       const score = prev.questions.reduce(
//         (acc, q) => acc + (prev.userAnswers[q.id] === q.correctAnswer ? 1 : 0),
//         0
//       );
//       if (user) {
//         apiService.updateStats({ trade: prev.trade, score, total: prev.questions.length })
//           .then(updatedStats => {
//             if (updatedStats) {
//               setStats(updatedStats);
//               const updatedUser = { ...user, stats: updatedStats };
//               setUser(updatedUser);
//               localStorage.setItem('ncaa_user_data', JSON.stringify(updatedUser));
//             }
//           });
//       }
//       return { ...prev, endTime: Date.now() };
//     });
//     setView('RESULTS');
//   }, [user]);

//   const handleNext = useCallback(() => {
//     setSession(prev => {
//       if (!prev) return null;
//       if (prev.currentQuestionIndex < prev.questions.length - 1) {
//         return { ...prev, currentQuestionIndex: prev.currentQuestionIndex + 1 };
//       }
//       return prev;
//     });
//     // Check if we just answered the last question
//     setSession(prev => {
//       if (prev && prev.currentQuestionIndex >= prev.questions.length - 1) {
//         finishQuiz();
//       }
//       return prev;
//     });
//   }, [finishQuiz]);

//   // Cleaner next handler
//   const handleNextQuestion = useCallback(() => {
//     if (!session) return;
//     if (session.currentQuestionIndex < session.questions.length - 1) {
//       setSession(s => s ? { ...s, currentQuestionIndex: s.currentQuestionIndex + 1 } : null);
//     } else {
//       finishQuiz();
//     }
//   }, [session, finishQuiz]);

//   // Timed countdown
//   useEffect(() => {
//     if (!session || session.mode !== QuizMode.TIMED || session.timeRemaining <= 0 || session.endTime) return;
//     const timer = setInterval(() => {
//       setSession(prev => {
//         if (!prev || prev.endTime) return prev;
//         if (prev.timeRemaining <= 1) { clearInterval(timer); return { ...prev, timeRemaining: 0 }; }
//         return { ...prev, timeRemaining: prev.timeRemaining - 1 };
//       });
//     }, 1000);
//     return () => clearInterval(timer);
//   }, [session?.mode, session?.endTime, session?.timeRemaining === 0]);

//   useEffect(() => {
//     if (session?.mode === QuizMode.TIMED && session.timeRemaining === 0 && !session.endTime) {
//       finishQuiz();
//     }
//   }, [session?.timeRemaining, session?.endTime, finishQuiz]);

//   // Auth
//   const handleAuth = useCallback(async (e: React.FormEvent) => {
//     e.preventDefault();
//     setAuthError('');
//     try {
//       let data;
//       if (authMode === 'LOGIN') {
//         data = await apiService.login({ email: authData.email, password: authData.password });
//       } else {
//         data = await apiService.register({ name: authData.name, email: authData.email, password: authData.password });
//       }
//       setUser(data);
//       if (data.stats) setStats(data.stats);
//       setView('DASHBOARD');
//     } catch (err: any) {
//       setAuthError(err.message || 'Authentication failed');
//     }
//   }, [authMode, authData]);

//   const handleAbort = useCallback(() => {
//     if (confirm('Abort mission? Progress will not be saved.')) setView('DASHBOARD');
//   }, []);

//   useEffect(() => {
//     const protectedViews: View[] = ['DASHBOARD', 'QUIZ', 'RESULTS', 'REVIEW', 'PROFILE', 'ADMIN'];
//     if (!user && protectedViews.includes(view)) {
//       setView('AUTH');
//     }
//   }, [user, view]);


//   return (
//     <Layout currentView={view} setView={setView} user={user}>
//       <OfflineBadge isOnline={isOnline} />

//       {view === 'LANDING' && (
//         <LandingView onEnter={() => setView('TRADE_SELECT')} onFleet={() => setView('FLEET_SPECS')} />
//       )}

//             {view === 'AUTH'          && <AuthView authMode={authMode} setAuthMode={setAuthMode} authData={authData} setAuthData={setAuthData} authError={authError} onSubmit={handleAuth} onForgot={() => { setAuthError(''); setView('FORGOT_PASSWORD'); }} darkMode={darkMode} />}
//       {view === 'FORGOT_PASSWORD' && <ForgotPasswordView onBack={() => { setAuthMode('LOGIN'); setView('AUTH'); }} darkMode={darkMode} />}
//       {view === 'RESET_PASSWORD'  && <ResetPasswordView token={resetToken} onDone={() => { setAuthMode('LOGIN'); setView('AUTH'); }} darkMode={darkMode} />}{(
//         <AuthView
//           authMode={authMode}
//           setAuthMode={setAuthMode}
//           authData={authData}
//           setAuthData={setAuthData}
//           authError={authError}
//           onSubmit={handleAuth}
//         />
//       )}

//       {view === 'DASHBOARD' && (
//         <DashboardView
//           user={user}
//           stats={stats}
//           isOnline={isOnline}
//           questions={questions}
//           onScramble={() => startQuiz(Trade.SAFETY_HUMAN_FACTORS, QuizMode.TIMED)}
//         />
//       )}

//       {view === 'TRADE_SELECT' && (
//         <TradeSelectView
//           questions={questions}
//           currentTrade={currentTrade}
//           setCurrentTrade={setCurrentTrade}
//           onStart={startQuiz}
//           isLoggedIn={!!user}
//           onRequireLogin={() => setView('AUTH')}
//         />
//       )}

//       {view === 'QUIZ' && session && (
//         <QuizView
//           session={session}
//           onAnswer={handleAnswer}
//           onNext={handleNextQuestion}
//           onAbort={handleAbort}
//         />
//       )}

//       {view === 'RESULTS' && (
//         <ResultsView
//           session={session}
//           onHome={() => setView('DASHBOARD')}
//           onReview={() => setView('REVIEW')}
//           onRetry={() => session && startQuiz(session.trade, session.mode)}
//         />
//       )}

//       {view === 'REVIEW' && (
//         <ReviewView session={session} onClose={() => setView('DASHBOARD')} />
//       )}

//       {view === 'ADMIN' && user?.role === 'admin' && (
//         <AdminView questions={questions} setQuestions={setQuestions} />
//       )}

//       {view === 'PROFILE' && <ProfileView user={user} stats={stats} />}

//       {view === 'FLEET_SPECS' && <FleetSpecsView onBack={() => setView('LANDING')} />}
//     </Layout>
//   );
// };

// export default App;
