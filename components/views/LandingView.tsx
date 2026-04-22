import React, { useEffect, useRef, useState, useCallback } from 'react';

// ─── OFFLINE BADGE ────────────────────────────────────────────────────────────
export const OfflineBadge: React.FC<{ isOnline: boolean }> = ({ isOnline }) => (
  <div
    style={{ fontFamily: "'Space Mono', monospace" }}
    className={`fixed top-4 left-1/2 -translate-x-1/2 z-[100] px-4 py-1.5 border text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2 shadow-lg ${
      isOnline
        ? 'bg-white border-black text-black'
        : 'bg-black border-black text-[#00FF87] animate-pulse'
    }`}
  >
    <span className={`w-2 h-2 ${isOnline ? 'bg-black' : 'bg-[#00FF87]'}`} />
    {isOnline ? 'Cloud Online' : 'offline Mode'}
  </div>
);

// ─── NIGERIAN AGUSTA 109 SVG ──────────────────────────────────────────────────
const AgustaW109Nigerian = () => (
  <svg viewBox="0 0 620 240" xmlns="http://www.w3.org/2000/svg" role="presentation" aria-hidden="true">
    <defs>
      <linearGradient id="body-grad2" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#1a7a1a" />
        <stop offset="40%" stopColor="#006400" />
        <stop offset="100%" stopColor="#003d00" />
      </linearGradient>
      <linearGradient id="top-grad2" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#2a9a2a" />
        <stop offset="100%" stopColor="#006400" />
      </linearGradient>
      <linearGradient id="glass-grad2" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#7dd3fc" stopOpacity="0.95" />
        <stop offset="50%" stopColor="#0ea5e9" stopOpacity="0.85" />
        <stop offset="100%" stopColor="#0369a1" stopOpacity="0.9" />
      </linearGradient>
      <linearGradient id="gold-grad2" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#fbbf24" />
        <stop offset="100%" stopColor="#d97706" />
      </linearGradient>
      <linearGradient id="engine-grad2" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#374151" />
        <stop offset="50%" stopColor="#1f2937" />
        <stop offset="100%" stopColor="#111827" />
      </linearGradient>
      <linearGradient id="tail-grad2" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#006400" />
        <stop offset="70%" stopColor="#004d00" />
        <stop offset="100%" stopColor="#002800" />
      </linearGradient>
      <linearGradient id="skid-grad2" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#9ca3af" />
        <stop offset="100%" stopColor="#4b5563" />
      </linearGradient>
    </defs>
    <path d="M390 102 L560 88 Q585 87 595 95 Q598 100 592 108 Q586 114 560 114 L390 118 Z" fill="url(#tail-grad2)" stroke="#002800" strokeWidth="1" />
    <path d="M420 105 L555 93 L558 98 L422 110 Z" fill="white" opacity="0.3" />
    <path d="M540 88 L575 68 L585 70 L565 90 Z" fill="#005000" stroke="#002800" strokeWidth="1" />
    <path d="M540 114 L575 134 L585 132 L565 112 Z" fill="#005000" stroke="#002800" strokeWidth="1" />
    <ellipse cx="590" cy="101" rx="9" ry="9" fill="#1f2937" stroke="#374151" strokeWidth="1.5" />
    <g>
      <rect x="576" y="99" width="28" height="4" rx="2" fill="#d1d5db" />
      <rect x="588" y="87" width="4" height="28" rx="2" fill="#d1d5db" />
    </g>
    <path d="M130 148 L360 148 Q400 148 410 138 L390 118 L390 102 L410 82 Q400 72 360 72 L130 72 Q80 72 55 90 Q30 108 30 110 Q30 120 55 130 Q80 148 130 148 Z" fill="url(#body-grad2)" stroke="#002800" strokeWidth="1.5" />
    <path d="M150 72 L350 72 L350 148 L150 148 Z" fill="white" opacity="0.12" />
    <path d="M130 74 L195 74 L195 146 L130 146 Q90 143 65 128 L65 92 Q90 77 130 74 Z" fill="#006400" opacity="0.9" />
    <path d="M195 74 L240 74 L240 146 L195 146 Z" fill="white" opacity="0.85" />
    <path d="M240 74 L310 74 L310 146 L240 146 Z" fill="#006400" opacity="0.9" />
    <path d="M310 74 L355 74 L355 146 L310 146 Z" fill="white" opacity="0.85" />
    <path d="M355 74 L390 80 L390 120 L355 146 Z" fill="#006400" opacity="0.9" />
    <path d="M140 72 L370 72 L380 62 L380 58 L140 58 Q100 58 75 68 L75 72 Z" fill="url(#top-grad2)" stroke="#002800" strokeWidth="1" />
    <path d="M120 58 L380 58 L382 54 L118 54 Z" fill="url(#gold-grad2)" opacity="0.9" />
    <rect x="180" y="40" width="90" height="22" rx="8" fill="url(#engine-grad2)" stroke="#374151" strokeWidth="1.5" />
    <rect x="280" y="40" width="90" height="22" rx="8" fill="url(#engine-grad2)" stroke="#374151" strokeWidth="1.5" />
    <ellipse cx="268" cy="46" rx="7" ry="5" fill="#1f2937" stroke="#6b7280" strokeWidth="1" />
    <ellipse cx="368" cy="46" rx="7" ry="5" fill="#1f2937" stroke="#6b7280" strokeWidth="1" />
    <ellipse cx="268" cy="46" rx="4" ry="3" fill="#f97316" opacity="0.6" />
    <ellipse cx="368" cy="46" rx="4" ry="3" fill="#f97316" opacity="0.6" />
    <line x1="195" y1="44" x2="195" y2="58" stroke="#6b7280" strokeWidth="1" />
    <line x1="205" y1="44" x2="205" y2="58" stroke="#6b7280" strokeWidth="1" />
    <line x1="215" y1="44" x2="215" y2="58" stroke="#6b7280" strokeWidth="1" />
    <line x1="295" y1="44" x2="295" y2="58" stroke="#6b7280" strokeWidth="1" />
    <line x1="305" y1="44" x2="305" y2="58" stroke="#6b7280" strokeWidth="1" />
    <line x1="315" y1="44" x2="315" y2="58" stroke="#6b7280" strokeWidth="1" />
    <rect x="270" y="22" width="12" height="22" rx="3" fill="#374151" stroke="#6b7280" strokeWidth="1" />
    <ellipse cx="276" cy="22" rx="10" ry="5" fill="#4b5563" />
    <g style={{ transformOrigin: '276px 20px', animation: 'rotor-spin 0.1s linear infinite' }}>
      <path d="M276 20 L560 10 L558 30 L276 20 Z" fill="#1f2937" stroke="#374151" strokeWidth="0.5" />
      <path d="M276 20 L-8 10 L-6 30 L276 20 Z" fill="#1f2937" stroke="#374151" strokeWidth="0.5" />
      <path d="M276 20 L278 -270 L298 -268 L276 20 Z" fill="#374151" stroke="#4b5563" strokeWidth="0.5" />
      <circle cx="276" cy="20" r="10" fill="#6b7280" stroke="#9ca3af" strokeWidth="1.5" />
      <circle cx="276" cy="20" r="5" fill="#374151" />
    </g>
    <path d="M130 72 Q80 72 55 90 Q30 108 30 110 Q30 120 55 130 Q80 148 130 148 L140 148 L140 72 Z" fill="url(#gold-grad2)" stroke="#d97706" strokeWidth="1.5" />
    <path d="M55 90 Q30 108 30 110 Q30 120 55 130 L65 128 Q50 115 50 110 Q50 105 65 92 Z" fill="#d97706" />
    <path d="M80 80 Q68 82 64 95 Q62 103 64 115 Q68 125 80 126 L128 124 L128 78 Z" fill="url(#glass-grad2)" stroke="#0284c7" strokeWidth="1.5" opacity="0.92" />
    <path d="M128 78 L140 78 L140 122 L128 122 Z" fill="url(#glass-grad2)" stroke="#0284c7" strokeWidth="1" opacity="0.88" />
    <path d="M80 80 Q68 82 64 95 Q62 103 64 115 Q68 125 80 126 L128 124 L128 78 Z" fill="none" stroke="#fed7aa" strokeWidth="2" />
    <path d="M72 85 Q66 88 66 96 L72 95 Z" fill="white" opacity="0.4" />
    <rect x="158" y="84" width="38" height="30" rx="6" fill="url(#glass-grad2)" stroke="#0284c7" strokeWidth="1.5" opacity="0.85" />
    <rect x="210" y="84" width="38" height="30" rx="6" fill="url(#glass-grad2)" stroke="#0284c7" strokeWidth="1.5" opacity="0.85" />
    <rect x="262" y="84" width="38" height="30" rx="6" fill="url(#glass-grad2)" stroke="#0284c7" strokeWidth="1.5" opacity="0.85" />
    <rect x="160" y="86" width="12" height="8" rx="3" fill="white" opacity="0.3" />
    <rect x="212" y="86" width="12" height="8" rx="3" fill="white" opacity="0.3" />
    <rect x="264" y="86" width="12" height="8" rx="3" fill="white" opacity="0.3" />
    <text x="220" y="142" fontFamily="monospace" fontWeight="bold" fontSize="11" fill="#1a1a1a" opacity="0.9" textAnchor="middle">5N-NCA</text>
    <path d="M160 148 L350 148 L352 154 L158 154 Z" fill="#003d00" opacity="0.6" />
    <line x1="148" y1="148" x2="138" y2="185" stroke="url(#skid-grad2)" strokeWidth="5" strokeLinecap="round" />
    <line x1="340" y1="148" x2="350" y2="185" stroke="url(#skid-grad2)" strokeWidth="5" strokeLinecap="round" />
    <line x1="110" y1="175" x2="175" y2="175" stroke="#6b7280" strokeWidth="3.5" strokeLinecap="round" />
    <line x1="320" y1="185" x2="385" y2="185" stroke="#6b7280" strokeWidth="3.5" strokeLinecap="round" />
    <path d="M85 185 Q100 190 175 185 Q190 182 195 178" fill="none" stroke="url(#skid-grad2)" strokeWidth="5" strokeLinecap="round" />
    <path d="M300 180 Q340 188 410 182 Q420 178 425 174" fill="none" stroke="url(#skid-grad2)" strokeWidth="5" strokeLinecap="round" />
    <circle cx="40" cy="110" r="5" fill="#ef4444" opacity="0.9" />
    <circle cx="40" cy="110" r="8" fill="#ef4444" opacity="0.2" />
    <circle cx="276" cy="15" r="4" fill="#fbbf24" opacity="0.95" />
    <circle cx="276" cy="15" r="7" fill="#fbbf24" opacity="0.2" />
    <circle cx="596" cy="101" r="3" fill="#60a5fa" opacity="0.9" />
    <g transform="translate(172, 95)" opacity="0.7">
      <circle cx="8" cy="8" r="7" fill="#fbbf24" />
      <text x="8" y="12" textAnchor="middle" fontSize="9" fill="#006400" fontWeight="bold">✦</text>
    </g>
    <line x1="152" y1="75" x2="152" y2="146" stroke="#002800" strokeWidth="1" opacity="0.5" />
    <line x1="202" y1="75" x2="202" y2="146" stroke="#002800" strokeWidth="0.8" opacity="0.4" />
    <line x1="302" y1="75" x2="302" y2="146" stroke="#002800" strokeWidth="0.8" opacity="0.4" />
    <line x1="30" y1="108" x2="8" y2="106" stroke="#9ca3af" strokeWidth="2" />
    <circle cx="8" cy="106" r="2" fill="#9ca3af" />
  </svg>
);

