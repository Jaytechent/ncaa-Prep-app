import React from 'react';
import { View } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  currentView: View;
  setView: (view: View) => void;
  user: { name: string; role: string } | null;
  darkMode: boolean;
  toggleDark: () => void;
}

const MONO = "'Space Mono', 'Courier New', monospace";

export const Layout: React.FC<LayoutProps> = ({
  children, currentView, setView, user, darkMode, toggleDark,
}) => {
  const isAuthPage = currentView === 'AUTH' || currentView === 'LANDING';
  const isAdmin = user?.role === 'admin';

  // ── theme shorthands ─────────────────────────────────────────
  const dm = darkMode;
  const mainBg     = dm ? 'bg-[#111111]' : 'bg-white';
  const sideBg     = dm ? 'bg-[#0a0a0a]' : 'bg-black';
  const sideBorder = dm ? 'border-[#1e1e1e]' : 'border-black';
  const mainBorder = dm ? 'border-[#2a2a2a]' : 'border-black';
  const textMain   = dm ? 'text-[#f0f0f0]' : 'text-white';
  const textDim    = dm ? 'text-[#555]'    : 'text-gray-500';

  if (isAuthPage) return <>{children}</>;

  const navItems = [
    { view: 'DASHBOARD'   as View, label: 'Dashboard' },
    { view: 'TRADE_SELECT'as View, label: 'Courses'   },
    { view: 'PROFILE'     as View, label: 'Profile'   },
    ...(isAdmin ? [{ view: 'ADMIN' as View, label: 'Admin' }] : []),
  ];

  return (
    <div
      className={`min-h-screen flex flex-col md:flex-row ${dm ? 'bg-[#111111]' : 'bg-white'}`}
      style={{ fontFamily: MONO }}
    >

      {/* ════════════════════════════════════════════════════════
          SIDEBAR — desktop
      ════════════════════════════════════════════════════════ */}
      <aside
        className={`hidden md:flex flex-col w-56 ${sideBg} sticky top-0 h-screen border-r-2 ${sideBorder}`}
      >
        {/* Logo */}
        <div className={`flex items-center gap-3 px-6 py-5 border-b-2 ${sideBorder}`}>
          <div className="w-8 h-8 bg-[#0057FF] flex items-center justify-center font-black text-white text-sm flex-shrink-0">
            N
          </div>
          <span className={`font-black text-xs uppercase tracking-widest ${textMain}`}>NCAA PRO</span>
        </div>

        {/* Nav links */}
        <nav className="flex-1 flex flex-col">
          {navItems.map(item => {
            const isActive = currentView === item.view;
            return (
              <button
                key={item.view}
                onClick={() => setView(item.view)}
                className={`w-full text-left px-6 py-4 flex items-center gap-3 text-xs font-black uppercase tracking-widest transition-colors border-b ${sideBorder} ${
                  isActive
                    ? 'bg-[#0057FF] text-white'
                    : `${dm ? 'text-[#666]' : 'text-gray-400'} hover:bg-[#0057FF]/10 hover:text-white`
                }`}
                style={{ cursor: 'pointer' }}
              >
                <span className={`w-1.5 h-1.5 flex-shrink-0 ${isActive ? 'bg-white' : dm ? 'bg-[#333]' : 'bg-gray-600'}`} />
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Day / Night toggle */}
        <div className={`px-4 py-3 border-t-2 border-b-2 ${sideBorder}`}>
          <p className={`text-[9px] font-black uppercase tracking-widest mb-2 ${textDim}`}>Theme</p>
          <div
            className="theme-switch"
            onClick={toggleDark}
            role="switch"
            aria-checked={darkMode}
            tabIndex={0}
            onKeyDown={e => e.key === 'Enter' && toggleDark()}
          >
            <div className={`theme-switch__track ${darkMode ? 'theme-switch__track--night' : ''}`} />
            <span className={`theme-switch__label ${!darkMode ? 'text-white' : dm ? 'text-[#555]' : 'text-gray-500'}`}>
              ☀ Day
            </span>
            <span className={`theme-switch__label ${darkMode ? 'text-white' : dm ? 'text-[#555]' : 'text-gray-500'}`}>
              ☽ Night
            </span>
          </div>
        </div>

        {/* User + sign out */}
        <div className={`border-t-2 ${sideBorder}`}>
          <div className="px-5 py-4 flex items-center gap-3">
            <div className="w-8 h-8 border border-[#0057FF] flex items-center justify-center font-black text-[#0057FF] text-xs flex-shrink-0">
              {user?.name?.[0]?.toUpperCase() || 'U'}
            </div>
            <div className="overflow-hidden min-w-0 flex-1">
              <p className={`text-xs font-black truncate ${textMain}`}>
                {user?.name || 'Aviation Pro'}
              </p>
              <button
                onClick={() => setView('LANDING')}
                className="text-[10px] text-[#0057FF] hover:text-white transition-colors uppercase tracking-widest"
                style={{ cursor: 'pointer' }}
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* ════════════════════════════════════════════════════════
          MAIN CONTENT
      ════════════════════════════════════════════════════════ */}
      <main className={`flex-1 pb-20 md:pb-0 overflow-y-auto ${mainBg}`}>

        {/* Mobile top bar */}
        <header
          className={`md:hidden flex items-center justify-between px-4 py-3 ${sideBg} border-b-2 ${sideBorder} sticky top-0 z-10`}
        >
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-[#0057FF] flex items-center justify-center font-black text-white text-xs flex-shrink-0">
              N
            </div>
            <span className="font-black text-white text-xs uppercase tracking-widest">NCAA PRO</span>
          </div>

          {/* Mobile toggle */}
          <div className="flex items-center gap-3">
            <div
              className="theme-switch"
              onClick={toggleDark}
              role="switch"
              aria-checked={darkMode}
              tabIndex={0}
              onKeyDown={e => e.key === 'Enter' && toggleDark()}
              style={{ minWidth: 88 }}
            >
              <div className={`theme-switch__track ${darkMode ? 'theme-switch__track--night' : ''}`} />
              <span className={`theme-switch__label ${!darkMode ? 'text-white' : 'text-[#555]'}`}>☀</span>
              <span className={`theme-switch__label ${darkMode ? 'text-white' : 'text-[#555]'}`}>☽</span>
            </div>

            <div className="w-7 h-7 border border-[#0057FF] flex items-center justify-center text-[#0057FF] text-xs font-black flex-shrink-0">
              {user?.name?.[0]?.toUpperCase() || 'U'}
            </div>
          </div>
        </header>

        <div className="max-w-6xl mx-auto p-4 md:p-8">
          {children}
        </div>
      </main>

      {/* ════════════════════════════════════════════════════════
          BOTTOM NAV — mobile
      ════════════════════════════════════════════════════════ */}
      <nav
        className={`md:hidden fixed bottom-0 left-0 right-0 ${sideBg} border-t-2 ${sideBorder} flex items-center z-20`}
      >
        {navItems.map(item => {
          const isActive = currentView === item.view;
          return (
            <button
              key={item.view}
              onClick={() => setView(item.view)}
              className={`flex-1 flex flex-col items-center py-3 gap-1 transition-colors ${
                isActive ? 'text-[#0057FF]' : dm ? 'text-[#444]' : 'text-gray-500'
              }`}
              style={{ cursor: 'pointer' }}
            >
              <span className={`w-1.5 h-1.5 ${isActive ? 'bg-[#0057FF]' : dm ? 'bg-[#333]' : 'bg-gray-700'}`} />
              <span className="text-[9px] font-black uppercase tracking-widest">{item.label}</span>
            </button>
          );
        })}
      </nav>

    </div>
  );
};