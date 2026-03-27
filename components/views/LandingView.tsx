import React from 'react';
export const OfflineBadge: React.FC<{ isOnline: boolean }> = ({ isOnline }) => (
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



const socialPlatforms = [
  {
    name: 'Facebook',
    href: 'https://www.facebook.com',
    cta: 'Follow on Facebook',
    color: 'from-blue-600/30 to-blue-500/10 border-blue-400/40 text-blue-100',
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor" aria-hidden="true">
        <path d="M13.5 8.25V6.75c0-.69.56-1.25 1.25-1.25H16.5V2.5h-2.25A4.25 4.25 0 0 0 10 6.75v1.5H7.5v3h2.5v9h3.5v-9h2.62l.38-3h-3Z" />
      </svg>
    ),
  },
  {
    name: 'Instagram',
    href: 'https://www.instagram.com',
    cta: 'See Instagram',
    color: 'from-fuchsia-500/30 to-orange-400/10 border-fuchsia-300/40 text-fuchsia-100',
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
  name: 'Twitter',
  href: 'https://x.com/HallenjayArt',
  cta: 'Follow on Twitter',
  color: 'from-gray-500/30 to-gray-400/10 border-gray-300/40 text-gray-100',
  icon: (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor" aria-hidden="true">
      <path d="M18.244 2H21l-6.56 7.5L22 22h-6.828l-5.34-6.99L3.5 22H1l7.03-8.03L2 2h6.92l4.86 6.44L18.244 2Zm-2.39 18h1.89L8.1 4H6.08l9.774 16Z" />
    </svg>
  ),
},
  {
    name: 'LinkedIn',
    href: 'https://www.linkedin.com',
    cta: 'Connect on LinkedIn',
    color: 'from-sky-600/30 to-sky-500/10 border-sky-300/40 text-sky-100',
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor" aria-hidden="true">
        <path d="M6.2 8.1a2.1 2.1 0 1 1 0-4.2 2.1 2.1 0 0 1 0 4.2ZM4.5 9.7h3.4v9.8H4.5V9.7Zm5.3 0h3.3v1.4h.05c.46-.88 1.6-1.8 3.3-1.8 3.52 0 4.17 2.2 4.17 5.07v5.13h-3.45v-4.55c0-1.08-.02-2.47-1.6-2.47-1.6 0-1.84 1.18-1.84 2.4v4.62H9.8V9.7Z" />
      </svg>
    ),
  },
];

