
import React from 'react';
import { View } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  currentView: View;
  setView: (view: View) => void;
  user: { name: string, role: string } | null;
}

export const Layout: React.FC<LayoutProps> = ({ children, currentView, setView, user }) => {
  const isAuthPage = currentView === 'AUTH' || currentView === 'LANDING';
  const isAdmin = user?.role === 'admin';

  if (isAuthPage) return <>{children}</>;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* Sidebar forDesktop */}
      <aside className="hidden md:flex flex-col w-64 bg-slate-900 text-white p-6 sticky top-0 h-screen">
        <div className="flex items-center gap-2 mb-10">
          <div className="w-10 h-10 bg-yellow-400 rounded-lg flex items-center justify-center text-slate-900 font-bold text-xl">N</div>
          <h1 className="font-bold text-lg tracking-tight">NCAA PRO</h1>
        </div>

        <nav className="flex-1 space-y-2">
          <button 
            onClick={() => setView('DASHBOARD')}
            className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition-colors ${currentView === 'DASHBOARD' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}
          >
            <span>📊</span> Dashboard
          </button>
          <button 
            onClick={() => setView('TRADE_SELECT')}
            className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition-colors ${currentView === 'TRADE_SELECT' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}
          >
            <span>🎓</span> Courses
          </button>
          <button 
            onClick={() => setView('PROFILE')}
            className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition-colors ${currentView === 'PROFILE' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}
          >
            <span>👤</span> Profile
          </button>
          
          {isAdmin && (
            <button 
              onClick={() => setView('ADMIN')}
              className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition-colors ${currentView === 'ADMIN' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}
            >
              <span>⚙️</span> Admin
            </button>
          )}
        </nav>

        <div className="mt-auto pt-6 border-t border-slate-800">
          <div className="flex items-center gap-3 px-2">
            <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center font-bold">
              {user?.name?.[0] || 'U'}
            </div>
            <div className="overflow-hidden text-ellipsis">
              <p className="text-sm font-semibold truncate">{user?.name || 'Aviation Pro'}</p>
              <button onClick={() => setView('LANDING')} className="text-xs text-slate-400 hover:text-white">Sign out</button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 pb-20 md:pb-0 overflow-y-auto">
        <header className="md:hidden flex items-center justify-between p-4 bg-white border-b sticky top-0 z-10">
           <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-yellow-400 rounded flex items-center justify-center text-slate-900 font-bold">N</div>
            <h1 className="font-bold text-slate-900">NCAA PRO</h1>
          </div>
          <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold">
            {user?.name?.[0] || 'U'}
          </div>
        </header>

        <div className="max-w-6xl mx-auto p-4 md:p-8">
          {children}
        </div>
      </main>

      {/* Bottom Nav for Mobile */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t flex items-center justify-around py-3 px-4 z-20">
        <button onClick={() => setView('DASHBOARD')} className={`flex flex-col items-center gap-1 ${currentView === 'DASHBOARD' ? 'text-blue-600' : 'text-slate-400'}`}>
          <span className="text-xl">📊</span>
          <span className="text-[10px] font-medium">Dash</span>
        </button>
        <button onClick={() => setView('TRADE_SELECT')} className={`flex flex-col items-center gap-1 ${currentView === 'TRADE_SELECT' ? 'text-blue-600' : 'text-slate-400'}`}>
          <span className="text-xl">🎓</span>
          <span className="text-[10px] font-medium">Study</span>
        </button>
        <button onClick={() => setView('PROFILE')} className={`flex flex-col items-center gap-1 ${currentView === 'PROFILE' ? 'text-blue-600' : 'text-slate-400'}`}>
          <span className="text-xl">👤</span>
          <span className="text-[10px] font-medium">Profile</span>
        </button>
        {isAdmin && (
          <button onClick={() => setView('ADMIN')} className={`flex flex-col items-center gap-1 ${currentView === 'ADMIN' ? 'text-blue-600' : 'text-slate-400'}`}>
            <span className="text-xl">⚙️</span>
            <span className="text-[10px] font-medium">Admin</span>
          </button>
        )}
      </nav>
    </div>
  );
};
