
import React, { useState, useEffect, useCallback } from 'react';
import { Trade, QuizMode, Question, QuizSession, UserStats, View } from './types';
import { INITIAL_QUESTIONS, TRADE_INFO } from './constants';
import { Layout } from './components/Layout';
import { geminiService } from './services/geminiService';
import { apiService } from './services/apiService';

const App: React.FC = () => {
  // --- STATE ---
  const [view, setView] = useState<View>('LANDING');
  const [questions, setQuestions] = useState<Question[]>(INITIAL_QUESTIONS);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [currentTrade, setCurrentTrade] = useState<Trade | null>(null);
  const [quizMode, setQuizMode] = useState<QuizMode>(QuizMode.PRACTICE);
  const [session, setSession] = useState<QuizSession | null>(null);
  const [stats, setStats] = useState<UserStats>({
    totalQuizzes: 12,
    averageScore: 84.5,
    bestTrade: Trade.B1_ENGINEER,
    history: [
      { date: '2023-10-24', trade: Trade.B1_ENGINEER, score: 9, total: 10 },
      { date: '2023-10-22', trade: Trade.ATC, score: 7, total: 10 },
    ]
  });

  // --- API INTEGRATION ---
  useEffect(() => {
    const loadQuestions = async () => {
      try {
        const data = await apiService.fetchQuestions();
        if (data.length > 0) {
          setQuestions(data);
        }
      } catch (err) {
        console.log('Using default initial questions library.');
      } finally {
        setIsLoading(false);
      }
    };
    loadQuestions();
  }, []);

  // --- ACTIONS ---
  const startQuiz = useCallback((trade: Trade, mode: QuizMode) => {
    const tradeQuestions = questions.filter(q => q.trade === trade);
    if (tradeQuestions.length === 0) {
      alert("No questions found for this trade yet.");
      return;
    }

    const shuffled = [...tradeQuestions].sort(() => Math.random() - 0.5);
    const sessionQuestions = shuffled.slice(0, 10);

    setSession({
      trade,
      mode,
      questions: sessionQuestions,
      currentQuestionIndex: 0,
      userAnswers: {},
      startTime: Date.now(),
      timeRemaining: mode === QuizMode.TIMED ? 600 : 0
    });
    setView('QUIZ');
  }, [questions]);

  const handleAnswer = (questionId: string, answerId: string) => {
    if (!session) return;
    const newAnswers = { ...session.userAnswers, [questionId]: answerId };
    setSession({ ...session, userAnswers: newAnswers });
  };

  const nextQuestion = () => {
    if (!session) return;
    if (session.currentQuestionIndex < session.questions.length - 1) {
      setSession({ ...session, currentQuestionIndex: session.currentQuestionIndex + 1 });
    } else {
      finishQuiz();
    }
  };

  const finishQuiz = () => {
    if (!session) return;
    setSession({ ...session, endTime: Date.now() });
    
    const score = session.questions.reduce((acc, q) => {
      return acc + (session.userAnswers[q.id] === q.correctAnswer ? 1 : 0);
    }, 0);

    setStats(prev => ({
      ...prev,
      totalQuizzes: prev.totalQuizzes + 1,
      history: [
        { date: new Date().toISOString().split('T')[0], trade: session.trade, score, total: session.questions.length },
        ...prev.history
      ]
    }));

    setView('RESULTS');
  };

  const handleAddQuestion = async (q: Omit<Question, 'id'>) => {
    try {
      const savedQ = await apiService.saveQuestion(q);
      setQuestions([...questions, savedQ]);
      alert("Question saved to MongoDB successfully!");
    } catch (err) {
      const newQ: Question = { ...q, id: `q-${Date.now()}` };
      setQuestions([...questions, newQ]);
      alert("Saved locally (Backend not detected)");
    }
  };

  // --- VIEWS ---
  
  const LandingView = () => (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#020617] text-white p-6 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-blue-500/30 rounded-full"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-blue-400/20 rounded-full"></div>
        <div className="absolute w-full h-[1px] bg-blue-500/20 top-1/2"></div>
        <div className="absolute h-full w-[1px] bg-blue-500/20 left-1/2"></div>
      </div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600 rounded-full blur-[140px] opacity-20 -mr-48 -mt-48"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-yellow-500 rounded-full blur-[140px] opacity-10 -ml-48 -mb-48"></div>
      <div className="z-10 text-center max-w-3xl">
        <div className="inline-flex items-center gap-2 bg-blue-900/40 border border-blue-500/30 px-4 py-2 rounded-full text-blue-400 text-xs font-bold mb-8 uppercase tracking-widest">
          <span className="w-2 h-2 bg-blue-500 rounded-full animate-ping"></span>
          E-4B Nightwatch Tactical Training Active
        </div>
        <h1 className="text-6xl md:text-8xl font-black mb-6 tracking-tighter leading-[0.9] text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-500">
          NCAA COMMAND <br/><span className="text-yellow-400">AVIATION PRO</span>
        </h1>
        <p className="text-xl text-slate-400 mb-12 font-medium max-w-xl mx-auto leading-relaxed">
          Mission-critical certification platform for the world's most elite aviation professionals. Strategic readiness for Pilots, Engineers, and ATC.
        </p>
        <div className="flex flex-col sm:flex-row gap-5 justify-center">
          <button onClick={() => setView('AUTH')} className="group relative px-10 py-5 bg-blue-600 hover:bg-blue-500 rounded-xl font-black text-xl transition-all shadow-[0_0_40px_rgba(37,99,235,0.4)] overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
            ENTER COCKPIT
          </button>
          <button className="px-10 py-5 bg-slate-900/80 hover:bg-slate-800 rounded-xl font-black text-xl transition-all border border-slate-700 backdrop-blur-sm">
            FLEET SPECS
          </button>
        </div>
      </div>
      <div className="mt-24 z-10 flex gap-16 items-end opacity-60">
        <div className="flex flex-col items-center group cursor-help"><span className="text-4xl group-hover:scale-125 transition-transform duration-300">✈️</span><p className="text-[10px] mt-3 uppercase tracking-[0.3em] font-black text-slate-500 group-hover:text-white">Strategic</p></div>
        <div className="flex flex-col items-center group cursor-help"><span className="text-5xl group-hover:scale-125 transition-transform duration-300 -mb-2">🛰️</span><p className="text-[10px] mt-3 uppercase tracking-[0.3em] font-black text-slate-500 group-hover:text-white">Comms</p></div>
        <div className="flex flex-col items-center group cursor-help"><span className="text-4xl group-hover:scale-125 transition-transform duration-300">⚙️</span><p className="text-[10px] mt-3 uppercase tracking-[0.3em] font-black text-slate-500 group-hover:text-white">Maintenance</p></div>
      </div>
      <div className="absolute bottom-8 left-8 text-[10px] font-mono text-slate-600 uppercase tracking-widest">SECURE NODE: 77.23.10.04 // NCAA_SYS_AUTH</div>
    </div>
  );

  const AuthView = () => (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent"></div>
      <div className="w-full max-w-md bg-slate-900/90 backdrop-blur-xl p-10 rounded-[2rem] shadow-2xl border border-slate-800 relative z-10">
        <div className="w-16 h-1 bg-blue-600 rounded-full mb-8 mx-auto"></div>
        <h2 className="text-3xl font-black text-white mb-2 text-center uppercase tracking-tight">Identity Check</h2>
        <p className="text-slate-500 mb-10 text-center font-medium">Clearance required for professional modules.</p>
        <form onSubmit={(e) => { e.preventDefault(); setUser({ name: 'Captain Maverick', email: 'topgun@ncaa.gov' }); setView('DASHBOARD'); }} className="space-y-5">
          <div><label className="block text-xs font-black text-slate-400 mb-2 uppercase tracking-widest">Aviation ID (Email)</label><input type="email" required placeholder="name@airline.com" className="w-full bg-slate-800/50 p-4 rounded-xl border border-slate-700 text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-slate-600" /></div>
          <div><label className="block text-xs font-black text-slate-400 mb-2 uppercase tracking-widest">Biometric Pass</label><input type="password" required placeholder="••••••••" className="w-full bg-slate-800/50 p-4 rounded-xl border border-slate-700 text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all" /></div>
          <button type="submit" className="w-full py-5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-black uppercase tracking-widest transition-all mt-6 shadow-lg shadow-blue-600/20">Authorize Access</button>
        </form>
      </div>
    </div>
  );

  const DashboardView = () => (
    <div className="space-y-8 pb-12">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1"><span className="w-2 h-2 bg-green-500 rounded-full"></span><span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Status: Operational</span></div>
          <h2 className="text-4xl font-black text-slate-900 leading-none uppercase">Commander {user?.name.split(' ')[1]}</h2>
          <p className="text-slate-500 mt-2 font-medium">Operational Readiness: {stats.averageScore}%</p>
        </div>
        <div className="bg-white p-2 rounded-xl border flex gap-4">
           <div className="px-4 py-2 bg-blue-50 rounded-lg text-center"><p className="text-[10px] font-black text-blue-400 uppercase">Flight Hours</p><p className="text-xl font-bold text-blue-900">1,240</p></div>
           <div className="px-4 py-2 bg-yellow-50 rounded-lg text-center"><p className="text-[10px] font-black text-yellow-600 uppercase">Cert Level</p><p className="text-xl font-bold text-yellow-900">PRO-I</p></div>
        </div>
      </header>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 relative overflow-hidden group"><div className="absolute top-0 right-0 p-4 text-4xl opacity-5 group-hover:scale-150 transition-transform">📊</div><p className="text-xs font-black text-slate-400 uppercase tracking-wider mb-3">Avg. Score</p><div className="flex items-end gap-2"><span className="text-5xl font-black text-slate-900 tracking-tighter">{stats.averageScore}%</span><span className="text-green-500 font-black text-sm mb-1.5 flex items-center">↑ 4%</span></div></div>
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 relative overflow-hidden group"><div className="absolute top-0 right-0 p-4 text-4xl opacity-5 group-hover:scale-150 transition-transform">📝</div><p className="text-xs font-black text-slate-400 uppercase tracking-wider mb-3">Data Samples</p><div className="flex items-end gap-2"><span className="text-5xl font-black text-slate-900 tracking-tighter">{questions.length}</span><span className="text-slate-400 font-bold text-xs mb-1.5">Live Database</span></div></div>
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 relative overflow-hidden group"><div className="absolute top-0 right-0 p-4 text-4xl opacity-5 group-hover:scale-150 transition-transform">🎯</div><p className="text-xs font-black text-slate-400 uppercase tracking-wider mb-3">Specialization</p><div className="flex items-end gap-2"><span className="text-2xl font-black text-slate-900 truncate">B1 ENGINE</span><span className="text-blue-500 font-black text-xs mb-1.5">MASTERY</span></div></div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <section>
          <div className="flex justify-between items-center mb-6"><h3 className="font-black text-xl uppercase tracking-tight">Recent Sorties</h3><button className="text-blue-600 font-bold text-sm hover:underline">Full Logbook →</button></div>
          <div className="space-y-4">
            {stats.history.map((h, i) => (
              <div key={i} className="flex items-center justify-between p-6 bg-white rounded-2xl border border-slate-100 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 ${h.score/h.total >= 0.7 ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'} rounded-xl flex items-center justify-center font-black text-lg`}>{h.score}/{h.total}</div>
                  <div><p className="font-black text-slate-900 text-sm uppercase">{h.trade}</p><p className="text-xs text-slate-400 font-medium">{h.date}</p></div>
                </div>
                <div className="text-right"><span className={`text-[10px] font-black px-2 py-1 rounded-md uppercase tracking-widest ${h.score/h.total >= 0.7 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{h.score/h.total >= 0.7 ? 'Success' : 'Aborted'}</span></div>
              </div>
            ))}
          </div>
        </section>
        <section className="bg-slate-950 rounded-3xl p-8 text-white relative overflow-hidden flex flex-col justify-between group">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-transparent"></div>
          <div className="absolute -right-12 -bottom-12 p-4 opacity-10 group-hover:scale-110 group-hover:-rotate-12 transition-all"><span className="text-[180px]">✈️</span></div>
          <div className="z-10 relative">
            <div className="inline-flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full text-[10px] font-black text-yellow-400 uppercase tracking-widest mb-4"><span className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></span> Critical Mission</div>
            <h3 className="font-black text-3xl mb-3 leading-tight uppercase">Emergency Briefing</h3>
            <p className="text-slate-400 mb-8 max-w-sm font-medium leading-relaxed">Simulated 5-question blitz. Random trade, maximum difficulty, no instruments.</p>
          </div>
          <div className="z-10 relative"><button onClick={() => { setCurrentTrade(Trade.SAFETY_HUMAN_FACTORS); startQuiz(Trade.SAFETY_HUMAN_FACTORS, QuizMode.TIMED); }} className="w-full sm:w-auto px-10 py-4 bg-white text-slate-950 font-black rounded-xl uppercase tracking-widest transition-all hover:bg-yellow-400 hover:scale-105 active:scale-95 shadow-xl shadow-white/5">Scramble Now</button></div>
        </section>
      </div>
    </div>
  );

  const ProfileView = () => (
    <div className="space-y-10 pb-20 max-w-4xl mx-auto">
      <header className="text-center">
        <div className="relative inline-block">
          <div className="w-32 h-32 rounded-full border-4 border-blue-600 p-1 mb-4 mx-auto">
            <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center text-4xl">👨‍✈️</div>
          </div>
          <div className="absolute bottom-4 right-0 bg-green-500 w-6 h-6 rounded-full border-4 border-white"></div>
        </div>
        <h2 className="text-4xl font-black text-slate-900 uppercase">Commander Maverick</h2>
        <p className="text-slate-500 font-bold uppercase tracking-widest text-xs mt-2">NCAA Strategic Asset // Clearance Level 9</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <section className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl">
          <h3 className="font-black text-xl uppercase mb-6 flex items-center gap-2">
            <span className="text-blue-600">📊</span> Operational Stats
          </h3>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between text-xs font-black uppercase mb-2"><span>Technical Accuracy</span><span>94%</span></div>
              <div className="w-full h-2 bg-slate-100 rounded-full"><div className="h-full bg-blue-600 rounded-full" style={{ width: '94%' }}></div></div>
            </div>
            <div>
              <div className="flex justify-between text-xs font-black uppercase mb-2"><span>Mission Completion</span><span>88%</span></div>
              <div className="w-full h-2 bg-slate-100 rounded-full"><div className="h-full bg-indigo-600 rounded-full" style={{ width: '88%' }}></div></div>
            </div>
            <div>
              <div className="flex justify-between text-xs font-black uppercase mb-2"><span>Response Velocity</span><span>72%</span></div>
              <div className="w-full h-2 bg-slate-100 rounded-full"><div className="h-full bg-yellow-500 rounded-full" style={{ width: '72%' }}></div></div>
            </div>
          </div>
        </section>

        <section className="bg-slate-900 text-white p-8 rounded-[2.5rem] shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10 text-6xl">📜</div>
          <h3 className="font-black text-xl uppercase mb-6">Service Certifications</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/10">
              <span className="text-xl">🏆</span>
              <div><p className="text-xs font-black uppercase">PRO-I Tactical Lead</p><p className="text-[10px] text-slate-400">Awarded Oct 2023</p></div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/10">
              <span className="text-xl">🛠️</span>
              <div><p className="text-xs font-black uppercase">B1 Master Engineer</p><p className="text-[10px] text-slate-400">Active Duty</p></div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/10">
              <span className="text-xl">📡</span>
              <div><p className="text-xs font-black uppercase">ATC Radar Specialist</p><p className="text-[10px] text-slate-400">In Training</p></div>
            </div>
          </div>
        </section>
      </div>

      <section className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl">
        <h3 className="font-black text-xl uppercase mb-6">Mission Log History</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
              <tr><th className="px-6 py-4">Sortie Date</th><th className="px-6 py-4">Trade Code</th><th className="px-6 py-4">Efficiency</th><th className="px-6 py-4">Status</th></tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {stats.history.map((h, i) => (
                <tr key={i} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-5 font-bold text-sm">{h.date}</td>
                  <td className="px-6 py-5 text-xs font-black text-blue-600 uppercase">{h.trade}</td>
                  <td className="px-6 py-5 font-black">{((h.score/h.total)*100).toFixed(1)}%</td>
                  <td className="px-6 py-5"><span className={`px-2 py-1 rounded text-[9px] font-black uppercase ${h.score/h.total >= 0.7 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{h.score/h.total >= 0.7 ? 'CLEAR' : 'FAILED'}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );

  const ReviewView = () => {
    if (!session) return <div className="p-20 text-center"><h2 className="text-2xl font-black uppercase">No Recent Mission Data</h2><button onClick={() => setView('DASHBOARD')} className="mt-4 text-blue-600 font-bold">Back to Base</button></div>;
    return (
      <div className="space-y-10 pb-20 max-w-4xl mx-auto">
        <header className="flex justify-between items-center">
          <div><h2 className="text-4xl font-black text-slate-900 uppercase">Mission Review</h2><p className="text-slate-500 font-bold text-xs mt-1 uppercase tracking-widest">Trade: {session.trade} // Status: DEBRIEFING</p></div>
          <button onClick={() => setView('DASHBOARD')} className="px-6 py-3 bg-slate-900 text-white rounded-xl font-black text-xs uppercase tracking-widest">Close Log</button>
        </header>
        <div className="space-y-6">
          {session.questions.map((q, idx) => {
            const userAns = session.userAnswers[q.id];
            const isCorrect = userAns === q.correctAnswer;
            return (
              <div key={q.id} className={`p-8 rounded-[2rem] border-2 bg-white transition-all ${isCorrect ? 'border-green-100' : 'border-red-100'}`}>
                <div className="flex items-start gap-4 mb-6">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-lg ${isCorrect ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>{idx + 1}</div>
                  <h4 className="text-xl font-bold leading-tight text-slate-800 pt-1">{q.text}</h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
                  {q.options.map(opt => (
                    <div key={opt.id} className={`p-4 rounded-xl border text-sm font-bold flex items-center gap-3 ${opt.id === q.correctAnswer ? 'bg-green-50 border-green-200 text-green-900' : opt.id === userAns ? 'bg-red-50 border-red-200 text-red-900' : 'bg-slate-50 border-transparent text-slate-400 opacity-50'}`}>
                      <span className="w-6 h-6 rounded flex items-center justify-center border border-current">{opt.id}</span> {opt.text}
                    </div>
                  ))}
                </div>
                <div className={`p-6 rounded-2xl bg-slate-900 text-white relative overflow-hidden`}>
                  <div className="absolute top-0 right-0 p-4 opacity-10 text-4xl">🤖</div>
                  <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-2">Technical Analysis</p>
                  <p className="text-sm font-medium leading-relaxed opacity-90">{q.explanation}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const TradeSelectView = () => (
    <div className="space-y-10 pb-20">
      <header><h2 className="text-4xl font-black text-slate-900 uppercase">Mission Deployment</h2><p className="text-slate-500 font-medium mt-2">Select your specialization area to begin technical assessment.</p></header>
      {isLoading ? (
        <div className="flex flex-col items-center justify-center p-32"><div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div><p className="mt-6 text-sm font-black text-slate-400 uppercase tracking-widest">Syncing with Ground Control...</p></div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {TRADE_INFO.map(info => (
            <div key={info.trade} onClick={() => setCurrentTrade(info.trade)} className={`cursor-pointer p-8 rounded-[2rem] border-2 transition-all group relative overflow-hidden ${currentTrade === info.trade ? 'border-blue-600 bg-blue-50/50 shadow-xl scale-[1.02]' : 'border-slate-100 bg-white hover:border-slate-300 shadow-sm'}`}>
              {currentTrade === info.trade && <div className="absolute top-0 right-0 p-4 text-blue-600 text-xl font-black animate-bounce">⚡</div>}
              <div className={`w-14 h-14 ${info.color} rounded-2xl flex items-center justify-center text-3xl mb-6 shadow-lg shadow-black/10 transition-transform group-hover:scale-110`}>{info.icon}</div>
              <h3 className="font-black text-xl leading-tight uppercase text-slate-900">{info.trade}</h3>
              <p className="text-sm font-bold text-slate-400 mt-3 flex items-center gap-2"><span className="w-1.5 h-1.5 bg-slate-200 rounded-full"></span>{questions.filter(q => q.trade === info.trade).length} Data Modules</p>
            </div>
          ))}
        </div>
      )}
      {currentTrade && (
        <div className="fixed inset-x-0 bottom-0 p-6 md:p-10 bg-white/80 backdrop-blur-xl border-t border-slate-200 z-50 animate-in slide-in-from-bottom-full duration-500">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-center md:text-left"><h3 className="text-2xl font-black text-slate-900 uppercase">{currentTrade}</h3><p className="text-slate-500 font-medium">Initialize simulation mode</p></div>
            <div className="flex gap-4 w-full md:w-auto">
              <button onClick={() => startQuiz(currentTrade, QuizMode.PRACTICE)} className="flex-1 md:w-56 py-5 bg-slate-100 hover:bg-slate-200 text-slate-900 rounded-2xl font-black uppercase tracking-widest transition-all border-2 border-transparent hover:border-slate-300">Practice</button>
              <button onClick={() => startQuiz(currentTrade, QuizMode.TIMED)} className="flex-1 md:w-56 py-5 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black uppercase tracking-widest transition-all shadow-xl shadow-blue-600/20">Timed Exam</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const QuizView = () => {
    if (!session) return null;
    const q = session.questions[session.currentQuestionIndex];
    const progress = ((session.currentQuestionIndex + 1) / session.questions.length) * 100;
    const isAnswered = !!session.userAnswers[q.id];
    return (
      <div className="max-w-4xl mx-auto space-y-8 pb-32">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4"><button onClick={() => { if(confirm("Abort mission? Progress will be lost.")) setView('DASHBOARD'); }} className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-[10px] font-black text-slate-900 uppercase tracking-widest transition-all">✕ Abort</button><div className="h-4 w-[1px] bg-slate-200"></div><span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Trade: <span className="text-blue-600">{session.trade}</span></span></div>
          {session.mode === QuizMode.TIMED && (<div className="flex items-center gap-3 px-6 py-3 bg-red-50 border border-red-100 rounded-2xl"><span className="animate-pulse">🔴</span><span className="font-black text-red-600 font-mono text-xl tracking-tighter">09:42</span></div>)}
        </div>
        <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden p-1 shadow-inner"><div className="h-full bg-blue-600 rounded-full transition-all duration-700 ease-out" style={{ width: `${progress}%` }}></div></div>
        <div className="bg-white p-8 md:p-16 rounded-[2.5rem] shadow-2xl border border-slate-100 relative">
          <div className="absolute -top-4 -left-4 w-12 h-12 bg-blue-600 text-white rounded-2xl flex items-center justify-center font-black text-xl shadow-lg">{session.currentQuestionIndex + 1}</div>
          <div className="mb-12"><p className="text-[10px] font-black text-blue-400 mb-4 uppercase tracking-[0.3em]">Module Assessment Question</p><h2 className="text-2xl md:text-3xl font-black leading-tight text-slate-900">{q.text}</h2></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {q.options.map(opt => (
              <button key={opt.id} onClick={() => handleAnswer(q.id, opt.id)} className={`w-full p-6 rounded-2xl border-2 text-left transition-all flex items-center gap-5 group relative overflow-hidden ${session.userAnswers[q.id] === opt.id ? 'border-blue-600 bg-blue-50 shadow-inner' : 'border-slate-100 hover:border-blue-200 bg-white hover:shadow-md'}`}>
                <div className={`w-10 h-10 rounded-xl border-2 flex items-center justify-center font-black text-sm transition-all ${session.userAnswers[q.id] === opt.id ? 'bg-blue-600 border-blue-600 text-white rotate-[360deg]' : 'border-slate-200 text-slate-400 group-hover:border-blue-400 group-hover:text-blue-600'}`}>{opt.id}</div>
                <span className="font-bold text-slate-700 leading-tight flex-1">{opt.text}</span>
              </button>
            ))}
          </div>
          {session.mode === QuizMode.PRACTICE && isAnswered && (
            <div className={`mt-12 p-8 rounded-3xl border-2 animate-in slide-in-from-top-4 duration-300 ${session.userAnswers[q.id] === q.correctAnswer ? 'bg-green-50 border-green-100 text-green-900' : 'bg-red-50 border-red-100 text-red-900'}`}>
              <div className="flex items-start gap-5"><span className="text-3xl filter drop-shadow-sm">{session.userAnswers[q.id] === q.correctAnswer ? '✅' : '❌'}</span><div><p className="font-black uppercase tracking-tight text-lg mb-1">{session.userAnswers[q.id] === q.correctAnswer ? 'Verified' : 'System Error'}</p><p className="text-sm font-medium leading-relaxed opacity-80">{q.explanation}</p></div></div>
            </div>
          )}
        </div>
        <div className="flex justify-between items-center"><p className="text-slate-400 font-bold text-xs uppercase tracking-widest">Question {session.currentQuestionIndex + 1} of {session.questions.length}</p><button onClick={nextQuestion} disabled={!isAnswered} className={`px-12 py-5 bg-slate-950 text-white rounded-2xl font-black uppercase tracking-widest shadow-2xl transition-all ${!isAnswered ? 'opacity-30 cursor-not-allowed' : 'hover:bg-blue-600 hover:scale-105 active:scale-95'}`}>{session.currentQuestionIndex < session.questions.length - 1 ? 'Next Phase →' : 'Finalize Mission'}</button></div>
      </div>
    );
  };

  const AdminView = () => {
    const [newQ, setNewQ] = useState({ trade: Trade.B1_ENGINEER, text: '', correctAnswer: 'A', explanation: '', difficulty: 'Medium' as 'Easy' | 'Medium' | 'Hard' });
    const [options, setOptions] = useState([{ id: 'A', text: '' }, { id: 'B', text: '' }, { id: 'C', text: '' }, { id: 'D', text: '' }]);
    const [analyzing, setAnalyzing] = useState(false);
    const handleAIEnhance = async () => { if (!newQ.text) return alert("Enter question text first"); setAnalyzing(true); const explanation = await geminiService.generateExplanation(newQ.text, newQ.correctAnswer); setNewQ({ ...newQ, explanation }); setAnalyzing(false); };
    return (
      <div className="space-y-10 pb-20">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div><h2 className="text-4xl font-black text-slate-900 uppercase">System Override</h2><div className="flex items-center gap-2 mt-2"><span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span><p className="text-slate-500 font-black text-xs uppercase tracking-widest">Database Node: ONLINE // MongoDB Verified</p></div></div>
          <button className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-slate-800 transition-all shadow-xl">📥 Import Flight Data</button>
        </header>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <section className="lg:col-span-2 bg-white rounded-[2.5rem] border border-slate-100 shadow-xl overflow-hidden">
             <div className="p-8 border-b border-slate-50 bg-slate-50/50 flex justify-between items-center"><h3 className="font-black text-lg uppercase tracking-tight">Active Module Registry ({questions.length})</h3></div>
             <div className="overflow-x-auto"><table className="w-full text-left"><thead className="bg-slate-50 text-slate-400 uppercase text-[10px] font-black tracking-[0.2em]"><tr><th className="px-8 py-5">Objective</th><th className="px-8 py-5">Classification</th><th className="px-8 py-5 text-right">Ops</th></tr></thead><tbody className="divide-y divide-slate-50">{questions.map(q => (<tr key={q.id} className="hover:bg-blue-50/30 transition-colors"><td className="px-8 py-6 max-w-xs truncate font-bold text-slate-800">{q.text}</td><td className="px-8 py-6"><span className="px-3 py-1 bg-slate-100 rounded-lg text-[9px] font-black text-slate-500 uppercase tracking-widest">{q.trade}</span></td><td className="px-8 py-6 text-right"><button onClick={async () => { if(confirm('Purge module from registry?')) { try { await apiService.deleteQuestion(q.id); setQuestions(questions.filter(item => item.id !== q.id)); } catch(e) { alert('Purge failed'); } } }} className="text-red-500 hover:text-red-700 font-black text-[10px] uppercase tracking-widest">Purge</button></td></tr>))}</tbody></table></div>
          </section>
          <section className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl p-10">
            <h3 className="font-black text-2xl mb-8 uppercase tracking-tight text-slate-900">Module Uplink</h3>
            <div className="space-y-6">
              <div><label className="block text-[10px] font-black text-slate-400 uppercase mb-3 tracking-widest">Classification</label><select className="w-full p-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-blue-600 focus:bg-white transition-all font-bold outline-none" value={newQ.trade} onChange={(e) => setNewQ({ ...newQ, trade: e.target.value as Trade })}>{Object.values(Trade).map(t => <option key={t} value={t}>{t}</option>)}</select></div>
              <div><label className="block text-[10px] font-black text-slate-400 uppercase mb-3 tracking-widest">Objective Script</label><textarea rows={2} className="w-full p-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-blue-600 focus:bg-white transition-all font-bold outline-none text-sm" placeholder="Define technical challenge..." value={newQ.text} onChange={(e) => setNewQ({ ...newQ, text: e.target.value })} /></div>
              <div className="space-y-3">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Parameter Options</label>
                {options.map((opt, idx) => (<div key={opt.id} className="flex items-center gap-3"><span className="font-black text-slate-300 w-4">{opt.id}</span><input placeholder={`Result ${opt.id}`} className="flex-1 p-3 rounded-xl bg-slate-50 border border-transparent focus:border-blue-400 outline-none text-xs font-bold" value={opt.text} onChange={(e) => { const newOpts = [...options]; newOpts[idx].text = e.target.value; setOptions(newOpts); }} /></div>))}
              </div>
              <div className="grid grid-cols-2 gap-4">
                 <div><label className="block text-[10px] font-black text-slate-400 uppercase mb-3 tracking-widest">Key Index</label><select className="w-full p-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-blue-600 font-bold outline-none" value={newQ.correctAnswer} onChange={(e) => setNewQ({ ...newQ, correctAnswer: e.target.value })}><option value="A">A</option><option value="B">B</option><option value="C">C</option><option value="D">D</option></select></div>
                 <div><label className="block text-[10px] font-black text-slate-400 uppercase mb-3 tracking-widest">Level</label><select className="w-full p-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-blue-600 font-bold outline-none" value={newQ.difficulty} onChange={(e) => setNewQ({ ...newQ, difficulty: e.target.value as any })}><option value="Easy">Routine</option><option value="Medium">Advanced</option><option value="Hard">Critical</option></select></div>
              </div>
              <div><label className="flex items-center justify-between text-[10px] font-black text-slate-400 uppercase mb-3 tracking-widest">Technical Analysis <button onClick={handleAIEnhance} disabled={analyzing} className="text-blue-600 font-black hover:scale-110 transition-transform">{analyzing ? '⌛' : 'AI ✨'}</button></label><textarea rows={3} className="w-full p-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-blue-600 focus:bg-white transition-all font-bold outline-none text-xs" placeholder="Technical justification..." value={newQ.explanation} onChange={(e) => setNewQ({ ...newQ, explanation: e.target.value })} /></div>
              <button onClick={() => { handleAddQuestion({ ...newQ, options: options }); setNewQ({ ...newQ, text: '', explanation: '' }); setOptions(options.map(o => ({...o, text: ''}))); }} className="w-full py-5 bg-blue-600 text-white font-black rounded-2xl mt-6 uppercase tracking-[0.2em] shadow-xl shadow-blue-600/30 hover:bg-blue-500 hover:scale-[1.02] active:scale-95 transition-all">Sync to Mainframe</button>
            </div>
          </section>
        </div>
      </div>
    );
  };

  return (
    <Layout currentView={view} setView={setView} user={user}>
      {view === 'LANDING' && <LandingView />}
      {view === 'AUTH' && <AuthView />}
      {view === 'DASHBOARD' && <DashboardView />}
      {view === 'TRADE_SELECT' && <TradeSelectView />}
      {view === 'QUIZ' && <QuizView />}
      {view === 'RESULTS' && (
        <div className="max-w-2xl mx-auto py-20 animate-in slide-in-from-bottom duration-1000">
           <div className="bg-white p-16 rounded-[3rem] shadow-2xl border border-slate-100 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-600 to-indigo-600"></div>
            <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center text-5xl mx-auto mb-10 shadow-inner">🏆</div>
            <h2 className="text-5xl font-black text-slate-900 mb-4 uppercase tracking-tighter">Debriefing Complete</h2>
            <p className="text-slate-500 font-medium mb-12 text-xl">Your performance data has been logged to the flight records.</p>
            <div className="flex gap-4">
              <button onClick={() => setView('REVIEW')} className="flex-1 px-8 py-6 bg-slate-100 text-slate-900 rounded-2xl font-black uppercase tracking-[0.2em] hover:bg-slate-200 transition-all">Review Log</button>
              <button onClick={() => setView('DASHBOARD')} className="flex-1 px-8 py-6 bg-slate-950 text-white rounded-2xl font-black uppercase tracking-[0.2em] shadow-2xl hover:bg-blue-600 transition-all">Return to Base</button>
            </div>
           </div>
        </div>
      )}
      {view === 'ADMIN' && <AdminView />}
      {view === 'PROFILE' && <ProfileView />}
      {view === 'REVIEW' && <ReviewView />}
    </Layout>
  );
};

export default App;
