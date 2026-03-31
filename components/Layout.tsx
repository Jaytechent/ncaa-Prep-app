import React from 'react';
import { View } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  currentView: View;
  setView: (view: View) => void;
  user: { name: string; role: string } | null;
}

const MONO = "'Space Mono', 'Courier New', monospace";

export const Layout: React.FC<LayoutProps> = ({ children, currentView, setView, user }) => {
  const isAuthPage = currentView === 'AUTH' || currentView === 'LANDING';
  const isAdmin = user?.role === 'admin';

  if (isAuthPage) return <>{children}</>;

  const navItems = [
    { view: 'DASHBOARD', label: 'Dashboard', icon: '▪' },
    { view: 'TRADE_SELECT', label: 'Courses', icon: '▪' },
    { view: 'PROFILE', label: 'Profile', icon: '▪' },
    ...(isAdmin ? [{ view: 'ADMIN', label: 'Admin', icon: '▪' }] : []),
  ] as { view: View; label: string; icon: string }[];

  return (
    <div className="min-h-screen bg-white flex flex-col md:flex-row" style={{ fontFamily: MONO }}>

      {/* ── SIDEBAR (desktop) ─────────────────────────────────────────────── */}
      <aside className="hidden md:flex flex-col w-56 bg-black text-white sticky top-0 h-screen border-r-2 border-black" style={{ fontFamily: MONO }}>

        {/* Logo */}
        <div className="flex items-center gap-3 px-6 py-5 border-b-2 border-gray-800">
          <div className="w-8 h-8 bg-[#0057FF] flex items-center justify-center font-black text-white text-sm">N</div>
          <span className="font-black text-xs uppercase tracking-widest">NCAA PRO</span>
        </div>

        {/* Nav */}
        <nav className="flex-1 flex flex-col">
          {navItems.map(item => {
            const isActive = currentView === item.view;
            return (
              <button
                key={item.view}
                onClick={() => setView(item.view)}
                className={`w-full text-left px-6 py-4 flex items-center gap-3 text-xs font-black uppercase tracking-widest transition-colors border-b border-gray-900 ${
                  isActive
                    ? 'bg-[#0057FF] text-white border-b-[#0057FF]'
                    : 'text-gray-400 hover:bg-gray-900 hover:text-white'
                }`}
              >
                <span className={`w-1.5 h-1.5 ${isActive ? 'bg-white' : 'bg-gray-600'}`} />
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* User section */}
        <div className="border-t-2 border-gray-800">
          <div className="px-6 py-4 flex items-center gap-3">
            <div className="w-8 h-8 border border-[#0057FF] flex items-center justify-center font-black text-[#0057FF] text-xs flex-shrink-0">
              {user?.name?.[0]?.toUpperCase() || 'U'}
            </div>
            <div className="overflow-hidden min-w-0">
              <p className="text-xs font-black truncate text-white">{user?.name || 'Aviation Pro'}</p>
              <button
                onClick={() => setView('LANDING')}
                className="text-[10px] text-gray-500 hover:text-[#0057FF] transition-colors uppercase tracking-widest"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* ── MAIN CONTENT ──────────────────────────────────────────────────── */}
      <main className="flex-1 pb-20 md:pb-0 overflow-y-auto bg-white">

        {/* Mobile top bar */}
        <header className="md:hidden flex items-center justify-between px-4 py-3 bg-black border-b-2 border-black sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-[#0057FF] flex items-center justify-center font-black text-white text-xs">N</div>
            <span className="font-black text-white text-xs uppercase tracking-widest">NCAA PRO</span>
          </div>
          <div className="w-7 h-7 border border-[#0057FF] flex items-center justify-center text-[#0057FF] text-xs font-black">
            {user?.name?.[0]?.toUpperCase() || 'U'}
          </div>
        </header>

        <div className="max-w-6xl mx-auto p-4 md:p-8">
          {children}
        </div>
      </main>

      {/* ── BOTTOM NAV (mobile) ────────────────────────────────────────────── */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-black border-t-2 border-black flex items-center z-20" style={{ fontFamily: MONO }}>
        {navItems.map(item => {
          const isActive = currentView === item.view;
          return (
            <button
              key={item.view}
              onClick={() => setView(item.view)}
              className={`flex-1 flex flex-col items-center py-3 gap-1 transition-colors ${isActive ? 'text-[#0057FF]' : 'text-gray-500'}`}
            >
              <span className={`w-1.5 h-1.5 ${isActive ? 'bg-[#0057FF]' : 'bg-gray-700'}`} />
              <span className="text-[9px] font-black uppercase tracking-widest">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};