const MissionTrackIcon: React.FC<{ type: 'ground' | 'maintenance' | 'operations' }> = ({ type }) => {
  const iconMap = {
    ground: (
      <>
        <path d="M6 16h12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M5 13h14l-2.5-3.5H7.5Z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
        <circle cx="8" cy="18" r="1.4" fill="currentColor" />
        <circle cx="16" cy="18" r="1.4" fill="currentColor" />
      </>
    ),
    maintenance: (
      <>
        <path d="M12 4.5v3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M8.2 6.1l1.7 2.4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M15.8 6.1l-1.7 2.4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        <circle cx="12" cy="13" r="4.3" fill="none" stroke="currentColor" strokeWidth="1.8" />
        <path d="M12 10.8v4.4M9.8 13h4.4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </>
    ),
    operations: (
      <>
        <path d="M4.5 15.5 12 5l7.5 10.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M12 10.2v8.3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M8.8 15.5h6.4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </>
    ),
  } as const;

  return (
    <svg viewBox="0 0 24 24" className="w-6 h-6" aria-hidden="true">
      {iconMap[type]}
    </svg>
  );
};
// ─── LANDING VIEW ────────────────────────────────────────────────────────────
export const LandingView: React.FC<{ onEnter: () => void; onFleet: () => void }> = ({ onEnter, onFleet }) => {
  const missionTracks = [
    {
      title: 'Pilot Ground School',
      details: 'IFR procedures, abnormal checklist drills, and recurrent checkride prep.',
      icon: 'ground' as const,
    },
    {
      title: 'Maintenance Certification',
      details: 'AMM-driven troubleshooting flows, MEL decisions, and release-to-service scenarios.',
      icon: 'maintenance' as const,
    },
    {
      title: 'Operations Control',
      details: 'Dispatch release planning, ATC phraseology, and weather-risk decision exercises.',
      icon: 'operations' as const,
    },
  ];

  const metrics = [
    { label: 'Scenario Library', value: '1,200+' },
    { label: 'Active Cadets', value: '8.4K' },
    { label: 'Avg Readiness Gain', value: '+32%' },
    { label: 'Mission Uptime', value: '99.9%' },
  ];

  const operations = [
    {
      title: 'Adaptive Mission Engine',
      copy: 'Each quiz path adjusts in real time based on your response confidence and weak areas.',
    },
    {
      title: 'Command Analytics',
      copy: 'Live heatmaps show where your crew loses points so revision time stays tactical.',
    },
    {
      title: 'Offline-First Field Mode',
      copy: 'Continue training with local persistence, then sync back once internet is restored.',
    },
  ];

  return (
    <div className="bg-[#020617] text-white relative overflow-x-hidden">
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="battle-grid" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(14,116,255,0.26),transparent_40%),radial-gradient(circle_at_80%_20%,rgba(16,185,129,0.2),transparent_36%),radial-gradient(circle_at_50%_85%,rgba(251,191,36,0.16),transparent_45%)]" />
        <div className="battle-pulse battle-pulse-a" />
        <div className="battle-pulse battle-pulse-b" />
      </div>

      <section className="min-h-screen relative z-10 px-6 pt-28 pb-20 flex items-center">
        <div className="max-w-6xl mx-auto w-full grid lg:grid-cols-2 gap-14 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-blue-400/40 bg-blue-500/10 text-xs font-black uppercase tracking-[0.2em] text-blue-300 mb-6">
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping" />
              Mission Command Portal
            </div>
            <h1 className="text-5xl md:text-7xl font-black leading-[0.92] tracking-tight mb-6">
              Train Like
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-200 to-emerald-300">
                Flight Operations
              </span>
            </h1>
            <p className="text-slate-300 text-lg leading-relaxed max-w-xl mb-9">
              NCAA Prep is an aviation exam-readiness platform for pilots, engineers, dispatchers, cabin crew, and ATC trainees.
              Build knowledge with role-specific question banks, timed assessments, and post-flight debrief analytics.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={onEnter}
                className="px-8 py-4 rounded-xl font-black tracking-wide bg-blue-600 hover:bg-blue-500 transition-all shadow-[0_0_40px_rgba(37,99,235,0.4)]"
              >
                OPEN COURSE CATALOG
              </button>
              <button
                onClick={onFleet}
                className="px-8 py-4 rounded-xl font-black tracking-wide border border-slate-500/60 bg-slate-900/50 hover:bg-slate-800/80 transition-all"
              >
                MISSION OVERVIEW
              </button>
            </div>
          </div>

          <div className="relative">
            <div className="agusta-landing-wrapper" aria-hidden="true">
              <div className="agusta-shadow-right" />
              <div className="agusta-shadow-left" />
              <div className="agusta-helicopter agusta-helicopter-right">
                <AgustaW109Nigerian />
              </div>
              <div className="agusta-helicopter agusta-helicopter-left">
                <AgustaW109Nigerian />
              </div>
            </div>
            <div className="relative min-h-[440px] rounded-3xl border border-white/10 bg-slate-950/40 backdrop-blur-sm overflow-hidden" />
          </div>
        </div>
      </section>

      <section className="relative z-10 px-6 py-20 border-y border-white/10 bg-slate-950/50">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
          {metrics.map(metric => (
            <div key={metric.label} className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
              <p className="text-xs uppercase tracking-widest text-slate-400 font-bold">{metric.label}</p>
              <p className="text-3xl md:text-4xl font-black mt-3 text-white">{metric.value}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="relative z-10 px-6 py-24">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-black mb-4">Mission Tracks</h2>
          <p className="text-slate-300 max-w-2xl mb-10">Structured pathways designed to mirror real aviation pressure and cadence.</p>
          <div className="grid md:grid-cols-3 gap-6">
            {missionTracks.map(track => (
              <article key={track.title} className="rounded-3xl border border-white/10 bg-gradient-to-b from-white/10 to-white/0 p-7 hover:-translate-y-1 transition-transform">
                <div className="w-12 h-12 rounded-xl bg-blue-500/20 border border-blue-300/30 mb-4 grid place-items-center text-blue-200">
                  <MissionTrackIcon type={track.icon} />
                </div>
                <h3 className="text-xl font-black mb-3">{track.title}</h3>
                <p className="text-slate-300 leading-relaxed">{track.details}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="relative z-10 px-6 py-24 bg-slate-900/50 border-y border-white/10">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-8 items-start">
          <div>
            <h2 className="text-4xl md:text-5xl font-black mb-4">Training Operations</h2>
            <p className="text-slate-300 leading-relaxed max-w-xl">
              Every module is built for NCAA-style aviation certification prep with realistic operational pressure
              and role-specific performance feedback.
            </p>
          </div>
          <div className="space-y-4">
            {operations.map((item, idx) => (
              <div key={item.title} className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
                <p className="text-xs uppercase tracking-[0.2em] text-blue-300 font-black mb-2">0{idx + 1}</p>
                <h3 className="text-2xl font-black mb-2">{item.title}</h3>
                <p className="text-slate-300">{item.copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative z-10 px-6 py-24 border-b border-white/10">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-8">
          <article className="rounded-3xl border border-white/10 bg-white/5 p-8">
            <p className="text-xs uppercase tracking-[0.2em] text-emerald-300 font-black mb-3">About</p>
            <h3 className="text-3xl font-black mb-4">Built for modern aviation teams.</h3>
            <p className="text-slate-300 leading-relaxed">
              NCAA Prep blends operational realism with focused study loops so cadets can move
              from reading to readiness faster with safer decisions.
            </p>
          </article>
          <article className="rounded-3xl border border-white/10 bg-white/5 p-8">
            <p className="text-xs uppercase tracking-[0.2em] text-blue-300 font-black mb-3">Platform</p>
            <h3 className="text-3xl font-black mb-4">Join the Future of Aviation Training</h3>
            <p className="text-slate-300 leading-relaxed">
We provide a centralized, digital-first learning environment tailored for aviation professionals, making it easier to prepare for licensing exams with structured content, practice tools, and real-time progress tracking.            </p>
          </article>
        </div>
      </section>

      <section className="relative z-10 px-6 py-24">
        <div className="max-w-4xl mx-auto rounded-3xl border border-white/10 bg-slate-900/70 p-8 md:p-10">
          <p className="text-xs uppercase tracking-[0.2em] text-blue-300 font-black mb-3">Contact</p>
          <h3 className="text-3xl font-black mb-6">Contact Form</h3>
          <form
            className="grid md:grid-cols-2 gap-4"
            onSubmit={(e) => {
              e.preventDefault();
              alert('Message received. We will reach out shortly.');
            }}
          >
            <input required placeholder="Name" className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white" />
            <input type="email" required placeholder="Email" className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white" />
            <input placeholder="Organization" className="md:col-span-2 bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white" />
            <textarea required rows={4} placeholder="How can we help your training program?" className="md:col-span-2 bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white" />
            <button type="submit" className="md:col-span-2 px-6 py-4 rounded-xl font-black bg-blue-600 hover:bg-blue-500 transition-all">
              SEND MESSAGE
            </button>
          </form>
        </div>
      </section>

      <section className="relative z-10 px-6 pt-10 pb-20">
        <div className="max-w-6xl mx-auto rounded-3xl border border-white/10 bg-gradient-to-r from-blue-900/50 via-slate-900/70 to-emerald-900/40 p-10 md:p-14 text-center">
          <p className="text-xs uppercase tracking-[0.25em] text-blue-200 font-black mb-4">Final Call</p>
          <h2 className="text-4xl md:text-5xl font-black mb-5">Ready for your next certification sortie?</h2>
          <p className="text-slate-200 max-w-2xl mx-auto mb-8">
            Browse course sectors now, then sign in to launch graded practice or timed check assessments.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button onClick={onEnter} className="px-8 py-4 rounded-xl font-black bg-white text-slate-900 hover:bg-blue-100 transition-all">
              VIEW COURSES
            </button>
            <button onClick={onFleet} className="px-8 py-4 rounded-xl font-black border border-white/40 hover:bg-white/10 transition-all">
              OPEN ROLE BRIEFS
            </button>
          </div>
        </div>
      </section>

      <footer className="relative z-10 border-t border-white/10 bg-slate-950/95 px-6 py-10">
        <div className="max-w-6xl mx-auto space-y-6 text-sm text-slate-400">
          <div className="flex flex-wrap gap-3">
            {socialPlatforms.map((platform) => (
              <a
                key={platform.name}
                href={platform.href}
                target="_blank"
                rel="noreferrer"
                className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2 font-bold transition-all hover:-translate-y-0.5 bg-gradient-to-r ${platform.color}`}
              >
                <span className="grid place-items-center">{platform.icon}</span>
                <span>{platform.cta}</span>
              </a>
            ))}
          </div>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <p>© {new Date().getFullYear()} NCAA Prep. Aviation readiness with confidence.</p>
            <div className="flex gap-4">
              <a className="hover:text-white transition-colors" href="#">Privacy</a>
              <a className="hover:text-white transition-colors" href="#">Terms</a>
              <a className="hover:text-white transition-colors" href="#">Support</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
