import React, { useState, useEffect, useCallback } from 'react';
import { Trade, QuizMode, Question, QuizSession, UserStats, View } from './types';
import { INITIAL_QUESTIONS, TRADE_INFO } from './constants';
import { Layout } from './components/Layout';
import { AdminView } from './components/AdminView';
import { apiService } from './services/apiService';

// ─── OFFLINE BADGE ─────────────────────────────────────────────────────────
const OfflineBadge: React.FC<{ isOnline: boolean }> = ({ isOnline }) => (
  <div
    className={`fixed top-4 left-1/2 -translate-x-1/2 z-[100] px-4 py-1.5 rounded-full border text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-lg backdrop-blur-md transition-all ${
      isOnline
        ? 'bg-green-500/10 border-green-500/30 text-green-500'
        : 'bg-orange-500/10 border-orange-500/30 text-orange-500 animate-pulse'
    }`}
  >
    <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500' : 'bg-orange-500'}`} />
    {isOnline ? 'Cloud Sync Online' : 'Local Offline Mode Active'}
  </div>
);

// ─── LANDING ────────────────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════
// REPLACE ONLY the LandingView component in your App.tsx with this.
// Find the existing LandingView function and replace it entirely.
// Everything else in App.tsx stays the same.
// ═══════════════════════════════════════════════════════════════════════════

