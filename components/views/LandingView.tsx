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

  const metrics = [
    { label: 'Scenario Briefs', value: '1,200+' },
    { label: 'Cadets in Training', value: '8.4K' },
    { label: 'Checkride Readiness Gain', value: '+32%' },
    { label: 'Simulator Uptime', value: '99.9%' },
  ];

  const tracks = [
    {
      title: 'Pilot Ground School',
      details: 'IFR procedures, approach planning, checklist discipline, and checkride repetition.',
    },
    {
      title: 'Aircraft Maintenance',
      details: 'AMM-led diagnostics, MEL dispatch decisions, and service-release scenarios.',
    },
    {
      title: 'Flight Operations Control',
      details: 'Dispatch release, weather routing, fuel planning, and ATC phraseology drills.',
    },
  ];

  const operations = [
    {
      title: 'Adaptive Flight Training Engine',
      copy: 'Question flow adjusts by weak topic, confidence trend, and response cadence in each sortie.',
    },
    {
      title: 'Debrief Analytics Console',
      copy: 'Track score drift, topic misses, and mission-repeat priority before every scheduled check.',
    },
    {
      title: 'Offline Ramp Mode',
      copy: 'Train locally on low signal, then synchronize mission records once connection returns.',
    },
  ];

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
        className="pointer-events-none fixed inset-0"
        className="pointer-events-none absolute inset-0"
        style={{
          background: `
            radial-gradient(420px 420px at ${pointer.x}% ${pointer.y}%, rgba(0,0,0,0.13), transparent 65%),
            radial-gradient(260px 260px at ${100 - pointer.x}% ${Math.max(8, pointer.y - 20)}%, rgba(255,255,255,0.92), transparent 70%),
            linear-gradient(120deg, #ffffff 0%, #ececec 42%, #d7d7d7 100%)
          `,
        }}
      />
      <div className="pointer-events-none fixed inset-0 landing-grid" />

      <div className="relative z-10">
        <section className="mx-auto min-h-screen w-full max-w-6xl px-6 pb-20 pt-24 md:px-10">
          <div className="mb-16 flex items-center justify-between border border-black/20 bg-white px-5 py-3 text-xs font-black uppercase tracking-[0.22em]">
            <span>NCAA Prep Flight Academy</span>
            <span>Minimal / Sharp / Interactive</span>
          </div>

          <div className="grid items-center gap-8 md:grid-cols-[1.2fr_0.8fr]">
            <div>
              <p className="mb-4 inline-flex border border-black/25 bg-white px-3 py-2 text-[11px] font-black uppercase tracking-[0.2em]">
                Flight Training Command
              </p>
              <h1 className="mb-6 max-w-3xl text-5xl font-black uppercase leading-[0.92] tracking-tight md:text-7xl">
                Sharp Corner
                <span className="block">Aviation Readiness</span>
              </h1>
              <p className="mb-9 max-w-2xl border-l-4 border-black pl-4 text-base text-black/70 md:text-lg">
                Prepare for NCAA aviation certification with disciplined briefings, timed assessments, and aircraft-operations debrief loops.
              </p>

              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  onClick={onEnter}
                  className="border border-black bg-black px-8 py-4 text-sm font-black uppercase tracking-[0.16em] text-white transition hover:bg-white hover:text-black"
                >
                  Enter Course Sectors
                </button>
                <button
                  onClick={onFleet}
                  className="border border-black bg-white px-8 py-4 text-sm font-black uppercase tracking-[0.16em] transition hover:bg-black hover:text-white"
                >
                  Open Fleet Brief
                </button>
              </div>
            </div>

            <aside className="space-y-4">
              <div className="border border-black bg-white p-6">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-black/60">Cursor Radar</p>
                <p className="mt-3 text-4xl font-black tracking-tight">{Math.round(pointer.x)} / {Math.round(pointer.y)}</p>
                <p className="mt-2 text-xs uppercase tracking-widest text-black/60">Live vector movement across flight board</p>
              </div>
              <div className="border border-black bg-white p-6">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-black/60">Flight Deck Rules</p>
                <ul className="mt-4 space-y-2 text-sm font-semibold uppercase tracking-wider text-black/80">
                  <li>• Sharp panel geometry only</li>
                  <li>• White high-contrast display</li>
                  <li>• Pointer-reactive mission grid</li>
                </ul>
              </div>
            </aside>
          </div>
        </section>

        <section className="border-y border-black/10 bg-white/80 px-6 py-16 backdrop-blur-sm md:px-10">
          <div className="mx-auto grid w-full max-w-6xl grid-cols-2 gap-4 md:grid-cols-4">
            {metrics.map((metric) => (
              <article key={metric.label} className="border border-black/20 bg-white p-6">
                <p className="text-[11px] font-black uppercase tracking-[0.16em] text-black/60">{metric.label}</p>
                <p className="mt-3 text-3xl font-black tracking-tight md:text-4xl">{metric.value}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="px-6 py-20 md:px-10">
          <div className="mx-auto w-full max-w-6xl">
            <h2 className="text-4xl font-black uppercase tracking-tight md:text-5xl">Mission Tracks</h2>
            <p className="mt-3 max-w-2xl border-l-4 border-black pl-4 text-black/70">
              Structured course sectors for cockpit, hangar, and operations control teams.
            </p>
            <div className="mt-10 grid gap-5 md:grid-cols-3">
              {tracks.map((track) => (
                <article key={track.title} className="border border-black/20 bg-white p-7">
                  <p className="mb-4 text-xs font-black uppercase tracking-[0.18em] text-black/50">Sector Brief</p>
                  <h3 className="mb-3 text-2xl font-black uppercase leading-tight">{track.title}</h3>
                  <p className="text-sm leading-relaxed text-black/70">{track.details}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="border-y border-black/10 bg-white/70 px-6 py-20 backdrop-blur-sm md:px-10">
          <div className="mx-auto grid w-full max-w-6xl gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="border border-black/20 bg-white p-8">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-black/60">Training Operations</p>
              <h3 className="mt-4 text-4xl font-black uppercase tracking-tight">Built for aviation certification tempo</h3>
              <p className="mt-5 text-black/70">
                Every module aligns to airline-style procedures, role-based workflows, and post-mission debrief discipline.
              </p>
            </div>
            <div className="space-y-4">
              {operations.map((op, idx) => (
                <article key={op.title} className="border border-black/20 bg-white p-6">
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-black/50">0{idx + 1} / Ops Block</p>
                  <h4 className="mt-2 text-xl font-black uppercase">{op.title}</h4>
                  <p className="mt-2 text-sm text-black/70">{op.copy}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="px-6 py-20 md:px-10">
          <div className="mx-auto grid w-full max-w-6xl gap-6 md:grid-cols-2">
            <article className="border border-black/20 bg-white p-8">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-black/60">Airfield Communications</p>
              <h3 className="mt-3 text-3xl font-black uppercase">Contact Flight Desk</h3>
              <p className="mt-3 text-sm text-black/70">
                Submit training-program requests for cadet onboarding, route-specific evaluation drills, or multi-role exam preparation.
              </p>
            </article>
            <form
              className="grid gap-3 border border-black/20 bg-white p-8"
              onSubmit={(event) => {
                event.preventDefault();
                alert('Flight desk received your transmission.');
              }}
            >
              <input required placeholder="Commander Name" className="border border-black/30 bg-white px-4 py-3 text-sm font-semibold outline-none" />
              <input type="email" required placeholder="Aviation Email" className="border border-black/30 bg-white px-4 py-3 text-sm font-semibold outline-none" />
              <input placeholder="Operator / Airline" className="border border-black/30 bg-white px-4 py-3 text-sm font-semibold outline-none" />
              <textarea required rows={4} placeholder="Mission requirement" className="border border-black/30 bg-white px-4 py-3 text-sm font-semibold outline-none" />
              <button type="submit" className="border border-black bg-black px-6 py-4 text-xs font-black uppercase tracking-[0.16em] text-white transition hover:bg-white hover:text-black">
                Transmit Request
              </button>
            </form>
          </div>
        </section>

        <footer className="border-t border-black/20 bg-white/90 px-6 py-12 md:px-10">
          <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-black/60">© {new Date().getFullYear()} NCAA Prep Flight Academy</p>
            <div className="flex gap-4 text-xs font-black uppercase tracking-wider text-black/60">
              <a className="hover:text-black" href="#">Flight Policy</a>
              <a className="hover:text-black" href="#">Operational Terms</a>
              <a className="hover:text-black" href="#">Cadet Support</a>
            </div>
          </div>
        </footer>
      </div>

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
