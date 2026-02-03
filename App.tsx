
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
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [user, setUser] = useState<any>(null);
  const [currentTrade, setCurrentTrade] = useState<Trade | null>(null);
  const [session, setSession] = useState<QuizSession | null>(null);
  const [stats, setStats] = useState<UserStats>({
    totalQuizzes: 0,
    averageScore: 0,
    bestTrade: null,
    history: []
  });

  // --- AUTH FORM STATE ---
  const [authMode, setAuthMode] = useState<'LOGIN' | 'REGISTER'>('LOGIN');
  const [authData, setAuthData] = useState({ name: '', email: '', password: '', adminSecret: '' });
  const [authError, setAuthError] = useState('');

  // --- PERSISTENCE & ONLINE CHECK ---
  useEffect(() => {
    const handleStatusChange = () => setIsOnline(navigator.onLine);
    window.addEventListener('online', handleStatusChange);
    window.addEventListener('offline', handleStatusChange);
    
    const savedUser = localStorage.getItem('ncaa_user_data');
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        setUser(parsed);
        if (parsed.stats) setStats(parsed.stats);
      } catch (e) {
        console.error("Failed to parse user data", e);
      }
    }

    const loadQuestions = async () => {
      try {
        const data = await apiService.fetchQuestions();
        if (data.length > 0) setQuestions(data);
      } catch (err) {
        console.log('Using default or cached questions.');
      } finally {
        setIsLoading(false);
      }
    };
    loadQuestions();

    return () => {
      window.removeEventListener('online', handleStatusChange);
      window.removeEventListener('offline', handleStatusChange);
    };
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
    if (!session || session.userAnswers[questionId]) return;
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

  const finishQuiz = async () => {
    if (!session) return;
    const score = session.questions.reduce((acc, q) => {
      return acc + (session.userAnswers[q.id] === q.correctAnswer ? 1 : 0);
    }, 0);

    const quizResult = { trade: session.trade, score, total: session.questions.length };

    if (user) {
      try {
        const updatedStats = await apiService.updateStats(quizResult);
        if (updatedStats) {
          setStats(updatedStats);
          const updatedUser = { ...user, stats: updatedStats };
          setUser(updatedUser);
          localStorage.setItem('ncaa_user_data', JSON.stringify(updatedUser));
        }
      } catch (e) {
        console.warn("Stats sync failed", e);
      }
    }

    setSession({ ...session, endTime: Date.now() });
    setView('RESULTS');
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    try {
      let data;
      if (authMode === 'LOGIN') {
        data = await apiService.login({ email: authData.email, password: authData.password });
      } else {
        data = await apiService.register(authData);
      }
      setUser(data);
      if (data.stats) setStats(data.stats);
      setView('DASHBOARD');
    } catch (err: any) {
      setAuthError(err.message || 'Authentication failed');
    }
  };

  // --- VIEWS ---
  const OfflineBadge = () => (
    <div className={`fixed top-4 left-1/2 -translate-x-1/2 z-[100] px-4 py-1.5 rounded-full border text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-all shadow-lg backdrop-blur-md ${isOnline ? 'bg-green-500/10 border-green-500/30 text-green-500' : 'bg-orange-500/10 border-orange-500/30 text-orange-500 animate-pulse'}`}>
      <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500' : 'bg-orange-500'}`}></span>
      {isOnline ? 'Cloud Sync Online' : 'Local Offline Mode Active'}
    </div>
  );

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
          <button onClick={() => setView('FLEET_SPECS')} className="px-10 py-5 bg-slate-900/80 hover:bg-slate-800 rounded-xl font-black text-xl transition-all border border-slate-700 backdrop-blur-sm">
            FLEET SPECS
          </button>
        </div>
      </div>
    </div>
  );

  const AuthView = () => (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent"></div>
      <div className="w-full max-w-md bg-slate-900/90 backdrop-blur-xl p-10 rounded-[2rem] shadow-2xl border border-slate-800 relative z-10">
        <div className="w-16 h-1 bg-blue-600 rounded-full mb-8 mx-auto"></div>
        <h2 className="text-3xl font-black text-white mb-2 text-center uppercase tracking-tight">{authMode === 'LOGIN' ? 'Identity Check' : 'Recruit Enrollment'}</h2>
        <p className="text-slate-500 mb-8 text-center font-medium">Clearance required for professional modules.</p>
        
        {authError && <div className="bg-red-500/10 border border-red-500/30 text-red-500 p-4 rounded-xl text-xs font-bold mb-6 text-center">{authError}</div>}

        <form onSubmit={handleAuth} className="space-y-5">
          {authMode === 'REGISTER' && (
            <>
              <div>
                <label className="block text-xs font-black text-slate-400 mb-2 uppercase tracking-widest">Full Name</label>
                <input type="text" required value={authData.name} onChange={e => setAuthData({...authData, name: e.target.value})} className="w-full bg-slate-800/50 p-4 rounded-xl border border-slate-700 text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all" placeholder="Captain Maverick" />
              </div>
              <div>
                <label className="block text-xs font-black text-yellow-400/80 mb-2 uppercase tracking-widest">Security Clearance Key (For Admin Only)</label>
                <input type="password" value={authData.adminSecret} onChange={e => setAuthData({...authData, adminSecret: e.target.value})} className="w-full bg-slate-800/50 p-4 rounded-xl border border-yellow-500/30 text-white focus:ring-2 focus:ring-yellow-500 outline-none transition-all placeholder:text-slate-600" placeholder="Enter Secret To Enable Admin Tools" />
              </div>
            </>
          )}
          <div>
            <label className="block text-xs font-black text-slate-400 mb-2 uppercase tracking-widest">Aviation ID (Email)</label>
            <input type="email" required value={authData.email} onChange={e => setAuthData({...authData, email: e.target.value})} placeholder="name@airline.com" className="w-full bg-slate-800/50 p-4 rounded-xl border border-slate-700 text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
          </div>
          <div>
            <label className="block text-xs font-black text-slate-400 mb-2 uppercase tracking-widest">Security Pass</label>
            <input type="password" required value={authData.password} onChange={e => setAuthData({...authData, password: e.target.value})} placeholder="••••••••" className="w-full bg-slate-800/50 p-4 rounded-xl border border-slate-700 text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
          </div>
          <button type="submit" className="w-full py-5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-black uppercase tracking-widest transition-all mt-4 shadow-lg shadow-blue-600/20">
            {authMode === 'LOGIN' ? 'Authorize Access' : 'Initialize Asset'}
          </button>
        </form>
        <button onClick={() => setAuthMode(authMode === 'LOGIN' ? 'REGISTER' : 'LOGIN')} className="w-full text-center mt-6 text-xs text-slate-500 hover:text-white transition-colors">
          {authMode === 'LOGIN' ? "Need a clearance? Start Enrollment" : "Already registered? Login to Cockpit"}
        </button>
      </div>
    </div>
  );

  const DashboardView = () => (
    <div className="space-y-8 pb-12">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500' : 'bg-orange-500'}`}></span>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Status: {isOnline ? 'Operational' : 'Standalone'}</span>
          </div>
          <h2 className="text-4xl font-black text-slate-900 leading-none uppercase">Commander {user?.name?.split(' ')[1] || user?.name || 'Asset'}</h2>
          <p className="text-slate-500 mt-2 font-medium">Readiness: {stats.averageScore}%</p>
        </div>
        <div className="bg-white p-2 rounded-xl border flex gap-4">
           <div className="px-4 py-2 bg-blue-50 rounded-lg text-center"><p className="text-[10px] font-black text-blue-400 uppercase">Flight Hours</p><p className="text-xl font-bold text-blue-900">{stats.totalQuizzes * 2}</p></div>
           <div className="px-4 py-2 bg-yellow-50 rounded-lg text-center"><p className="text-[10px] font-black text-yellow-600 uppercase">Cert Level</p><p className="text-xl font-bold text-yellow-900">{stats.averageScore > 80 ? 'PRO-I' : 'CADET'}</p></div>
        </div>
      </header>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 text-4xl opacity-5 group-hover:scale-150 transition-transform">📊</div>
          <p className="text-xs font-black text-slate-400 uppercase tracking-wider mb-3">Avg. Score</p>
          <div className="flex items-end gap-2"><span className="text-5xl font-black text-slate-900 tracking-tighter">{stats.averageScore}%</span><span className="text-green-500 font-black text-sm mb-1.5 flex items-center">↑</span></div>
        </div>
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 text-4xl opacity-5 group-hover:scale-150 transition-transform">📝</div>
          <p className="text-xs font-black text-slate-400 uppercase tracking-wider mb-3">Data Samples</p>
          <div className="flex items-end gap-2"><span className="text-5xl font-black text-slate-900 tracking-tighter">{questions.length}</span><span className="text-slate-400 font-bold text-xs mb-1.5">Live Database</span></div>
        </div>
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 text-4xl opacity-5 group-hover:scale-150 transition-transform">🎯</div>
          <p className="text-xs font-black text-slate-400 uppercase tracking-wider mb-3">Missions</p>
          <div className="flex items-end gap-2"><span className="text-5xl font-black text-slate-900 tracking-tighter">{stats.totalQuizzes}</span><span className="text-blue-500 font-black text-xs mb-1.5">LOGGED</span></div>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <section>
          <div className="flex justify-between items-center mb-6"><h3 className="font-black text-xl uppercase tracking-tight">Recent Sorties</h3></div>
          <div className="space-y-4">
            {stats.history.length > 0 ? stats.history.slice(0, 3).map((h, i) => (
              <div key={i} className="flex items-center justify-between p-6 bg-white rounded-2xl border border-slate-100 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 ${h.score/h.total >= 0.7 ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'} rounded-xl flex items-center justify-center font-black text-lg`}>{h.score}/{h.total}</div>
                  <div><p className="font-black text-slate-900 text-sm uppercase">{h.trade}</p><p className="text-xs text-slate-400 font-medium">{new Date(h.date).toLocaleDateString()}</p></div>
                </div>
                <div className="text-right"><span className={`text-[10px] font-black px-2 py-1 rounded-md uppercase tracking-widest ${h.score/h.total >= 0.7 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{h.score/h.total >= 0.7 ? 'Success' : 'Aborted'}</span></div>
              </div>
            )) : <p className="text-slate-400 italic text-sm p-10 text-center bg-white rounded-3xl border border-dashed">No recent missions. Prepare for takeoff.</p>}
          </div>
        </section>
        <section className="bg-slate-950 rounded-3xl p-8 text-white relative overflow-hidden flex flex-col justify-between group">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-transparent"></div>
          <div className="absolute -right-12 -bottom-12 p-4 opacity-10 group-hover:scale-110 group-hover:-rotate-12 transition-all"><span className="text-[180px]">✈️</span></div>
          <div className="z-10 relative">
            <div className="inline-flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full text-[10px] font-black text-yellow-400 uppercase tracking-widest mb-4"><span className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></span> Critical Mission</div>
            <h3 className="font-black text-3xl mb-3 leading-tight uppercase">Emergency Briefing</h3>
            <p className="text-slate-400 mb-8 max-w-sm font-medium leading-relaxed">Simulated blitz assessment. Random trade, maximum difficulty.</p>
          </div>
          <div className="z-10 relative"><button onClick={() => { startQuiz(Trade.SAFETY_HUMAN_FACTORS, QuizMode.TIMED); }} className="w-full sm:w-auto px-10 py-4 bg-white text-slate-950 font-black rounded-xl uppercase tracking-widest transition-all hover:bg-yellow-400 hover:scale-105 shadow-xl">Scramble Now</button></div>
        </section>
      </div>
    </div>
  );

  const QuizView = () => {
    if (!session) return null;
    const q = session.questions[session.currentQuestionIndex];
    const progress = ((session.currentQuestionIndex + 1) / session.questions.length) * 100;
    const isAnswered = !!session.userAnswers[q.id];
    const userChoice = session.userAnswers[q.id];

    return (
      <div className="max-w-4xl mx-auto space-y-8 pb-32">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => { if(confirm("Abort mission?")) setView('DASHBOARD'); }} className="px-4 py-2 bg-slate-100 rounded-xl text-[10px] font-black text-slate-900 uppercase tracking-widest">✕ Abort</button>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Sector: <span className="text-blue-600">{session.trade}</span></span>
          </div>
        </div>
        <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden p-1 shadow-inner"><div className="h-full bg-blue-600 rounded-full transition-all duration-700 ease-out" style={{ width: `${progress}%` }}></div></div>
        
        <div className="bg-white p-8 md:p-16 rounded-[2.5rem] shadow-2xl border border-slate-100 relative">
          <div className="absolute -top-4 -left-4 w-12 h-12 bg-blue-600 text-white rounded-2xl flex items-center justify-center font-black text-xl shadow-lg">{session.currentQuestionIndex + 1}</div>
          <h2 className="text-2xl md:text-3xl font-black leading-tight text-slate-900 mb-10">{q.text}</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {q.options.map(opt => {
              const isCorrect = opt.id === q.correctAnswer;
              const isSelected = userChoice === opt.id;
              
              let styles = "border-slate-100 bg-white hover:border-blue-300";
              if (session.mode === QuizMode.PRACTICE && isAnswered) {
                if (isCorrect) styles = "border-green-500 bg-green-50 shadow-md scale-[1.02] z-10";
                else if (isSelected) styles = "border-red-500 bg-red-50";
                else styles = "opacity-40 grayscale";
              } else if (isSelected) {
                styles = "border-blue-600 bg-blue-50";
              }

              return (
                <button key={opt.id} disabled={isAnswered} onClick={() => handleAnswer(q.id, opt.id)} className={`w-full p-6 rounded-2xl border-2 text-left transition-all flex items-center gap-5 group relative overflow-hidden ${styles}`}>
                  <div className={`w-10 h-10 rounded-xl border-2 flex items-center justify-center font-black text-sm ${isSelected ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-200 text-slate-400'}`}>
                    {session.mode === QuizMode.PRACTICE && isAnswered && isCorrect ? '✓' : opt.id}
                  </div>
                  <span className="font-bold text-slate-700 leading-tight flex-1">{opt.text}</span>
                </button>
              );
            })}
          </div>
          
          {session.mode === QuizMode.PRACTICE && isAnswered && (
            <div className={`mt-12 p-8 rounded-3xl border-2 animate-in slide-in-from-top-4 duration-300 ${userChoice === q.correctAnswer ? 'bg-green-50 border-green-100' : 'bg-red-50 border-red-100'}`}>
              <div className="flex items-start gap-5">
                <span className="text-3xl">{userChoice === q.correctAnswer ? '✅' : '❌'}</span>
                <div>
                  <p className="font-black uppercase tracking-tight text-lg mb-1">{userChoice === q.correctAnswer ? 'Verified' : 'Technical Error'}</p>
                  <p className="text-sm font-medium leading-relaxed opacity-80">{q.explanation}</p>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <div className="flex justify-end">
          <button onClick={nextQuestion} disabled={!isAnswered} className={`px-12 py-5 bg-slate-950 text-white rounded-2xl font-black uppercase tracking-widest shadow-2xl transition-all ${!isAnswered ? 'opacity-30' : 'hover:bg-blue-600 active:scale-95'}`}>
            {session.currentQuestionIndex < session.questions.length - 1 ? 'Next Phase →' : 'Finalize Mission'}
          </button>
        </div>
      </div>
    );
  };

  const AdminView = () => {
    const [newQ, setNewQ] = useState({ trade: Trade.B1_ENGINEER, text: '', correctAnswer: 'A', explanation: '', difficulty: 'Medium' as 'Easy' | 'Medium' | 'Hard' });
    const [options, setOptions] = useState([{ id: 'A', text: '' }, { id: 'B', text: '' }, { id: 'C', text: '' }, { id: 'D', text: '' }]);
    const [analyzing, setAnalyzing] = useState(false);
    const [showBulk, setShowBulk] = useState(false);
    const [bulkText, setBulkText] = useState('');
    const [bulkTrade, setBulkTrade] = useState(Trade.B1_ENGINEER);
    const [parsedPreview, setParsedPreview] = useState<any[]>([]);
    const [isParsing, setIsParsing] = useState(false);
    const [isSyncing, setIsSyncing] = useState(false);
    const [syncProgress, setSyncProgress] = useState(0);

    const handleAIEnhance = async () => { 
      if (!newQ.text) return alert("Enter question text first"); 
      setAnalyzing(true); 
      const explanation = await geminiService.generateExplanation(newQ.text, newQ.correctAnswer); 
      setNewQ({ ...newQ, explanation }); 
      setAnalyzing(false); 
    };

    const handleBulkProcess = async () => {
      if (!bulkText.trim()) return alert("Paste content first.");
      setIsParsing(true);
      try {
        const result = await geminiService.parseBulkQuestions(bulkText, bulkTrade);
        setParsedPreview(result);
      } catch (err) {
        alert("AI could not parse this text.");
      } finally {
        setIsParsing(false);
      }
    };

    const handleBatchSync = async () => {
      if (!parsedPreview.length) return;
      setIsSyncing(true);
      setSyncProgress(0);
      for (let i = 0; i < parsedPreview.length; i++) {
        const q = parsedPreview[i];
        try {
          await apiService.saveQuestion({
            trade: bulkTrade,
            text: q.text,
            options: q.options,
            correctAnswer: q.correctAnswer,
            explanation: q.explanation,
            difficulty: q.difficulty as any
          });
        } catch(e) { console.error("Sync error", e); }
        setSyncProgress(Math.round(((i + 1) / parsedPreview.length) * 100));
      }
      alert(`Synchronized ${parsedPreview.length} modules.`);
      setParsedPreview([]);
      setBulkText('');
      setShowBulk(false);
      setIsSyncing(false);
      // Refresh questions list
      apiService.fetchQuestions().then(data => setQuestions(data));
    };

    return (
      <div className="space-y-10 pb-20">
        <header className="flex justify-between items-center">
          <h2 className="text-4xl font-black text-slate-900 uppercase tracking-tight">Command Override</h2>
          <button onClick={() => setShowBulk(!showBulk)} className={`px-8 py-4 rounded-xl font-black uppercase text-xs transition-all ${showBulk ? 'bg-red-600 text-white' : 'bg-blue-600 text-white'}`}>
            {showBulk ? '✕ Close Bulk Uplink' : '🚀 Launch Bulk Uplink'}
          </button>
        </header>

        {showBulk ? (
          <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white border border-blue-500/30">
            <h3 className="text-2xl font-black uppercase text-blue-400 mb-6">AI Tactical Bulk Uplink</h3>
            <textarea className="w-full h-64 bg-slate-950 rounded-2xl border-2 border-slate-800 p-6 font-mono text-sm outline-none focus:border-blue-500 mb-8" placeholder="Paste question text from your docs..." value={bulkText} onChange={(e) => setBulkText(e.target.value)} />
            <div className="flex gap-4 mb-10">
              <select className="bg-slate-800 p-4 rounded-xl font-bold outline-none border border-slate-700" value={bulkTrade} onChange={(e) => setBulkTrade(e.target.value as Trade)}>
                {Object.values(Trade).map(t => <option key={t} value={t}>{t}</option>)}
              </select>
              <button onClick={handleBulkProcess} disabled={isParsing || !bulkText} className="px-10 py-5 bg-blue-600 rounded-xl font-black uppercase tracking-widest">{isParsing ? 'Processing...' : 'Analyze with AI'}</button>
            </div>
            {parsedPreview.length > 0 && (
              <div className="space-y-4">
                <p className="text-green-400 font-black uppercase text-xs">Ready to Sync: {parsedPreview.length} Modules</p>
                {isSyncing && <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden"><div className="h-full bg-blue-500" style={{ width: `${syncProgress}%` }}></div></div>}
                <button onClick={handleBatchSync} disabled={isSyncing} className="w-full py-6 bg-white text-slate-900 font-black rounded-xl uppercase tracking-widest shadow-2xl">Initiate Batch Sync</button>
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <section className="lg:col-span-2 bg-white rounded-[2.5rem] border shadow-xl overflow-hidden">
               <div className="p-8 border-b bg-slate-50 font-black uppercase tracking-tight">Active Registry</div>
               <div className="overflow-x-auto">
                 <table className="w-full text-left">
                   <thead className="bg-slate-50 text-slate-400 text-[10px] font-black uppercase"><tr><th className="px-8 py-5">Question</th><th className="px-8 py-5">Trade</th><th className="px-8 py-5">Action</th></tr></thead>
                   <tbody className="divide-y">
                     {questions.slice(0, 15).map(q => (
                       <tr key={q.id} className="hover:bg-slate-50">
                         <td className="px-8 py-6 max-w-xs truncate font-bold text-sm">{q.text}</td>
                         <td className="px-8 py-6 text-[10px] font-black uppercase text-blue-600">{q.trade}</td>
                         <td className="px-8 py-6"><button onClick={() => { if(confirm("Purge?")) apiService.deleteQuestion(q.id).then(() => setQuestions(prev => prev.filter(i => i.id !== q.id))); }} className="text-red-500 font-black text-xs uppercase">Purge</button></td>
                       </tr>
                     ))}
                   </tbody>
                 </table>
               </div>
            </section>
            <section className="bg-white rounded-[2.5rem] border shadow-xl p-10">
              <h3 className="font-black text-2xl mb-8 uppercase text-slate-900">Module Uplink</h3>
              <div className="space-y-6">
                <div><label className="block text-[10px] font-black text-slate-400 uppercase mb-2">Trade</label><select className="w-full p-4 rounded-xl bg-slate-50 border outline-none font-bold" value={newQ.trade} onChange={(e) => setNewQ({ ...newQ, trade: e.target.value as Trade })}>{Object.values(Trade).map(t => <option key={t} value={t}>{t}</option>)}</select></div>
                <div><label className="block text-[10px] font-black text-slate-400 uppercase mb-2">Question</label><textarea className="w-full p-4 rounded-xl bg-slate-50 border outline-none font-bold text-sm" rows={3} value={newQ.text} onChange={(e) => setNewQ({ ...newQ, text: e.target.value })} /></div>
                <button onClick={async () => { await apiService.saveQuestion({...newQ, options}); alert("Uploaded."); }} className="w-full py-5 bg-slate-950 text-white font-black rounded-xl uppercase tracking-widest">Manual Sync</button>
              </div>
            </section>
          </div>
        )}
      </div>
    );
  };

  const ProfileView = () => (
    <div className="max-w-2xl mx-auto py-10 text-center space-y-10">
      <div className="w-32 h-32 rounded-full border-4 border-blue-600 mx-auto p-1"><div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center text-4xl">👨‍✈️</div></div>
      <h2 className="text-4xl font-black text-slate-900 uppercase">Commander {user?.name || 'Asset'}</h2>
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white p-8 rounded-3xl border shadow-sm"><p className="text-[10px] font-black text-blue-400 uppercase mb-2">Efficiency</p><p className="text-4xl font-black">{stats.averageScore}%</p></div>
        <div className="bg-white p-8 rounded-3xl border shadow-sm"><p className="text-[10px] font-black text-indigo-400 uppercase mb-2">Role</p><p className="text-xl font-black uppercase text-indigo-600">{user?.role}</p></div>
      </div>
      <button onClick={() => { apiService.clearAuth(); setUser(null); setView('LANDING'); }} className="px-10 py-4 bg-red-600 text-white rounded-xl font-black uppercase text-xs tracking-widest">Purge Credentials</button>
    </div>
  );

  return (
    <Layout currentView={view} setView={setView} user={user}>
      <OfflineBadge />
      {view === 'LANDING' && <LandingView />}
      {view === 'AUTH' && <AuthView />}
      {view === 'DASHBOARD' && <DashboardView />}
      {view === 'TRADE_SELECT' && (
        <div className="space-y-10 pb-20">
          <header><h2 className="text-4xl font-black text-slate-900 uppercase">Deployment Sector</h2></header>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {TRADE_INFO.map(info => (
              <div key={info.trade} onClick={() => setCurrentTrade(info.trade)} className={`cursor-pointer p-8 rounded-[2rem] border-2 transition-all group relative overflow-hidden ${currentTrade === info.trade ? 'border-blue-600 bg-blue-50/50 shadow-xl scale-[1.02]' : 'border-slate-100 bg-white hover:border-slate-300 shadow-sm'}`}>
                <div className={`w-14 h-14 ${info.color} rounded-2xl flex items-center justify-center text-3xl mb-6 shadow-lg shadow-black/10 transition-transform group-hover:scale-110`}>{info.icon}</div>
                <h3 className="font-black text-xl leading-tight uppercase text-slate-900">{info.trade}</h3>
                <p className="text-sm font-bold text-slate-400 mt-3 flex items-center gap-2"><span className="w-1.5 h-1.5 bg-slate-200 rounded-full"></span>{questions.filter(q => q.trade === info.trade).length} Modules</p>
              </div>
            ))}
          </div>
          {currentTrade && (
            <div className="fixed inset-x-0 bottom-0 p-8 bg-white/90 backdrop-blur-xl border-t z-50 animate-in slide-in-from-bottom-full duration-500">
              <div className="max-w-4xl mx-auto flex items-center justify-between">
                <div><h3 className="text-xl font-black text-slate-900 uppercase">{currentTrade}</h3><p className="text-slate-500 text-xs uppercase font-black tracking-widest">Mode Selection Required</p></div>
                <div className="flex gap-4">
                  <button onClick={() => startQuiz(currentTrade, QuizMode.PRACTICE)} className="px-8 py-4 bg-slate-100 font-black rounded-xl uppercase tracking-widest border hover:bg-slate-200 transition-all">Practice</button>
                  <button onClick={() => startQuiz(currentTrade, QuizMode.TIMED)} className="px-8 py-4 bg-blue-600 text-white font-black rounded-xl uppercase shadow-lg hover:bg-blue-500 transition-all">Final Exam</button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
      {view === 'QUIZ' && <QuizView />}
      {view === 'RESULTS' && (
        <div className="max-w-2xl mx-auto py-20 text-center space-y-8">
          <div className="bg-white p-16 rounded-[3rem] shadow-2xl border border-slate-100 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-600 to-indigo-600"></div>
            <h2 className="text-5xl font-black text-slate-900 mb-4 uppercase tracking-tighter">Debriefing Ready</h2>
            <p className="text-slate-500 font-medium mb-12 text-xl">Mission logged to flight record.</p>
            <div className="flex gap-4">
              <button onClick={() => setView('DASHBOARD')} className="flex-1 px-8 py-6 bg-slate-100 text-slate-900 rounded-2xl font-black uppercase tracking-[0.2em] hover:bg-slate-200 transition-all">Return To Base</button>
              <button onClick={() => setView('REVIEW')} className="flex-1 px-8 py-6 bg-slate-950 text-white rounded-2xl font-black uppercase tracking-[0.2em] shadow-2xl hover:bg-blue-600 transition-all">Review Log</button>
            </div>
          </div>
        </div>
      )}
      {view === 'ADMIN' && user?.role === 'admin' && <AdminView />}
      {view === 'PROFILE' && <ProfileView />}
      {view === 'REVIEW' && (
        <div className="space-y-10 pb-20 max-w-4xl mx-auto">
          <header className="flex justify-between items-center">
            <h2 className="text-4xl font-black text-slate-900 uppercase">Mission Review</h2>
            <button onClick={() => setView('DASHBOARD')} className="px-6 py-3 bg-slate-900 text-white rounded-xl font-black text-xs uppercase tracking-widest">Close Log</button>
          </header>
          <div className="space-y-6">
            {session?.questions.map((q, idx) => {
              const userAns = session.userAnswers[q.id];
              const isCorrect = userAns === q.correctAnswer;
              return (
                <div key={q.id} className={`p-8 rounded-[2rem] border-2 bg-white ${isCorrect ? 'border-green-100' : 'border-red-100'}`}>
                  <div className="flex items-start gap-4 mb-6"><div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-lg ${isCorrect ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>{idx + 1}</div><h4 className="text-xl font-bold leading-tight text-slate-800 pt-1">{q.text}</h4></div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
                    {q.options.map(opt => (<div key={opt.id} className={`p-4 rounded-xl border text-sm font-bold flex items-center gap-3 ${opt.id === q.correctAnswer ? 'bg-green-50 border-green-200 text-green-900' : opt.id === userAns ? 'bg-red-50 border-red-200 text-red-900' : 'bg-slate-50 border-transparent text-slate-400 opacity-50'}`}><span className="w-6 h-6 rounded flex items-center justify-center border border-current">{opt.id}</span> {opt.text}</div>))}
                  </div>
                  <div className={`p-6 rounded-2xl bg-slate-900 text-white`}><p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-2">Technical Analysis</p><p className="text-sm font-medium leading-relaxed opacity-90">{q.explanation}</p></div>
                </div>
              );
            })}
          </div>
        </div>
      )}
      {view === 'FLEET_SPECS' && (
        <div className="p-10 space-y-10">
          <h2 className="text-4xl font-black uppercase mb-10 tracking-tight">Fleet Intelligence</h2>
          <div className="bg-slate-900 text-white p-10 rounded-[3rem] border border-blue-500/30">
            <h3 className="text-2xl font-black text-blue-400 mb-4 uppercase">E-4B Nightwatch Strategic Brief</h3>
            <p className="text-slate-400 leading-relaxed max-w-2xl mb-8">The E-4B serves as the National Airborne Operations Center (NAOC). It is engineered for extreme survivability and global command capability.</p>
            <div className="grid grid-cols-2 gap-6 max-w-sm">
                <div className="bg-white/5 p-4 rounded-2xl border border-white/10 text-center"><p className="text-[10px] font-black text-slate-400 uppercase">Speed</p><p className="text-xl font-bold">Mach 0.92</p></div>
                <div className="bg-white/5 p-4 rounded-2xl border border-white/10 text-center"><p className="text-[10px] font-black text-slate-400 uppercase">Ceiling</p><p className="text-xl font-bold">45,000 ft</p></div>
            </div>
          </div>
          <button onClick={() => setView('LANDING')} className="px-8 py-4 bg-slate-950 text-white rounded-xl font-black uppercase text-xs tracking-widest">← Return to Perimeter</button>
        </div>
      )}
    </Layout>
  );
};

export default App;