// ─── NIGERIAN AUGUSTA 109 SVG ────────────────────────────────────────────────
// Shared SVG helicopter (Nigerian livery: green body, white stripe, gold trim)
const AgustaW109Nigerian = () => (
  <svg viewBox="0 0 620 240" xmlns="http://www.w3.org/2000/svg" role="presentation" aria-hidden="true">
    <defs>
      {/* Main fuselage gradient - deep Nigerian green */}
      <linearGradient id="body-grad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#1a7a1a" />
        <stop offset="40%" stopColor="#006400" />
        <stop offset="100%" stopColor="#003d00" />
      </linearGradient>
      {/* Lighter green for top panels */}
      <linearGradient id="top-grad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#2a9a2a" />
        <stop offset="100%" stopColor="#006400" />
      </linearGradient>
      {/* Cockpit glass */}
      <linearGradient id="glass-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#7dd3fc" stopOpacity="0.95" />
        <stop offset="50%" stopColor="#0ea5e9" stopOpacity="0.85" />
        <stop offset="100%" stopColor="#0369a1" stopOpacity="0.9" />
      </linearGradient>
      {/* Gold accent */}
      <linearGradient id="gold-grad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#fbbf24" />
        <stop offset="100%" stopColor="#d97706" />
      </linearGradient>
      {/* Engine pod */}
      <linearGradient id="engine-grad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#374151" />
        <stop offset="50%" stopColor="#1f2937" />
        <stop offset="100%" stopColor="#111827" />
      </linearGradient>
      {/* Tail boom */}
      <linearGradient id="tail-grad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#006400" />
        <stop offset="70%" stopColor="#004d00" />
        <stop offset="100%" stopColor="#002800" />
      </linearGradient>
      {/* Skid shadow */}
      <linearGradient id="skid-grad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#9ca3af" />
        <stop offset="100%" stopColor="#4b5563" />
      </linearGradient>
    </defs>

    {/* ── TAIL BOOM ──────────────────────────────────────────── */}
    <path
      d="M390 102 L560 88 Q585 87 595 95 Q598 100 592 108 Q586 114 560 114 L390 118 Z"
      fill="url(#tail-grad)"
      stroke="#002800" strokeWidth="1"
    />
    {/* Tail boom detail stripe - white */}
    <path
      d="M420 105 L555 93 L558 98 L422 110 Z"
      fill="white" opacity="0.3"
    />

    {/* ── HORIZONTAL STABILIZER ─────────────────────────────── */}
    <path d="M540 88 L575 68 L585 70 L565 90 Z" fill="#005000" stroke="#002800" strokeWidth="1" />
    <path d="M540 114 L575 134 L585 132 L565 112 Z" fill="#005000" stroke="#002800" strokeWidth="1" />

    {/* ── TAIL ROTOR MOUNT ──────────────────────────────────── */}
    <ellipse cx="590" cy="101" rx="9" ry="9" fill="#1f2937" stroke="#374151" strokeWidth="1.5" />
    {/* Tail rotor blades */}
    <g className="rotor-tail">
      <rect x="576" y="99" width="28" height="4" rx="2" fill="#d1d5db" />
      <rect x="588" y="87" width="4" height="28" rx="2" fill="#d1d5db" />
    </g>

    {/* ── MAIN FUSELAGE BODY ─────────────────────────────────── */}
    {/* Lower belly */}
    <path
      d="M130 148 L360 148 Q400 148 410 138 L390 118 L390 102 L410 82 Q400 72 360 72 L130 72 Q80 72 55 90 Q30 108 30 110 Q30 120 55 130 Q80 148 130 148 Z"
      fill="url(#body-grad)"
      stroke="#002800" strokeWidth="1.5"
    />

    {/* ── NIGERIAN FLAG STRIPE (green-white-green on fuselage) ── */}
    {/* White center stripe */}
    <path
      d="M150 72 L350 72 L350 148 L150 148 Z"
      fill="white" opacity="0.12"
    />
    {/* Green left stripe */}
    <path
      d="M130 74 L195 74 L195 146 L130 146 Q90 143 65 128 L65 92 Q90 77 130 74 Z"
      fill="#006400" opacity="0.9"
    />
    {/* White band */}
    <path
      d="M195 74 L240 74 L240 146 L195 146 Z"
      fill="white" opacity="0.85"
    />
    {/* Green center */}
    <path
      d="M240 74 L310 74 L310 146 L240 146 Z"
      fill="#006400" opacity="0.9"
    />
    {/* White band 2 */}
    <path
      d="M310 74 L355 74 L355 146 L310 146 Z"
      fill="white" opacity="0.85"
    />
    {/* Green right */}
    <path
      d="M355 74 L390 80 L390 120 L355 146 Z"
      fill="#006400" opacity="0.9"
    />

    {/* ── TOP FUSELAGE PANELS ────────────────────────────────── */}
    <path
      d="M140 72 L370 72 L380 62 L380 58 L140 58 Q100 58 75 68 L75 72 Z"
      fill="url(#top-grad)"
      stroke="#002800" strokeWidth="1"
    />

    {/* ── GOLD ACCENT STRIPE (top of fuselage) ─────────────── */}
    <path
      d="M120 58 L380 58 L382 54 L118 54 Z"
      fill="url(#gold-grad)"
      opacity="0.9"
    />

    {/* ── ENGINE PODS (twin turboshaft on top) ──────────────── */}
    <rect x="180" y="40" width="90" height="22" rx="8" fill="url(#engine-grad)" stroke="#374151" strokeWidth="1.5" />
    <rect x="280" y="40" width="90" height="22" rx="8" fill="url(#engine-grad)" stroke="#374151" strokeWidth="1.5" />
    {/* Engine exhausts */}
    <ellipse cx="268" cy="46" rx="7" ry="5" fill="#1f2937" stroke="#6b7280" strokeWidth="1" />
    <ellipse cx="368" cy="46" rx="7" ry="5" fill="#1f2937" stroke="#6b7280" strokeWidth="1" />
    {/* Exhaust glow */}
    <ellipse cx="268" cy="46" rx="4" ry="3" fill="#f97316" opacity="0.6" />
    <ellipse cx="368" cy="46" rx="4" ry="3" fill="#f97316" opacity="0.6" />
    {/* Engine intake grill detail */}
    <line x1="195" y1="44" x2="195" y2="58" stroke="#6b7280" strokeWidth="1" />
    <line x1="205" y1="44" x2="205" y2="58" stroke="#6b7280" strokeWidth="1" />
    <line x1="215" y1="44" x2="215" y2="58" stroke="#6b7280" strokeWidth="1" />
    <line x1="295" y1="44" x2="295" y2="58" stroke="#6b7280" strokeWidth="1" />
    <line x1="305" y1="44" x2="305" y2="58" stroke="#6b7280" strokeWidth="1" />
    <line x1="315" y1="44" x2="315" y2="58" stroke="#6b7280" strokeWidth="1" />

    {/* ── MAIN ROTOR MAST ────────────────────────────────────── */}
    <rect x="270" y="22" width="12" height="22" rx="3" fill="#374151" stroke="#6b7280" strokeWidth="1" />
    <ellipse cx="276" cy="22" rx="10" ry="5" fill="#4b5563" />

    {/* ── MAIN ROTOR BLADES ─────────────────────────────────── */}
    <g className="rotor-main" style={{ transformOrigin: '276px 20px' }}>
      {/* Blade 1 - right */}
      <path d="M276 20 L560 10 L558 30 L276 20 Z" fill="#1f2937" stroke="#374151" strokeWidth="0.5" />
      {/* Blade 2 - left */}
      <path d="M276 20 L-8 10 L-6 30 L276 20 Z" fill="#1f2937" stroke="#374151" strokeWidth="0.5" />
      {/* Blade 3 - forward */}
      <path d="M276 20 L278 -270 L298 -268 L276 20 Z" fill="#374151" stroke="#4b5563" strokeWidth="0.5" />
      {/* Hub */}
      <circle cx="276" cy="20" r="10" fill="#6b7280" stroke="#9ca3af" strokeWidth="1.5" />
      <circle cx="276" cy="20" r="5" fill="#374151" />
    </g>

    {/* ── NOSE / COCKPIT ────────────────────────────────────── */}
    {/* Nose cone - gold */}
    <path
      d="M130 72 Q80 72 55 90 Q30 108 30 110 Q30 120 55 130 Q80 148 130 148 L140 148 L140 72 Z"
      fill="url(#gold-grad)"
      stroke="#d97706" strokeWidth="1.5"
    />
    {/* Nose tip */}
    <path
      d="M55 90 Q30 108 30 110 Q30 120 55 130 L65 128 Q50 115 50 110 Q50 105 65 92 Z"
      fill="#d97706"
    />

    {/* Cockpit windows - large and blue */}
    {/* Left pilot window */}
    <path
      d="M80 80 Q68 82 64 95 Q62 103 64 115 Q68 125 80 126 L128 124 L128 78 Z"
      fill="url(#glass-grad)"
      stroke="#0284c7" strokeWidth="1.5"
      opacity="0.92"
    />
    {/* Right pilot window */}
    <path
      d="M128 78 L140 78 L140 122 L128 122 Z"
      fill="url(#glass-grad)"
      stroke="#0284c7" strokeWidth="1"
      opacity="0.88"
    />
    {/* Window frame */}
    <path
      d="M80 80 Q68 82 64 95 Q62 103 64 115 Q68 125 80 126 L128 124 L128 78 Z"
      fill="none"
      stroke="#fed7aa" strokeWidth="2"
    />
    {/* Glare highlight */}
    <path
      d="M72 85 Q66 88 66 96 L72 95 Z"
      fill="white" opacity="0.4"
    />

    {/* Cabin windows (passenger) */}
    <rect x="158" y="84" width="38" height="30" rx="6" fill="url(#glass-grad)" stroke="#0284c7" strokeWidth="1.5" opacity="0.85" />
    <rect x="210" y="84" width="38" height="30" rx="6" fill="url(#glass-grad)" stroke="#0284c7" strokeWidth="1.5" opacity="0.85" />
    <rect x="262" y="84" width="38" height="30" rx="6" fill="url(#glass-grad)" stroke="#0284c7" strokeWidth="1.5" opacity="0.85" />
    {/* Cabin window glare */}
    <rect x="160" y="86" width="12" height="8" rx="3" fill="white" opacity="0.3" />
    <rect x="212" y="86" width="12" height="8" rx="3" fill="white" opacity="0.3" />
    <rect x="264" y="86" width="12" height="8" rx="3" fill="white" opacity="0.3" />

    {/* ── REGISTRATION TEXT ──────────────────────────────────── */}
    <text
      x="220" y="142"
      fontFamily="monospace" fontWeight="bold" fontSize="11"
      fill="#1a1a1a" opacity="0.9"
      textAnchor="middle"
    >5N-NCA</text>

    {/* ── BELLY DETAIL ──────────────────────────────────────── */}
    <path d="M160 148 L350 148 L352 154 L158 154 Z" fill="#003d00" opacity="0.6" />

    {/* ── LANDING SKIDS ─────────────────────────────────────── */}
    {/* Front skid strut */}
    <line x1="148" y1="148" x2="138" y2="185" stroke="url(#skid-grad)" strokeWidth="5" strokeLinecap="round" />
    {/* Rear skid strut */}
    <line x1="340" y1="148" x2="350" y2="185" stroke="url(#skid-grad)" strokeWidth="5" strokeLinecap="round" />
    {/* Front cross strut */}
    <line x1="110" y1="175" x2="175" y2="175" stroke="#6b7280" strokeWidth="3.5" strokeLinecap="round" />
    {/* Rear cross strut */}
    <line x1="320" y1="185" x2="385" y2="185" stroke="#6b7280" strokeWidth="3.5" strokeLinecap="round" />
    {/* Front skid rail */}
    <path d="M85 185 Q100 190 175 185 Q190 182 195 178" fill="none" stroke="url(#skid-grad)" strokeWidth="5" strokeLinecap="round" />
    {/* Rear skid rail */}
    <path d="M300 180 Q340 188 410 182 Q420 178 425 174" fill="none" stroke="url(#skid-grad)" strokeWidth="5" strokeLinecap="round" />

    {/* ── RUNNING LIGHTS ────────────────────────────────────── */}
    {/* Nav light red - left */}
    <circle cx="40" cy="110" r="5" fill="#ef4444" opacity="0.9" />
    <circle cx="40" cy="110" r="8" fill="#ef4444" opacity="0.2" />
    {/* Anti-collision beacon - top */}
    <circle cx="276" cy="15" r="4" fill="#fbbf24" opacity="0.95" />
    <circle cx="276" cy="15" r="7" fill="#fbbf24" opacity="0.2" />
    {/* Tail position light */}
    <circle cx="596" cy="101" r="3" fill="#60a5fa" opacity="0.9" />

    {/* ── NIGERIAN COAT OF ARMS (simplified eagle emblem) ───── */}
    <g transform="translate(172, 95)" opacity="0.7">
      <circle cx="8" cy="8" r="7" fill="#fbbf24" />
      <text x="8" y="12" textAnchor="middle" fontSize="9" fill="#006400" fontWeight="bold">✦</text>
    </g>

    {/* ── DOOR PANEL LINES ──────────────────────────────────── */}
    <line x1="152" y1="75" x2="152" y2="146" stroke="#002800" strokeWidth="1" opacity="0.5" />
    <line x1="202" y1="75" x2="202" y2="146" stroke="#002800" strokeWidth="0.8" opacity="0.4" />
    <line x1="302" y1="75" x2="302" y2="146" stroke="#002800" strokeWidth="0.8" opacity="0.4" />

    {/* ── PITOT TUBE ────────────────────────────────────────── */}
    <line x1="30" y1="108" x2="8" y2="106" stroke="#9ca3af" strokeWidth="2" />
    <circle cx="8" cy="106" r="2" fill="#9ca3af" />
  </svg>
);

