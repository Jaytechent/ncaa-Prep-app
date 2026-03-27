import React, { useEffect, useState } from 'react';

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

export const LandingView: React.FC<{ onEnter: () => void; onFleet: () => void }> = ({ onEnter, onFleet }) => {
  const [pointer, setPointer] = useState({ x: 50, y: 50 });

  useEffect(() => {
    const handleMove = (event: MouseEvent) => {
      const x = (event.clientX / window.innerWidth) * 100;
      const y = (event.clientY / window.innerHeight) * 100;
      setPointer({ x, y });
    };

    window.addEventListener('mousemove', handleMove);
    return () => window.removeEventListener('mousemove', handleMove);
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#f7f7f7] text-[#101010]">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: `
            radial-gradient(420px 420px at ${pointer.x}% ${pointer.y}%, rgba(0,0,0,0.13), transparent 65%),
            radial-gradient(260px 260px at ${100 - pointer.x}% ${Math.max(8, pointer.y - 20)}%, rgba(255,255,255,0.92), transparent 70%),
            linear-gradient(120deg, #ffffff 0%, #ececec 42%, #d7d7d7 100%)
          `,
        }}
      />

      <div className="pointer-events-none absolute inset-0 landing-grid" />

      <main className="relative z-10 mx-auto flex min-h-screen w-full max-w-6xl flex-col px-6 pb-16 pt-24 md:px-10">
        <div className="mb-16 flex items-center justify-between border border-black/20 bg-white px-5 py-3 text-xs font-black uppercase tracking-[0.22em]">
          <span>NCAA Prep</span>
          <span>Minimal / Sharp / Interactive</span>
        </div>

        <section className="grid flex-1 items-center gap-8 md:grid-cols-[1.2fr_0.8fr]">
          <div>
            <p className="mb-4 inline-flex border border-black/25 bg-white px-3 py-2 text-[11px] font-black uppercase tracking-[0.2em]">
              Clean White Interface
            </p>
            <h1 className="mb-6 max-w-3xl text-5xl font-black uppercase leading-[0.92] tracking-tight md:text-7xl">
              Sharp Corner
              <span className="block">Training Homepage</span>
            </h1>
            <p className="mb-9 max-w-2xl border-l-4 border-black pl-4 text-base text-black/70 md:text-lg">
              A minimalist visual system with hard edges, high contrast, and a crazy mouse-reactive background that shifts with every move.
            </p>

            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                onClick={onEnter}
                className="border border-black bg-black px-8 py-4 text-sm font-black uppercase tracking-[0.16em] text-white transition hover:bg-white hover:text-black"
              >
                Enter Courses
              </button>
              <button
                onClick={onFleet}
                className="border border-black bg-white px-8 py-4 text-sm font-black uppercase tracking-[0.16em] transition hover:bg-black hover:text-white"
              >
                Mission Overview
              </button>
            </div>

          <aside className="space-y-4">
            <div className="border border-black bg-white p-6">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-black/60">Live Cursor Coordinates</p>
              <p className="mt-3 text-4xl font-black tracking-tight">{Math.round(pointer.x)} / {Math.round(pointer.y)}</p>
            </div>
            <div className="border border-black bg-white p-6">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-black/60">Visual Language</p>
              <ul className="mt-4 space-y-2 text-sm font-semibold uppercase tracking-wider text-black/80">
                <li>• All corners are sharp</li>
                <li>• Neutral white palette</li>
                <li>• Motion tied to mouse</li>
              </ul>
            </div>
          </aside>
        </section>
      </main>
    </div>
  );
};