// ─── SOCIAL PLATFORMS ─────────────────────────────────────────────────────────
const socialPlatforms = [
  {
    name: 'Facebook',
    href: 'https://www.facebook.com',
    cta: 'Follow on Facebook',
    icon: (
      <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
        <path d="M13.5 8.25V6.75c0-.69.56-1.25 1.25-1.25H16.5V2.5h-2.25A4.25 4.25 0 0 0 10 6.75v1.5H7.5v3h2.5v9h3.5v-9h2.62l.38-3h-3Z" />
      </svg>
    ),
  },
  {
    name: 'Instagram',
    href: 'https://www.instagram.com',
    cta: 'See Instagram',
    icon: (
      <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2">
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
    icon: (
      <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
        <path d="M18.244 2H21l-6.56 7.5L22 22h-6.828l-5.34-6.99L3.5 22H1l7.03-8.03L2 2h6.92l4.86 6.44L18.244 2Zm-2.39 18h1.89L8.1 4H6.08l9.774 16Z" />
      </svg>
    ),
  },
  {
    name: 'LinkedIn',
    href: 'https://www.linkedin.com',
    cta: 'Connect on LinkedIn',
    icon: (
      <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
        <path d="M6.2 8.1a2.1 2.1 0 1 1 0-4.2 2.1 2.1 0 0 1 0 4.2ZM4.5 9.7h3.4v9.8H4.5V9.7Zm5.3 0h3.3v1.4h.05c.46-.88 1.6-1.8 3.3-1.8 3.52 0 4.17 2.2 4.17 5.07v5.13h-3.45v-4.55c0-1.08-.02-2.47-1.6-2.47-1.6 0-1.84 1.18-1.84 2.4v4.62H9.8V9.7Z" />
      </svg>
    ),
  },
];

// ─── LANDING VIEW ─────────────────────────────────────────────────────────────
export const LandingView: React.FC<{ onEnter: () => void; onFleet: () => void }> = ({
  onEnter,
  onFleet,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -999, y: -999 });
  const animFrameRef = useRef<number>(0);
  const contactRef = useRef<HTMLElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [hasMoved, setHasMoved] = useState(false);

  const scrollToContact = useCallback(() => {
    contactRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  // ── Canvas interactive background ────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = 0;
    let height = 0;
    const GRID = 38;

    const resize = () => {
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const dots: { x: number; y: number; baseR: number }[] = [];

    const buildDots = () => {
      dots.length = 0;
      const cols = Math.ceil(width / GRID) + 1;
      const rows = Math.ceil(height / GRID) + 1;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          dots.push({ x: c * GRID, y: r * GRID, baseR: 1.2 });
        }
      }
    };
    buildDots();

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw interactive dot grid
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;
      const radius = 180;

      for (const d of dots) {
        const dx = d.x - mx;
        const dy = d.y - my;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const influence = Math.max(0, 1 - dist / radius);

        const r = d.baseR + influence * 5;
        const alpha = 0.12 + influence * 0.7;

        // Color shift near cursor: green accent
        if (influence > 0.01) {
          const g = Math.round(255 * influence);
          const b = Math.round(87 * influence);
          ctx.fillStyle = `rgba(0,${g},${b},${alpha})`;
        } else {
          ctx.fillStyle = `rgba(0,0,0,${alpha})`;
        }

        ctx.beginPath();
        ctx.arc(d.x, d.y, r, 0, Math.PI * 2);
        ctx.fill();
      }

      // Draw crosshair at cursor
      if (mx > 0) {
        ctx.strokeStyle = 'rgba(0,255,87,0.15)';
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 8]);
        ctx.beginPath();
        ctx.moveTo(mx, 0);
        ctx.lineTo(mx, height);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, my);
        ctx.lineTo(width, my);
        ctx.stroke();
        ctx.setLineDash([]);

        // cursor ring
        ctx.strokeStyle = 'rgba(0,255,87,0.35)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(mx, my, 24, 0, Math.PI * 2);
        ctx.stroke();
      }

      animFrameRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener('resize', resize);
    };
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    setMousePos({ x: e.clientX, y: e.clientY });
    if (!hasMoved) setHasMoved(true);
  }, [hasMoved]);

  const handleMouseLeave = useCallback(() => {
    mouseRef.current = { x: -999, y: -999 };
  }, []);

  const missionTracks = [
    {
      num: '01',
      title: 'Pilot Ground School',
      details: 'IFR procedures, abnormal checklist drills, and recurrent checkride prep.',
    },
    {
      num: '02',
      title: 'Maintenance Certification',
      details: 'AMM-driven troubleshooting flows, MEL decisions, and release-to-service scenarios.',
    },
    {
      num: '03',
      title: 'Operations Control',
      details: 'Dispatch release planning, ATC phraseology, and weather-risk decision exercises.',
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
    <div
      className="landing-cursor-none bg-white text-black relative overflow-x-hidden"
      style={{ fontFamily: "'Space Mono', 'Courier New', monospace" }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* ── Custom cursor ───────────────────────────────────────────────────── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Mono:ital,wght@0,400;0,700;1,400&display=swap');
        @keyframes heli-r {
          0%   { opacity:0; transform:translate(400px,-200px) scale(0.3) rotate(15deg); }
          15%  { opacity:1; }
          70%  { transform:translate(30px,10px) scale(1) rotate(1deg); }
          100% { opacity:1; transform:translate(0,0) scale(1) rotate(0deg); }
        }
        @keyframes heli-l {
          0%   { opacity:0; transform:scaleX(-1) translate(360px,-160px) scale(0.28) rotate(-12deg); }
          15%  { opacity:1; }
          70%  { transform:scaleX(-1) translate(20px,8px) scale(0.9) rotate(-1deg); }
          100% { opacity:1; transform:scaleX(-1) translate(0,0) scale(0.9) rotate(0deg); }
        }
        @keyframes rotor-spin { to { transform: rotate(360deg); } }
        .heli-right { animation: heli-r 5s cubic-bezier(.22,.61,.36,1) 0.2s forwards; opacity:0; }
        .heli-left  { animation: heli-l 5s cubic-bezier(.22,.61,.36,1) 1.2s forwards; opacity:0; transform:scaleX(-1); }
        .rotor-main { transform-box:fill-box; transform-origin:center; animation:rotor-spin .09s linear infinite; }
        .ticker { animation: ticker 30s linear infinite; }
        @keyframes ticker { from{transform:translateX(0)} to{transform:translateX(-50%)} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(30px)} to{opacity:1;transform:translateY(0)} }
        .fade-up { animation: fadeUp 0.7s ease forwards; }
        .fade-up-1 { animation: fadeUp 0.7s ease 0.1s forwards; opacity:0; }
        .fade-up-2 { animation: fadeUp 0.7s ease 0.2s forwards; opacity:0; }
        .fade-up-3 { animation: fadeUp 0.7s ease 0.35s forwards; opacity:0; }
        .fade-up-4 { animation: fadeUp 0.7s ease 0.5s forwards; opacity:0; }
      `}</style>

      {/* Custom cursor dot */}
      <div
        className="fixed z-[200] pointer-events-none"
        style={{
          left: mousePos.x - 5,
          top: mousePos.y - 5,
          width: 10,
          height: 10,
          background: '#00FF57',
          border: '1px solid #000',
          transition: 'transform 0.05s',
        }}
      />

      {/* ── INTERACTIVE CANVAS BACKGROUND ─────────────────────────────────── */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 w-full h-full pointer-events-none z-0"
        style={{ opacity: 1 }}
      />

      {/* ══════════════════════ HERO ══════════════════════════════════════════ */}
      <section className="relative z-10 min-h-screen flex flex-col justify-between pt-8 pb-0 border-b-2 border-black">

        {/* NAV BAR */}
        <nav className="px-6 md:px-12 flex items-center justify-between border-b-2 border-black pb-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-black flex items-center justify-center">
              <span className="text-white font-black text-lg" style={{ fontFamily: 'Space Mono, monospace' }}>N</span>
            </div>
            <span className="font-black text-sm uppercase tracking-widest">NCAA PRO</span>
          </div>
          <div className="hidden md:flex items-center gap-6">
            <button
              onClick={onEnter}
              className="text-xs font-bold uppercase tracking-widest hover:text-[#00C850] transition-colors cursor-pointer bg-transparent border-none p-0"
            >
              Courses
            </button>
            <button
              onClick={onFleet}
              className="text-xs font-bold uppercase tracking-widest hover:text-[#00C850] transition-colors cursor-pointer bg-transparent border-none p-0"
            >
              Mission
            </button>
            <button
              onClick={scrollToContact}
              className="text-xs font-bold uppercase tracking-widest hover:text-[#00C850] transition-colors cursor-pointer bg-transparent border-none p-0"
            >
              Contact
            </button>
            <button
              onClick={onEnter}
              className="px-5 py-2 bg-black text-white text-xs font-black uppercase tracking-widest border-2 border-black hover:bg-[#00FF57] hover:text-black transition-colors"
            >
              Enter
            </button>
          </div>
        </nav>

        {/* HERO CONTENT */}
        <div className="flex-1 grid lg:grid-cols-2 gap-0 items-stretch">

          {/* LEFT — Typography */}
          <div className="px-6 md:px-12 pt-16 pb-8 border-r-0 lg:border-r-2 border-black flex flex-col justify-between">
            <div>
              <div className="inline-flex items-center gap-2 border border-black px-3 py-1 mb-8 fade-up-1">
                <span className="w-2 h-2 bg-[#00FF57]" />
                <span className="text-[10px] font-black uppercase tracking-[0.25em]">Mission Command Portal</span>
              </div>

              <h1 className="text-5xl md:text-7xl lg:text-8xl font-black leading-[0.88] tracking-tight mb-8 fade-up-2">
                TRAIN<br />
                <span className="relative">
                  LIKE
                  <span
                    className="absolute inset-0 text-[#00FF57]"
                    style={{ clipPath: 'inset(0 70% 0 0)', transition: 'clip-path 0.5s ease' }}
                  >LIKE</span>
                </span>
                <br />
                <span className="border-l-4 border-[#00FF57] pl-4">FLIGHT</span>
                <br />
                OPS.
              </h1>

              <p className="text-sm leading-relaxed max-w-md mb-10 text-gray-600 fade-up-3">
                NCAA Prep is an aviation exam-readiness platform for pilots, engineers, dispatchers,
                cabin crew, and ATC trainees. Build knowledge with role-specific question banks,
                timed assessments, and post-flight debrief analytics.
              </p>

              <div className="flex flex-col sm:flex-row gap-0 fade-up-4">
                <button
                  onClick={onEnter}
                  className="px-8 py-4 bg-black text-white text-xs font-black uppercase tracking-widest border-2 border-black hover:bg-[#00FF57] hover:text-black transition-colors"
                >
                  Open Course Catalog →
                </button>
                <button
                  onClick={onFleet}
                  className="px-8 py-4 bg-white text-black text-xs font-black uppercase tracking-widest border-2 border-black border-l-0 sm:border-l-0 hover:bg-black hover:text-white transition-colors"
                >
                  Mission Overview
                </button>
              </div>
            </div>

            {/* Coordinates/tag line */}
            <div className="mt-12 pt-4 border-t border-black flex items-center gap-6">
              <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">09°04′N 07°29′E — NIGERIA</span>
              <span className="w-8 h-px bg-gray-300" />
              <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">Est. NCAA 1999</span>
            </div>
          </div>

          {/* RIGHT — Helicopter panel */}
          <div className="relative border-t-2 lg:border-t-0 border-black overflow-hidden min-h-[420px] bg-white">
            {/* Grid overlay on panel */}
            <div
              className="absolute inset-0 opacity-[0.04]"
              style={{
                backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)',
                backgroundSize: '30px 30px',
              }}
            />

            {/* Corner labels */}
            <div className="absolute top-3 left-3 text-[9px] font-mono text-gray-400 uppercase tracking-widest z-10">
              5N-NCA // AGUSTA 109
            </div>
            <div className="absolute top-3 right-3 text-[9px] font-mono text-gray-400 uppercase tracking-widest z-10">
              NIGERIAN LIVERY
            </div>
            <div className="absolute bottom-3 left-3 text-[9px] font-mono text-gray-400 uppercase tracking-widest z-10">
              TWIN TURBOSHAFT
            </div>
            <div className="absolute bottom-3 right-3 z-10">
              <span className="text-[9px] font-mono text-[#00C850] uppercase tracking-widest">● AIRBORNE</span>
            </div>

            {/* Helicopters */}
            <div className="absolute inset-0 overflow-hidden">
              {/* Right heli */}
              <div
                className="heli-right absolute"
                style={{ bottom: '15%', right: '-2%', width: '62%' }}
              >
                <AgustaW109Nigerian />
              </div>
              {/* Left heli — mirrored */}
              <div
                className="heli-left absolute"
                style={{ bottom: '32%', left: '-4%', width: '52%' }}
              >
                <AgustaW109Nigerian />
              </div>
            </div>

            {/* Status overlay */}
            <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col gap-3 z-10">
              {['ALT 1200ft', 'SPD 148kts', 'HDG 045°'].map(stat => (
                <div key={stat} className="border border-black bg-white px-2 py-1">
                  <span className="text-[9px] font-mono font-bold uppercase">{stat}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════ TICKER ════════════════════════════════════════ */}
      <div className="relative z-10 border-b-2 border-black bg-black text-white py-3 overflow-hidden">
        <div className="ticker flex gap-16 whitespace-nowrap text-[11px] font-bold uppercase tracking-widest" style={{ width: 'max-content' }}>
          {Array(6).fill(null).map((_, i) => (
            <React.Fragment key={i}>
              <span>B1 / B2 Engineer</span>
              <span className="text-[#00FF57]">——</span>
              <span>Helicopter Pilot</span>
              <span className="text-[#00FF57]">——</span>
              <span>Fixed Wing Pilot</span>
              <span className="text-[#00FF57]">——</span>
              <span>Flight Dispatcher</span>
              <span className="text-[#00FF57]">——</span>
              <span>ATC Operator</span>
              <span className="text-[#00FF57]">——</span>
              <span>Cabin Crew</span>
              <span className="text-[#00FF57]">——</span>
              <span>Avionics</span>
              <span className="text-[#00FF57]">——</span>
              <span>Ground Ops</span>
              <span className="text-[#00FF57]">——</span>
              <span>Safety & Human Factors</span>
              <span className="text-[#00FF57]">——</span>
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* ══════════════════════ METRICS ═══════════════════════════════════════ */}
      <section className="relative z-10 grid grid-cols-2 md:grid-cols-4 border-b-2 border-black">
        {metrics.map((m, i) => (
          <div
            key={m.label}
            className={`p-8 md:p-10 flex flex-col justify-between ${i < metrics.length - 1 ? 'border-r-2 border-black' : ''}`}
          >
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4">{m.label}</p>
            <p className="text-4xl md:text-5xl font-black tracking-tight leading-none">{m.value}</p>
          </div>
        ))}
      </section>

      {/* ══════════════════════ MISSION TRACKS ════════════════════════════════ */}
      <section className="relative z-10 border-b-2 border-black">
        <div className="grid md:grid-cols-4 border-b border-black">
          <div className="px-8 py-6 md:col-span-1 border-b md:border-b-0 md:border-r-2 border-black flex items-center">
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Module</p>
              <h2 className="text-2xl font-black uppercase">Mission<br />Tracks</h2>
            </div>
          </div>
          <div className="md:col-span-3 px-8 py-6 hidden md:flex items-center">
            <p className="text-sm text-gray-500 max-w-xl">
              Structured pathways designed to mirror real aviation pressure and cadence.
            </p>
          </div>
        </div>
        <div className="grid md:grid-cols-3">
          {missionTracks.map((track, i) => (
            <div
              key={track.title}
              onClick={onEnter}
              className={`p-8 md:p-10 hover:bg-black hover:text-white transition-colors group cursor-pointer ${i < missionTracks.length - 1 ? 'border-b-2 md:border-b-0 md:border-r-2 border-black' : ''}`}
            >
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 group-hover:text-gray-500 mb-6">{track.num}</p>
              <h3 className="text-xl font-black uppercase mb-4 leading-tight">{track.title}</h3>
              <p className="text-sm text-gray-500 group-hover:text-gray-300 leading-relaxed">{track.details}</p>
              <div className="mt-8 flex items-center gap-2">
                <div className="w-4 h-px bg-current" />
                <span className="text-[10px] uppercase tracking-widest font-bold">View module</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════ TRAINING OPERATIONS ═══════════════════════════ */}
      <section className="relative z-10 border-b-2 border-black grid lg:grid-cols-2">
        <div className="p-8 md:p-12 border-b-2 lg:border-b-0 lg:border-r-2 border-black">
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4">Platform</p>
          <h2 className="text-3xl md:text-4xl font-black uppercase mb-6 leading-tight">Training<br />Operations</h2>
          <p className="text-sm text-gray-500 leading-relaxed max-w-sm">
            Every module is built for NCAA-style aviation certification prep with realistic
            operational pressure and role-specific performance feedback.
          </p>
        </div>
        <div className="flex flex-col">
          {operations.map((item, idx) => (
            <div
              key={item.title}
              className={`p-8 flex gap-6 items-start group hover:bg-[#00FF57] transition-colors cursor-default ${idx < operations.length - 1 ? 'border-b-2 border-black' : ''}`}
            >
              <div className="flex-shrink-0 w-8 h-8 border-2 border-black flex items-center justify-center text-xs font-black group-hover:bg-black group-hover:text-[#00FF57]">
                {String(idx + 1).padStart(2, '0')}
              </div>
              <div>
                <h3 className="font-black uppercase text-base mb-2">{item.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{item.copy}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════ ABOUT / PLATFORM ══════════════════════════════ */}
      <section className="relative z-10 border-b-2 border-black grid md:grid-cols-2">
        <div className="p-8 md:p-12 border-b-2 md:border-b-0 md:border-r-2 border-black relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#00FF57] opacity-10" />
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4">About</p>
          <h3 className="text-2xl font-black uppercase mb-4 leading-tight">Built for modern<br />aviation teams.</h3>
          <p className="text-sm text-gray-500 leading-relaxed">
            NCAA Prep blends operational realism with focused study loops so cadets can move
            from reading to readiness faster with safer decisions.
          </p>
          <div className="mt-8 border-t border-black pt-4">
            <p className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">ICAO · NCAA · EASA COMPLIANT</p>
          </div>
        </div>
        <div className="p-8 md:p-12 bg-black text-white relative overflow-hidden">
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-[#00FF57] opacity-10" />
          <p className="text-[10px] font-black uppercase tracking-widest text-[#00FF57] mb-4">Platform</p>
          <h3 className="text-2xl font-black uppercase mb-4 leading-tight">Join the Future<br />of Aviation Training</h3>
          <p className="text-sm text-gray-400 leading-relaxed">
            We provide a centralized, digital-first learning environment tailored for aviation
            professionals, making it easier to prepare for licensing exams with structured
            content, practice tools, and real-time progress tracking.
          </p>
          <div className="mt-8 border-t border-gray-800 pt-4">
            <p className="text-[10px] font-mono text-gray-600 uppercase tracking-widest">8,400+ ACTIVE CADETS ENROLLED</p>
          </div>
        </div>
      </section>

      {/* ══════════════════════ CONTACT ═══════════════════════════════════════ */}
      <section ref={contactRef} className="relative z-10 border-b-2 border-black grid lg:grid-cols-2">
        <div className="p-8 md:p-12 border-b-2 lg:border-b-0 lg:border-r-2 border-black flex flex-col justify-between">
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4">Contact</p>
            <h3 className="text-3xl font-black uppercase mb-6 leading-tight">Contact<br />Form</h3>
            <p className="text-sm text-gray-500 leading-relaxed max-w-sm">
              Ready to integrate NCAA Prep into your training program? Reach out to the team.
            </p>
          </div>
          <div className="mt-8">
            <p className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">RESPONSE TIME: &lt;24H</p>
          </div>
        </div>
        <div className="p-8 md:p-12">
          <form
            className="flex flex-col gap-0"
            onSubmit={(e) => {
              e.preventDefault();
              alert('Message received. We will reach out shortly.');
            }}
          >
            {[
              { placeholder: 'Name *', type: 'text', required: true },
              { placeholder: 'Email *', type: 'email', required: true },
              { placeholder: 'Organization', type: 'text', required: false },
            ].map((field) => (
              <input
                key={field.placeholder}
                type={field.type}
                required={field.required}
                placeholder={field.placeholder}
                className="border-2 border-black border-b-0 last:border-b-2 px-4 py-4 text-sm font-mono bg-white text-black placeholder-gray-400 focus:outline-none focus:bg-[#F5FFF8] transition-colors"
              />
            ))}
            <textarea
              required
              rows={4}
              placeholder="How can we help your training program? *"
              className="border-2 border-black border-b-0 px-4 py-4 text-sm font-mono bg-white text-black placeholder-gray-400 focus:outline-none focus:bg-[#F5FFF8] transition-colors resize-none"
            />
            <button
              type="submit"
              className="border-2 border-black px-6 py-4 font-black text-xs uppercase tracking-widest bg-black text-white hover:bg-[#00FF57] hover:text-black transition-colors"
            >
              Send Message →
            </button>
          </form>
        </div>
      </section>

      {/* ══════════════════════ FINAL CTA ══════════════════════════════════════ */}
      <section className="relative z-10 border-b-2 border-black bg-black text-white overflow-hidden">
        {/* Background grid */}
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage: 'linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />
        <div className="relative p-8 md:p-16 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-[#00FF57] mb-4">Final Call</p>
            <h2 className="text-4xl md:text-6xl font-black uppercase leading-tight mb-6">
              Ready for your<br />
              next certification<br />
              <span className="text-[#00FF57]">sortie?</span>
            </h2>
            <p className="text-sm text-gray-400 max-w-md leading-relaxed">
              Browse course sectors now, then sign in to launch graded practice
              or timed check assessments.
            </p>
          </div>
          <div className="flex flex-col gap-0">
            <button
              onClick={onEnter}
              className="px-8 py-6 bg-[#00FF57] text-black font-black text-sm uppercase tracking-widest border-2 border-[#00FF57] hover:bg-white hover:border-white transition-colors"
            >
              View Courses →
            </button>
            <button
              onClick={onFleet}
              className="px-8 py-6 bg-transparent text-white font-black text-sm uppercase tracking-widest border-2 border-white border-t-0 hover:bg-white hover:text-black transition-colors"
            >
              Open Role Briefs
            </button>
          </div>
        </div>
      </section>

      {/* ══════════════════════ FOOTER ═════════════════════════════════════════ */}
      <footer className="relative z-10 bg-white border-t-0">
        {/* Social links row */}
        <div className="border-b-2 border-black grid grid-cols-2 md:grid-cols-4">
          {socialPlatforms.map((platform, i) => (
            <a
              key={platform.name}
              href={platform.href}
              target="_blank"
              rel="noreferrer"
              className={`flex items-center gap-3 px-6 py-5 text-xs font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-colors group ${i < socialPlatforms.length - 1 ? 'border-r-2 border-black' : ''}`}
            >
              <span className="group-hover:text-[#00FF57] transition-colors">{platform.icon}</span>
              <span className="hidden md:inline">{platform.cta}</span>
              <span className="md:hidden">{platform.name}</span>
            </a>
          ))}
        </div>

        {/* Bottom footer */}
        <div className="grid md:grid-cols-3 border-b-2 border-black">
          <div className="p-6 border-b-2 md:border-b-0 md:border-r-2 border-black">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 bg-black flex items-center justify-center">
                <span className="text-white font-black text-sm">N</span>
              </div>
              <span className="font-black text-xs uppercase tracking-widest">NCAA PRO</span>
            </div>
            <p className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">
              © {new Date().getFullYear()} NCAA Prep.<br />Aviation readiness with confidence.
            </p>
          </div>
          <div className="p-6 border-b-2 md:border-b-0 md:border-r-2 border-black">
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3">Platform</p>
            <div className="flex flex-col gap-2">
              {['Privacy', 'Terms', 'Support'].map(link => (
                <a key={link} href="#" className="text-xs font-bold uppercase tracking-widest hover:text-[#00C850] transition-colors">
                  {link}
                </a>
              ))}
            </div>
          </div>
          <div className="p-6">
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3">Coverage</p>
            <p className="text-[10px] font-mono text-gray-400 leading-relaxed uppercase">
              Nigeria · Africa<br />
              International ICAO<br />
              NCAA · EASA Standards
            </p>
          </div>
        </div>

        {/* Bottom strip */}
        <div className="px-6 py-3 flex items-center justify-between">
          <p className="text-[9px] font-mono text-gray-300 uppercase tracking-widest">
            NCAALICENCEPREP.NG — MISSION COMMAND PORTAL
          </p>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-[#00FF57] animate-pulse" />
            <p className="text-[9px] font-mono text-gray-300 uppercase tracking-widest">System Operational</p>
          </div>
        </div>
      </footer>
    </div>
  );
};