// ─── LANDING VIEW ────────────────────────────────────────────────────────────
const LandingView: React.FC<{ onEnter: () => void; onFleet: () => void }> = ({ onEnter, onFleet }) => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-[#020617] text-white p-6 relative overflow-hidden">

    {/* Background atmosphere */}
    <div className="absolute inset-0 pointer-events-none opacity-20">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-blue-500/30 rounded-full" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-blue-400/20 rounded-full" />
    </div>
    <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600 rounded-full blur-[140px] opacity-20 -mr-48 -mt-48" />
    <div className="absolute top-0 left-0 w-72 h-72 bg-green-600 rounded-full blur-[120px] opacity-10 -ml-36 -mt-36" />

    {/* ── HELICOPTER SCENE ── */}
    <div className="agusta-landing-wrapper" aria-hidden="true">

      {/* Shadow right */}
      <div className="agusta-shadow-right" />
      {/* Shadow left */}
      <div className="agusta-shadow-left" />

      {/* RIGHT helicopter — lands from top-right */}
      <div className="agusta-helicopter agusta-helicopter-right">
        <AgustaW109Nigerian />
      </div>

      {/* LEFT helicopter — lands from top-left, mirrored */}
      <div className="agusta-helicopter agusta-helicopter-left">
        <AgustaW109Nigerian />
      </div>

    </div>

    {/* ── MAIN CONTENT ── */}
    <div className="z-10 text-center max-w-3xl">
      <div className="inline-flex items-center gap-2 bg-blue-900/40 border border-blue-500/30 px-4 py-2 rounded-full text-blue-400 text-xs font-bold mb-8 uppercase tracking-widest">
        <span className="w-2 h-2 bg-blue-500 rounded-full animate-ping" />
        System Operational
      </div>
      <h1 className="text-6xl md:text-8xl font-black mb-6 tracking-tighter leading-[0.9] text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-500">
        NCAA COMMAND <br />
        <span className="text-yellow-400">PRO PLATFORM</span>
      </h1>
      <p className="text-xl text-slate-400 mb-12 font-medium max-w-xl mx-auto leading-relaxed">
        The ultimate certification platform for aviation professionals. Strategic readiness for
        Pilots, Engineers, and ATC.
      </p>
      <div className="flex flex-col sm:flex-row gap-5 justify-center">
        <button
          onClick={onEnter}
          className="px-10 py-5 bg-blue-600 hover:bg-blue-500 rounded-xl font-black text-xl transition-all shadow-[0_0_40px_rgba(37,99,235,0.4)]"
        >
          ENTER COCKPIT
        </button>
        <button
          onClick={onFleet}
          className="px-10 py-5 bg-slate-900/80 hover:bg-slate-800 rounded-xl font-black text-xl transition-all border border-slate-700 backdrop-blur-sm"
        >
          FLEET SPECS
        </button>
      </div>
    </div>
  </div>
);

// ─── AUTH ───────────────────────────────────────────────────────────────────
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
}
const TradeSelectView: React.FC<TradeSelectViewProps> = ({
  questions, currentTrade, setCurrentTrade, onStart,
}) => (
  <div className="space-y-10 pb-40">
    <header>
      <h2 className="text-4xl font-black uppercase">Deployment Sectors</h2>
      <p className="text-slate-400 mt-2">Select a trade to begin your assessment</p>
    </header>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {TRADE_INFO.map(info => {
        const count = questions.filter(q => q.trade === info.trade).length;
        return (
          <div
            key={info.trade}
            onClick={() => setCurrentTrade(info.trade)}
            className={`cursor-pointer p-8 rounded-[2rem] border-2 transition-all ${currentTrade === info.trade ? 'border-blue-600 bg-blue-50 shadow-lg' : 'border-slate-100 bg-white hover:border-slate-200 shadow-sm'}`}
          >
            <div className={`w-14 h-14 ${info.color} rounded-xl flex items-center justify-center text-3xl mb-6 shadow-md`}>
              {info.icon}
            </div>
            <h3 className="font-black text-xl uppercase text-slate-900">{info.trade}</h3>
            <p className={`text-xs font-bold mt-2 uppercase ${count > 0 ? 'text-slate-400' : 'text-red-400'}`}>
              {count > 0 ? `${count} Modules Ready` : 'No Questions Yet'}
            </p>
          </div>
        );
      })}
    </div>
    {currentTrade && (
      <div className="fixed inset-x-0 bottom-0 p-6 bg-white/95 backdrop-blur-xl border-t z-50 shadow-2xl">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-black uppercase">{currentTrade}</h3>
            <p className="text-slate-400 text-sm">
              {questions.filter(q => q.trade === currentTrade).length} questions available
            </p>
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => onStart(currentTrade, QuizMode.PRACTICE)}
              className="px-8 py-4 bg-slate-100 hover:bg-slate-200 font-black rounded-xl uppercase transition-all"
            >
              Practice
            </button>
            <button
              onClick={() => onStart(currentTrade, QuizMode.TIMED)}
              className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-xl uppercase shadow-lg transition-all"
            >
              Final Exam ⏱
            </button>
          </div>
        </div>
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
  }, [questions]);

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

  return (
    <Layout currentView={view} setView={setView} user={user}>
      <OfflineBadge isOnline={isOnline} />

      {view === 'LANDING' && (
        <LandingView onEnter={() => setView('AUTH')} onFleet={() => setView('FLEET_SPECS')} />
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

// import React, { useState, useEffect, useCallback } from 'react';
// import { Trade, QuizMode, Question, QuizSession, UserStats, View } from './types';
// import { INITIAL_QUESTIONS, TRADE_INFO } from './constants';
// import { Layout } from './components/Layout';
// import { geminiService } from './services/geminiService';
// import { apiService } from './services/apiService';

// // ─── AUTH VIEW ────────────────────────────────────────────────────────────────
// interface AuthViewProps {
//   authMode: 'LOGIN' | 'REGISTER';
//   setAuthMode: (m: 'LOGIN' | 'REGISTER') => void;
//   authData: { name: string; email: string; password: string };
//   setAuthData: React.Dispatch<React.SetStateAction<{ name: string; email: string; password: string }>>;
//   authError: string;
//   onSubmit: (e: React.FormEvent) => void;
// }

// const AuthView: React.FC<AuthViewProps> = ({
//   authMode, setAuthMode, authData, setAuthData, authError, onSubmit
// }) => (
//   <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
//     <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent"></div>
//     <div className="w-full max-w-md bg-slate-900/90 backdrop-blur-xl p-10 rounded-[2rem] shadow-2xl border border-slate-800 relative z-10">
//       <div className="w-16 h-1 bg-blue-600 rounded-full mb-8 mx-auto"></div>
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
//         {authMode === 'LOGIN'
//           ? 'Need a clearance? Start Enrollment'
//           : 'Already registered? Login to Cockpit'}
//       </button>
//     </div>
//   </div>
// );

// // ─── LANDING VIEW ─────────────────────────────────────────────────────────────
// interface LandingViewProps {
//   onEnter: () => void;
//   onFleet: () => void;
// }

// const LandingView: React.FC<LandingViewProps> = ({ onEnter, onFleet }) => (
//   <div className="min-h-screen flex flex-col items-center justify-center bg-[#020617] text-white p-6 relative overflow-hidden">
//     <div className="absolute inset-0 pointer-events-none opacity-20">
//       <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-blue-500/30 rounded-full"></div>
//       <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-blue-400/20 rounded-full"></div>
//     </div>
//     <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600 rounded-full blur-[140px] opacity-20 -mr-48 -mt-48"></div>

//     <div className="z-10 text-center max-w-3xl">
//       <div className="inline-flex items-center gap-2 bg-blue-900/40 border border-blue-500/30 px-4 py-2 rounded-full text-blue-400 text-xs font-bold mb-8 uppercase tracking-widest">
//         <span className="w-2 h-2 bg-blue-500 rounded-full animate-ping"></span>
//         System Operational
//       </div>
//       <h1 className="text-6xl md:text-8xl font-black mb-6 tracking-tighter leading-[0.9] text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-500">
//         NCAA COMMAND <br />
//         <span className="text-yellow-400">PRO PLATFORM</span>
//       </h1>
//       <p className="text-xl text-slate-400 mb-12 font-medium max-w-xl mx-auto leading-relaxed">
//         The ultimate certification platform for aviation professionals. Strategic readiness for
//         Pilots, Engineers, and ATC.
//       </p>
//       <div className="flex flex-col sm:flex-row gap-5 justify-center">
//         <button
//           onClick={onEnter}
//           className="group relative px-10 py-5 bg-blue-600 hover:bg-blue-500 rounded-xl font-black text-xl transition-all shadow-[0_0_40px_rgba(37,99,235,0.4)] overflow-hidden"
//         >
//           ENTER COCKPIT
//         </button>
//         <button
//           onClick={onFleet}
//           className="px-10 py-5 bg-slate-900/80 hover:bg-slate-800 rounded-xl font-black text-xl transition-all border border-slate-700 backdrop-blur-sm"
//         >
//           FLEET SPECS
//         </button>
//       </div>
//     </div>
//   </div>
// );

// // ─── DASHBOARD VIEW ───────────────────────────────────────────────────────────
// interface DashboardViewProps {
//   user: any;
//   stats: UserStats;
//   isOnline: boolean;
//   questions: Question[];
//   onScramble: () => void;
// }

// const DashboardView: React.FC<DashboardViewProps> = ({
//   user, stats, isOnline, questions, onScramble
// }) => (
//   <div className="space-y-8 pb-12">
//     <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
//       <div>
//         <div className="flex items-center gap-2 mb-1">
//           <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500' : 'bg-orange-500'}`}></span>
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
//           <span className="text-green-500 font-black text-sm mb-1.5">↑</span>
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
//               </div>
//             ))
//           ) : (
//             <p className="text-slate-400 italic text-sm">No recent missions logged.</p>
//           )}
//         </div>
//       </section>
//       <section className="bg-slate-950 rounded-3xl p-8 text-white relative overflow-hidden flex flex-col justify-between">
//         <div className="z-10 relative">
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

// // ─── QUIZ VIEW ────────────────────────────────────────────────────────────────
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
//             className="px-4 py-2 bg-slate-100 rounded-xl text-[10px] font-black text-slate-900 uppercase"
//           >
//             ✕ Abort
//           </button>
//           <span className="text-[10px] font-black text-slate-400 uppercase">
//             Sector: <span className="text-blue-600">{session.trade}</span>
//           </span>
//         </div>
//         {session.mode === QuizMode.TIMED && (
//           <div className="text-xl font-black text-red-600 tabular-nums">
//             {Math.floor(session.timeRemaining / 60)}:
//             {(session.timeRemaining % 60).toString().padStart(2, '0')}
//           </div>
//         )}
//       </div>

//       <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
//         <div
//           className="h-full bg-blue-600 transition-all duration-700"
//           style={{ width: `${progress}%` }}
//         ></div>
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
//               else styles = 'opacity-40';
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
//                   className={`w-10 h-10 rounded-xl border-2 flex items-center justify-center font-black text-sm ${isSelected ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-200 text-slate-400'}`}
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
//               {userChoice === q.correctAnswer ? 'Verified' : 'Error Detected'}
//             </p>
//             <p className="text-sm font-medium leading-relaxed">{q.explanation}</p>
//           </div>
//         )}
//       </div>

//       <div className="flex justify-end">
//         <button
//           onClick={onNext}
//           disabled={!isAnswered}
//           className={`px-10 py-4 bg-slate-950 text-white rounded-xl font-black uppercase tracking-widest transition-all ${!isAnswered ? 'opacity-30' : 'hover:bg-blue-600'}`}
//         >
//           {session.currentQuestionIndex < session.questions.length - 1
//             ? 'Next Phase →'
//             : 'Finalize Mission'}
//         </button>
//       </div>
//     </div>
//   );
// };

// // ─── ADMIN VIEW ───────────────────────────────────────────────────────────────
// interface AdminViewProps {
//   questions: Question[];
//   setQuestions: React.Dispatch<React.SetStateAction<Question[]>>;
// }

// const AdminView: React.FC<AdminViewProps> = ({ questions, setQuestions }) => {
//   const [showBulk, setShowBulk] = useState(false);
//   const [bulkText, setBulkText] = useState('');
//   const [bulkTrade, setBulkTrade] = useState(Trade.B1_ENGINEER);
//   const [parsedPreview, setParsedPreview] = useState<any[]>([]);
//   const [isParsing, setIsParsing] = useState(false);
//   const [isSyncing, setIsSyncing] = useState(false);
//   const [syncProgress, setSyncProgress] = useState(0);

//   const handleBulkProcess = async () => {
//     if (!bulkText.trim()) return alert('Paste content first.');
//     setIsParsing(true);
//     try {
//       const result = await geminiService.parseBulkQuestions(bulkText, bulkTrade);
//       setParsedPreview(result);
//     } catch {
//       alert('AI could not parse this text.');
//     } finally {
//       setIsParsing(false);
//     }
//   };

//   const handleBatchSync = async () => {
//     if (!parsedPreview.length) return;
//     setIsSyncing(true);
//     setSyncProgress(0);
//     for (let i = 0; i < parsedPreview.length; i++) {
//       try {
//         await apiService.saveQuestion({
//           trade: bulkTrade,
//           text: parsedPreview[i].text,
//           options: parsedPreview[i].options,
//           correctAnswer: parsedPreview[i].correctAnswer,
//           explanation: parsedPreview[i].explanation,
//           difficulty: parsedPreview[i].difficulty,
//         });
//       } catch (e) {
//         console.error('Sync error', e);
//       }
//       setSyncProgress(Math.round(((i + 1) / parsedPreview.length) * 100));
//     }
//     alert(`Synced ${parsedPreview.length} modules.`);
//     setParsedPreview([]);
//     setBulkText('');
//     setShowBulk(false);
//     setIsSyncing(false);
//     apiService.fetchQuestions().then(data => setQuestions(data));
//   };

//   return (
//     <div className="space-y-10">
//       <header className="flex justify-between items-center">
//         <h2 className="text-3xl font-black uppercase">Command Console</h2>
//         <button
//           onClick={() => setShowBulk(!showBulk)}
//           className={`px-6 py-3 rounded-xl font-black uppercase text-xs ${showBulk ? 'bg-red-600 text-white' : 'bg-blue-600 text-white'}`}
//         >
//           {showBulk ? '✕ Close Bulk Uplink' : '🚀 Bulk AI Uplink'}
//         </button>
//       </header>

//       {showBulk ? (
//         <div className="bg-slate-900 rounded-[2rem] p-8 text-white">
//           <h3 className="text-xl font-black uppercase mb-4 text-blue-400">Tactical AI Parser</h3>
//           <textarea
//             className="w-full h-64 bg-slate-950 rounded-xl border border-slate-800 p-6 font-mono text-sm mb-6"
//             placeholder="Paste data samples..."
//             value={bulkText}
//             onChange={e => setBulkText(e.target.value)}
//           />
//           <div className="flex gap-4 mb-10">
//             <select
//               className="bg-slate-800 p-4 rounded-xl font-bold"
//               value={bulkTrade}
//               onChange={e => setBulkTrade(e.target.value as Trade)}
//             >
//               {Object.values(Trade).map(t => (
//                 <option key={t} value={t}>{t}</option>
//               ))}
//             </select>
//             <button
//               onClick={handleBulkProcess}
//               disabled={isParsing || !bulkText}
//               className="bg-blue-600 px-8 rounded-xl font-black uppercase"
//             >
//               {isParsing ? 'Parsing...' : 'Analyze'}
//             </button>
//           </div>
//           {parsedPreview.length > 0 && (
//             <div className="space-y-4">
//               <p className="text-green-400 font-black text-xs uppercase">
//                 Prepared: {parsedPreview.length} Modules
//               </p>
//               {isSyncing && (
//                 <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
//                   <div className="h-full bg-blue-500" style={{ width: `${syncProgress}%` }}></div>
//                 </div>
//               )}
//               <button
//                 onClick={handleBatchSync}
//                 disabled={isSyncing}
//                 className="w-full py-5 bg-white text-slate-900 font-black rounded-xl uppercase"
//               >
//                 Initiate Sync
//               </button>
//             </div>
//           )}
//         </div>
//       ) : (
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
//           <section className="lg:col-span-3 bg-white rounded-[2rem] border shadow-sm overflow-hidden">
//             <div className="p-6 border-b bg-slate-50 font-black uppercase text-sm flex items-center justify-between">
//               <span>Question Registry</span>
//               <span className="text-xs text-slate-400 font-normal">{questions.length} total</span>
//             </div>
//             <div className="overflow-x-auto">
//               <table className="w-full text-left">
//                 <thead className="bg-slate-50 text-slate-400 text-[10px] font-black uppercase">
//                   <tr>
//                     <th className="px-6 py-4">Question</th>
//                     <th className="px-6 py-4">Sector</th>
//                     <th className="px-6 py-4">Difficulty</th>
//                     <th className="px-6 py-4">Action</th>
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y">
//                   {questions.slice(0, 20).map(q => (
//                     <tr key={q.id} className="hover:bg-slate-50">
//                       <td className="px-6 py-4 max-w-sm truncate font-bold text-sm">{q.text}</td>
//                       <td className="px-6 py-4 text-xs font-black text-blue-600 uppercase">{q.trade}</td>
//                       <td className="px-6 py-4">
//                         <span className={`text-[10px] font-black px-2 py-1 rounded-full ${q.difficulty === 'Hard' ? 'bg-red-100 text-red-600' : q.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-600' : 'bg-green-100 text-green-600'}`}>
//                           {q.difficulty}
//                         </span>
//                       </td>
//                       <td className="px-6 py-4">
//                         <button
//                           onClick={() => {
//                             if (confirm('Purge this question?')) {
//                               apiService
//                                 .deleteQuestion(q.id)
//                                 .then(() =>
//                                   setQuestions(prev => prev.filter(i => i.id !== q.id))
//                                 );
//                             }
//                           }}
//                           className="text-red-500 font-black text-xs uppercase hover:text-red-700"
//                         >
//                           Purge
//                         </button>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </section>
//         </div>
//       )}
//     </div>
//   );
// };

// // ─── PROFILE VIEW ─────────────────────────────────────────────────────────────
// interface ProfileViewProps {
//   user: any;
//   stats: UserStats;
// }

// const ProfileView: React.FC<ProfileViewProps> = ({ user, stats }) => (
//   <div className="max-w-2xl mx-auto py-10 text-center space-y-10">
//     <div className="w-32 h-32 rounded-full border-4 border-blue-600 mx-auto p-1 flex items-center justify-center text-4xl bg-slate-100 font-black text-slate-400">
//       {user?.name?.[0] || 'A'}
//     </div>
//     <div>
//       <h2 className="text-3xl font-black uppercase text-slate-900">{user?.name || 'Asset'}</h2>
//       <p className="text-slate-400 text-sm mt-1">{user?.email}</p>
//     </div>
//     <div className="grid grid-cols-2 gap-6 text-center">
//       <div className="bg-white p-6 rounded-2xl border shadow-sm">
//         <p className="text-[10px] font-black text-blue-400 uppercase">Avg Readiness</p>
//         <p className="text-3xl font-black">{stats.averageScore}%</p>
//       </div>
//       <div className="bg-white p-6 rounded-2xl border shadow-sm">
//         <p className="text-[10px] font-black text-indigo-400 uppercase">Clearance</p>
//         <p className="text-xl font-black text-indigo-600 uppercase">{user?.role}</p>
//       </div>
//       <div className="bg-white p-6 rounded-2xl border shadow-sm">
//         <p className="text-[10px] font-black text-green-400 uppercase">Missions</p>
//         <p className="text-3xl font-black">{stats.totalQuizzes}</p>
//       </div>
//       <div className="bg-white p-6 rounded-2xl border shadow-sm">
//         <p className="text-[10px] font-black text-yellow-500 uppercase">Flight Hours</p>
//         <p className="text-3xl font-black">{stats.totalQuizzes * 2}</p>
//       </div>
//     </div>
//     <button
//       onClick={() => {
//         apiService.clearAuth();
//         window.location.reload();
//       }}
//       className="px-10 py-4 bg-red-600 text-white rounded-xl font-black uppercase text-xs hover:bg-red-700 transition-all"
//     >
//       Revoke Authorization
//     </button>
//   </div>
// );

// // ─── REVIEW VIEW ──────────────────────────────────────────────────────────────
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
//         className="px-6 py-3 bg-slate-900 text-white rounded-xl font-black text-xs uppercase"
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
//                 className={`w-10 h-10 rounded-xl flex items-center justify-center font-black ${isCorrect ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}
//               >
//                 {idx + 1}
//               </div>
//               <h4 className="text-xl font-bold pt-1">{q.text}</h4>
//             </div>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
//               {q.options.map(opt => (
//                 <div
//                   key={opt.id}
//                   className={`p-4 rounded-xl border text-sm font-bold flex items-center gap-3 ${opt.id === q.correctAnswer ? 'bg-green-50 border-green-200 text-green-900' : opt.id === userAns ? 'bg-red-50 border-red-200 text-red-900' : 'bg-slate-50 border-transparent text-slate-400 opacity-60'}`}
//                 >
//                   <span className="w-6 h-6 rounded flex items-center justify-center border border-current">
//                     {opt.id}
//                   </span>
//                   {opt.text}
//                 </div>
//               ))}
//             </div>
//             <div className="p-6 rounded-2xl bg-slate-900 text-white text-sm font-medium leading-relaxed opacity-90">
//               {q.explanation}
//             </div>
//           </div>
//         );
//       })}
//     </div>
//   </div>
// );

// // ─── TRADE SELECT VIEW ────────────────────────────────────────────────────────
// interface TradeSelectViewProps {
//   questions: Question[];
//   currentTrade: Trade | null;
//   setCurrentTrade: (t: Trade) => void;
//   onStart: (trade: Trade, mode: QuizMode) => void;
// }

// const TradeSelectView: React.FC<TradeSelectViewProps> = ({
//   questions, currentTrade, setCurrentTrade, onStart
// }) => (
//   <div className="space-y-10">
//     <header>
//       <h2 className="text-4xl font-black uppercase">Deployment Sectors</h2>
//       <p className="text-slate-400 mt-2">Select a trade to begin your assessment</p>
//     </header>
//     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//       {TRADE_INFO.map(info => (
//         <div
//           key={info.trade}
//           onClick={() => setCurrentTrade(info.trade)}
//           className={`cursor-pointer p-8 rounded-[2rem] border-2 transition-all ${currentTrade === info.trade ? 'border-blue-600 bg-blue-50 shadow-lg' : 'border-slate-100 bg-white hover:border-slate-200 shadow-sm'}`}
//         >
//           <div
//             className={`w-14 h-14 ${info.color} rounded-xl flex items-center justify-center text-3xl mb-6 shadow-md`}
//           >
//             {info.icon}
//           </div>
//           <h3 className="font-black text-xl uppercase text-slate-900">{info.trade}</h3>
//           <p className="text-xs font-bold text-slate-400 mt-2 uppercase">
//             {questions.filter(q => q.trade === info.trade).length} Modules Ready
//           </p>
//         </div>
//       ))}
//     </div>

//     {currentTrade && (
//       <div className="fixed inset-x-0 bottom-0 p-8 bg-white/95 backdrop-blur-xl border-t z-50">
//         <div className="max-w-4xl mx-auto flex items-center justify-between">
//           <div>
//             <h3 className="text-xl font-black uppercase">{currentTrade}</h3>
//             <p className="text-slate-400 text-sm">
//               {questions.filter(q => q.trade === currentTrade).length} questions available
//             </p>
//           </div>
//           <div className="flex gap-4">
//             <button
//               onClick={() => onStart(currentTrade, QuizMode.PRACTICE)}
//               className="px-8 py-4 bg-slate-100 font-black rounded-xl uppercase hover:bg-slate-200 transition-all"
//             >
//               Practice
//             </button>
//             <button
//               onClick={() => onStart(currentTrade, QuizMode.TIMED)}
//               className="px-8 py-4 bg-blue-600 text-white font-black rounded-xl uppercase shadow-lg hover:bg-blue-500 transition-all"
//             >
//               Final Exam
//             </button>
//           </div>
//         </div>
//       </div>
//     )}
//   </div>
// );

// // ─── OFFLINE BADGE ────────────────────────────────────────────────────────────
// const OfflineBadge: React.FC<{ isOnline: boolean }> = ({ isOnline }) => (
//   <div
//     className={`fixed top-4 left-1/2 -translate-x-1/2 z-[100] px-4 py-1.5 rounded-full border text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-all shadow-lg backdrop-blur-md ${isOnline ? 'bg-green-500/10 border-green-500/30 text-green-500' : 'bg-orange-500/10 border-orange-500/30 text-orange-500 animate-pulse'}`}
//   >
//     <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500' : 'bg-orange-500'}`}></span>
//     {isOnline ? 'Cloud Sync Online' : 'Local Offline Mode Active'}
//   </div>
// );

// // ─── APP ──────────────────────────────────────────────────────────────────────
// const App: React.FC = () => {
//   const [view, setView] = useState<View>('LANDING');
//   const [questions, setQuestions] = useState<Question[]>(INITIAL_QUESTIONS);
//   const [isLoading, setIsLoading] = useState(true);
//   const [isOnline, setIsOnline] = useState(navigator.onLine);
//   const [user, setUser] = useState<any>(null);
//   const [currentTrade, setCurrentTrade] = useState<Trade | null>(null);
//   const [session, setSession] = useState<QuizSession | null>(null);
//   const [stats, setStats] = useState<UserStats>({
//     totalQuizzes: 0,
//     averageScore: 0,
//     bestTrade: null,
//     history: [],
//   });

//   // Auth form state — lifted here, passed down as stable props
//   const [authMode, setAuthMode] = useState<'LOGIN' | 'REGISTER'>('LOGIN');
//   const [authData, setAuthData] = useState({ name: '', email: '', password: '' });
//   const [authError, setAuthError] = useState('');

//   // Online/offline detection + initial load
//   useEffect(() => {
//     const handleStatusChange = () => setIsOnline(navigator.onLine);
//     window.addEventListener('online', handleStatusChange);
//     window.addEventListener('offline', handleStatusChange);

//     const savedUser = localStorage.getItem('ncaa_user_data');
//     if (savedUser) {
//       try {
//         const parsed = JSON.parse(savedUser);
//         setUser(parsed);
//         if (parsed.stats) setStats(parsed.stats);
//       } catch (e) {
//         console.error('Failed to parse user data', e);
//       }
//     }

//     const loadQuestions = async () => {
//       try {
//         const data = await apiService.fetchQuestions();
//         if (data.length > 0) setQuestions(data);
//       } catch {
//         console.log('Using default or cached questions.');
//       } finally {
//         setIsLoading(false);
//       }
//     };
//     loadQuestions();

//     return () => {
//       window.removeEventListener('online', handleStatusChange);
//       window.removeEventListener('offline', handleStatusChange);
//     };
//   }, []);

//   // Quiz actions
//   const startQuiz = useCallback(
//     (trade: Trade, mode: QuizMode) => {
//       const tradeQuestions = questions.filter(q => q.trade === trade);
//       if (tradeQuestions.length === 0) {
//         alert('No questions found for this trade yet.');
//         return;
//       }
//       const shuffled = [...tradeQuestions].sort(() => Math.random() - 0.5);
//       const sessionQuestions = shuffled.slice(0, 10);
//       setSession({
//         trade,
//         mode,
//         questions: sessionQuestions,
//         currentQuestionIndex: 0,
//         userAnswers: {},
//         startTime: Date.now(),
//         timeRemaining: mode === QuizMode.TIMED ? 600 : 0,
//       });
//       setView('QUIZ');
//     },
//     [questions]
//   );

//   const handleAnswer = useCallback((questionId: string, answerId: string) => {
//     setSession(prev => {
//       if (!prev || prev.userAnswers[questionId]) return prev;
//       return { ...prev, userAnswers: { ...prev.userAnswers, [questionId]: answerId } };
//     });
//   }, []);

//   const finishQuiz = useCallback(async () => {
//     setSession(prev => {
//       if (!prev) return null;
//       return { ...prev, endTime: Date.now() };
//     });
//     setView('RESULTS');

//     // Sync stats
//     setSession(prev => {
//       if (!prev) return null;
//       const score = prev.questions.reduce(
//         (acc, q) => acc + (prev.userAnswers[q.id] === q.correctAnswer ? 1 : 0),
//         0
//       );
//       if (user) {
//         apiService
//           .updateStats({ trade: prev.trade, score, total: prev.questions.length })
//           .then(updatedStats => {
//             if (updatedStats) {
//               setStats(updatedStats);
//               const updatedUser = { ...user, stats: updatedStats };
//               setUser(updatedUser);
//               localStorage.setItem('ncaa_user_data', JSON.stringify(updatedUser));
//             }
//           })
//           .catch(e => console.warn('Stats sync failed', e));
//       }
//       return prev;
//     });
//   }, [user]);

//   const nextQuestion = useCallback(() => {
//     setSession(prev => {
//       if (!prev) return null;
//       if (prev.currentQuestionIndex < prev.questions.length - 1) {
//         return { ...prev, currentQuestionIndex: prev.currentQuestionIndex + 1 };
//       }
//       return prev;
//     });
//     setSession(prev => {
//       if (!prev) return null;
//       if (prev.currentQuestionIndex >= prev.questions.length - 1) {
//         finishQuiz();
//       }
//       return prev;
//     });
//   }, [finishQuiz]);

//   // Simpler next question handler
//   const handleNext = useCallback(() => {
//     if (!session) return;
//     if (session.currentQuestionIndex < session.questions.length - 1) {
//       setSession(prev => prev ? { ...prev, currentQuestionIndex: prev.currentQuestionIndex + 1 } : null);
//     } else {
//       finishQuiz();
//     }
//   }, [session, finishQuiz]);

//   // Timed exam countdown
//   useEffect(() => {
//     if (!session || session.mode !== QuizMode.TIMED || session.timeRemaining <= 0 || session.endTime) return;
//     const timer = setInterval(() => {
//       setSession(prev => {
//         if (!prev) return null;
//         if (prev.timeRemaining <= 1) {
//           clearInterval(timer);
//           return { ...prev, timeRemaining: 0 };
//         }
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

//   // Auth handler
//   const handleAuth = useCallback(
//     async (e: React.FormEvent) => {
//       e.preventDefault();
//       setAuthError('');
//       try {
//         let data;
//         if (authMode === 'LOGIN') {
//           data = await apiService.login({ email: authData.email, password: authData.password });
//         } else {
//           data = await apiService.register({ name: authData.name, email: authData.email, password: authData.password });
//         }
//         setUser(data);
//         if (data.stats) setStats(data.stats);
//         setView('DASHBOARD');
//       } catch (err: any) {
//         setAuthError(err.message || 'Authentication failed');
//       }
//     },
//     [authMode, authData]
//   );

//   const handleAbortQuiz = useCallback(() => {
//     if (confirm('Abort mission?')) setView('DASHBOARD');
//   }, []);

//   return (
//     <Layout currentView={view} setView={setView} user={user}>
//       <OfflineBadge isOnline={isOnline} />

//       {view === 'LANDING' && (
//         <LandingView onEnter={() => setView('AUTH')} onFleet={() => setView('FLEET_SPECS')} />
//       )}

//       {view === 'AUTH' && (
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
//         />
//       )}

//       {view === 'QUIZ' && session && (
//         <QuizView
//           session={session}
//           onAnswer={handleAnswer}
//           onNext={handleNext}
//           onAbort={handleAbortQuiz}
//         />
//       )}

//       {view === 'RESULTS' && (
//         <div className="max-w-xl mx-auto py-20 text-center space-y-8">
//           <div className="bg-white p-12 rounded-[2rem] border shadow-xl">
//             <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl">✓</div>
//             <h2 className="text-4xl font-black uppercase mb-4">Mission Complete</h2>
//             <p className="text-slate-500 font-medium mb-4">
//               Score:{' '}
//               <span className="font-black text-slate-900">
//                 {session
//                   ? `${session.questions.reduce((acc, q) => acc + (session.userAnswers[q.id] === q.correctAnswer ? 1 : 0), 0)} / ${session.questions.length}`
//                   : '—'}
//               </span>
//             </p>
//             <p className="text-slate-400 font-medium mb-10">Operation data has been synchronized.</p>
//             <div className="flex gap-4">
//               <button
//                 onClick={() => setView('DASHBOARD')}
//                 className="flex-1 px-8 py-5 bg-slate-100 rounded-xl font-black uppercase hover:bg-slate-200 transition-all"
//               >
//                 Home
//               </button>
//               <button
//                 onClick={() => setView('REVIEW')}
//                 className="flex-1 px-8 py-5 bg-slate-950 text-white rounded-xl font-black uppercase shadow-lg hover:bg-blue-600 transition-all"
//               >
//                 Review
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {view === 'REVIEW' && (
//         <ReviewView session={session} onClose={() => setView('DASHBOARD')} />
//       )}

//       {view === 'ADMIN' && user?.role === 'admin' && (
//         <AdminView questions={questions} setQuestions={setQuestions} />
//       )}

//       {view === 'PROFILE' && <ProfileView user={user} stats={stats} />}

//       {view === 'FLEET_SPECS' && (
//         <div className="p-10">
//           <h2 className="text-4xl font-black uppercase mb-10">Fleet Intelligence</h2>
//           <p className="text-slate-400 mb-6">Aviation trade specifications and certification requirements.</p>
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//             {TRADE_INFO.map(info => (
//               <div key={info.trade} className="bg-white p-6 rounded-2xl border shadow-sm">
//                 <div className={`w-12 h-12 ${info.color} rounded-xl flex items-center justify-center text-2xl mb-4`}>
//                   {info.icon}
//                 </div>
//                 <h3 className="font-black text-lg uppercase text-slate-900">{info.trade}</h3>
//               </div>
//             ))}
//           </div>
//           <button
//             onClick={() => setView('LANDING')}
//             className="mt-10 text-blue-600 font-black uppercase hover:text-blue-700"
//           >
//             ← Back
//           </button>
//         </div>
//       )}
//     </Layout>
//   );
// };

// export default App;
