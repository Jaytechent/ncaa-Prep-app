import React, { useState, useCallback } from 'react';
import { Trade, Question } from '../types';
import { geminiService } from '../services/geminiService';
import { apiService } from '../services/apiService';

interface ParsedQuestion {
  trade?: string;
  text: string;
  options: { id: string; text: string }[];
  correctAnswer: string;
  explanation: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  _issues?: string[];
  _status?: 'pending' | 'synced' | 'error';
}

interface AdminViewProps {
  questions: Question[];
  setQuestions: React.Dispatch<React.SetStateAction<Question[]>>;
}

const DiffBadge: React.FC<{ d: string }> = ({ d }) => {
  const c: Record<string, string> = {
    Easy: 'bg-green-100 text-green-700',
    Medium: 'bg-yellow-100 text-yellow-700',
    Hard: 'bg-red-100 text-red-700',
  };
  return <span className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase ${c[d] || 'bg-slate-100 text-slate-500'}`}>{d}</span>;
};

const FORMAT_EXAMPLE = `1. What is the primary purpose of an Aircraft Maintenance Manual (AMM)?
A. To list spare parts only
B. To guide aircraft inspection and maintenance procedures
C. To train pilots
D. To certify aircraft manufacturers
ANS: B

2. Who has joint responsibility for flight safety?
A. Only the pilot
B. Only the dispatcher
C. Pilot and dispatcher *
D. Air traffic control

3. What happens when collective pitch is increased?
A. Rotor RPM decreases
B. Lift increases
C. Tail rotor stops
D. Forward speed decreases automatically
Answer: B`;

export const AdminView: React.FC<AdminViewProps> = ({ questions, setQuestions }) => {
  const [tab, setTab] = useState<'registry' | 'uplink'>('registry');
  const [bulkText, setBulkText] = useState('');
  const [bulkTrade, setBulkTrade] = useState<Trade>(Trade.B1_ENGINEER);
  const [isParsing, setIsParsing] = useState(false);
  const [parseError, setParseError] = useState('');
  const [parsed, setParsed] = useState<ParsedQuestion[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncProgress, setSyncProgress] = useState(0);
  const [showFormat, setShowFormat] = useState(false);

  const handleParse = useCallback(async () => {
    if (!bulkText.trim()) { setParseError('Please paste some questions first.'); return; }
    setParseError('');
    setParsed([]);
    setIsParsing(true);
    try {
      const result = await geminiService.parseBulkText(bulkText, bulkTrade);
      if (!result.length) {
        setParseError('No questions found. Make sure your text follows the format shown below.');
        return;
      }
      setParsed(result.map(q => ({ ...q, _status: 'pending' as const })));
    } catch (err: any) {
      setParseError(err.message || 'Parsing failed.');
    } finally {
      setIsParsing(false);
    }
  }, [bulkText, bulkTrade]);

  const handleSync = useCallback(async () => {
    const pending = parsed.filter(q => q._status === 'pending');
    if (!pending.length) return;
    setIsSyncing(true);
    setSyncProgress(0);
    const updated = [...parsed];
    let done = 0;
    for (let i = 0; i < updated.length; i++) {
      if (updated[i]._status !== 'pending') continue;
      try {
        await apiService.saveQuestion({
          trade: bulkTrade,
          text: updated[i].text,
          options: updated[i].options,
          correctAnswer: updated[i].correctAnswer,
          explanation: updated[i].explanation,
          difficulty: updated[i].difficulty,
        });
        updated[i] = { ...updated[i], _status: 'synced' };
      } catch {
        updated[i] = { ...updated[i], _status: 'error' };
      }
      done++;
      setSyncProgress(Math.round((done / pending.length) * 100));
      setParsed([...updated]);
    }
    setIsSyncing(false);
    apiService.fetchQuestions().then(d => setQuestions(d));
  }, [parsed, bulkTrade, setQuestions]);

  const updateField = (idx: number, field: keyof ParsedQuestion, value: any) => {
    setParsed(prev => prev.map((q, i) => i === idx ? { ...q, [field]: value } : q));
  };

  const removeItem = (idx: number) => setParsed(prev => prev.filter((_, i) => i !== idx));

  const syncedCount  = parsed.filter(q => q._status === 'synced').length;
  const errorCount   = parsed.filter(q => q._status === 'error').length;
  const pendingCount = parsed.filter(q => q._status === 'pending').length;
  const reviewCount  = parsed.filter(q => q._issues?.length).length;

  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black uppercase tracking-tight">Command Console</h2>
          <p className="text-slate-400 text-sm mt-1">{questions.length} questions in database</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setTab('registry')} className={`px-5 py-2.5 rounded-xl font-black text-xs uppercase transition-all ${tab === 'registry' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
            📋 Registry
          </button>
          <button onClick={() => setTab('uplink')} className={`px-5 py-2.5 rounded-xl font-black text-xs uppercase transition-all ${tab === 'uplink' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
            ➕ Add Questions
          </button>
        </div>
      </header>

      {/* ── REGISTRY ── */}
      {tab === 'registry' && (
        <div className="bg-white rounded-[2rem] border shadow-sm overflow-hidden">
          <div className="p-6 border-b bg-slate-50 flex items-center justify-between">
            <span className="font-black uppercase text-sm">Question Registry</span>
            <span className="text-xs text-slate-400">{questions.length} total</span>
          </div>
          {questions.length === 0 ? (
            <div className="p-16 text-center text-slate-400">
              <p className="text-5xl mb-4">📭</p>
              <p className="font-bold text-lg">No questions yet.</p>
              <p className="text-sm mt-2">Use the <strong>Add Questions</strong> tab to get started.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-slate-400 text-[10px] font-black uppercase">
                  <tr>
                    <th className="px-4 py-4 w-8">#</th>
                    <th className="px-4 py-4">Question</th>
                    <th className="px-4 py-4">Trade</th>
                    <th className="px-4 py-4">Diff</th>
                    <th className="px-4 py-4">Ans</th>
                    <th className="px-4 py-4">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {questions.map((q, idx) => (
                    <tr key={q.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-4 text-slate-300 text-xs font-mono">{idx + 1}</td>
                      <td className="px-4 py-4 max-w-xs"><p className="font-bold text-sm truncate">{q.text}</p></td>
                      <td className="px-4 py-4"><span className="text-xs font-black text-blue-600 uppercase">{q.trade}</span></td>
                      <td className="px-4 py-4"><DiffBadge d={q.difficulty} /></td>
                      <td className="px-4 py-4"><span className="w-7 h-7 rounded-lg bg-green-100 text-green-700 flex items-center justify-center font-black text-sm">{q.correctAnswer}</span></td>
                      <td className="px-4 py-4">
                        <button onClick={() => { if (confirm('Delete this question?')) { apiService.deleteQuestion(q.id).then(() => setQuestions(prev => prev.filter(i => i.id !== q.id))); }}} className="text-red-400 hover:text-red-600 font-black text-xs uppercase">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ── ADD QUESTIONS ── */}
      {tab === 'uplink' && (
        <div className="space-y-6">

          {/* Format guide toggle */}
          <div className="bg-white rounded-2xl border overflow-hidden">
            <button onClick={() => setShowFormat(f => !f)} className="w-full p-5 flex items-center justify-between text-left hover:bg-slate-50 transition-colors">
              <div className="flex items-center gap-3">
                <span className="text-2xl">📖</span>
                <div>
                  <p className="font-black text-slate-900">How to format your questions</p>
                  <p className="text-xs text-slate-400 mt-0.5">Supports ANS:, asterisk (*), or Answer: markers — click to {showFormat ? 'hide' : 'see examples'}</p>
                </div>
              </div>
              <span className="text-slate-400 font-black text-lg">{showFormat ? '▲' : '▼'}</span>
            </button>

            {showFormat && (
              <div className="border-t">
                <div className="p-5 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  <div className="bg-blue-50 rounded-xl p-4">
                    <p className="font-black text-blue-700 uppercase mb-2">Method 1 — ANS: label</p>
                    <pre className="text-slate-600 leading-relaxed whitespace-pre-wrap font-mono text-[11px]">{`1. Question text?
A. Option one
B. Option two
C. Option three
D. Option four
ANS: B`}</pre>
                  </div>
                  <div className="bg-green-50 rounded-xl p-4">
                    <p className="font-black text-green-700 uppercase mb-2">Method 2 — Asterisk *</p>
                    <pre className="text-slate-600 leading-relaxed whitespace-pre-wrap font-mono text-[11px]">{`1. Question text?
A. Option one
B. Option two *
C. Option three
D. Option four`}</pre>
                  </div>
                  <div className="bg-yellow-50 rounded-xl p-4">
                    <p className="font-black text-yellow-700 uppercase mb-2">Method 3 — Answer:</p>
                    <pre className="text-slate-600 leading-relaxed whitespace-pre-wrap font-mono text-[11px]">{`1. Question text?
A) Option one
B) Option two
C) Option three
D) Option four
Answer: C`}</pre>
                  </div>
                </div>
                <div className="px-5 pb-5">
                  <p className="text-xs text-slate-500 mb-2 font-bold">✅ Also accepted:</p>
                  <div className="flex flex-wrap gap-2 text-xs">
                    {['a. / a) / (A)', 'ANSWER: B', 'Correct: D', 'Just the letter B on its own line', 'Mix of formats in same paste'].map(t => (
                      <span key={t} className="bg-slate-100 px-3 py-1 rounded-full text-slate-600">{t}</span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Trade + paste area */}
          <div className="bg-slate-900 rounded-[2rem] p-6 space-y-5">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Target Trade</label>
                <select className="w-full bg-slate-800 border border-slate-700 p-3 rounded-xl font-bold text-white focus:ring-2 focus:ring-blue-500 outline-none" value={bulkTrade} onChange={e => setBulkTrade(e.target.value as Trade)}>
                  {Object.values(Trade).map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div className="flex items-end">
                <button onClick={() => setBulkText(FORMAT_EXAMPLE)} className="px-5 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-xl font-black text-xs uppercase transition-all">
                  Load Example
                </button>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
                Paste Questions Here
                {bulkText.length > 0 && <span className="ml-2 text-slate-500 normal-case font-normal">{bulkText.length} characters</span>}
              </label>
              <textarea
                className="w-full h-80 bg-slate-950 rounded-xl border border-slate-700 p-5 font-mono text-sm text-slate-200 placeholder:text-slate-600 focus:ring-2 focus:ring-blue-500 outline-none resize-y"
                placeholder={`Paste your questions here...\n\n1. Question text?\nA. Option one\nB. Option two\nC. Option three\nD. Option four\nANS: B\n\n2. Next question...`}
                value={bulkText}
                onChange={e => { setBulkText(e.target.value); setParseError(''); }}
              />
            </div>

            {parseError && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-xl text-sm flex items-start gap-3">
                <span className="text-lg flex-shrink-0">⚠️</span>
                <span>{parseError}</span>
              </div>
            )}

            {parsed.length === 0 && (
              <button onClick={handleParse} disabled={isParsing || !bulkText.trim()} className={`w-full py-5 rounded-2xl font-black uppercase tracking-widest text-lg transition-all ${isParsing ? 'bg-slate-700 text-slate-400 cursor-wait' : 'bg-blue-600 hover:bg-blue-500 text-white'} disabled:opacity-40 disabled:cursor-not-allowed`}>
                {isParsing ? (
                  <span className="flex items-center justify-center gap-3">
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Parsing questions...
                  </span>
                ) : '⚡ Parse Questions'}
              </button>
            )}
          </div>

          {/* Preview */}
          {parsed.length > 0 && (
            <div className="space-y-5">
              {/* Summary */}
              <div className="bg-white rounded-2xl border p-5 flex flex-wrap items-center gap-6 justify-between">
                <div className="flex gap-6">
                  <div className="text-center">
                    <p className="text-3xl font-black text-slate-900">{parsed.length}</p>
                    <p className="text-[10px] font-black text-slate-400 uppercase">Parsed</p>
                  </div>
                  {syncedCount > 0 && <div className="text-center"><p className="text-3xl font-black text-green-600">{syncedCount}</p><p className="text-[10px] font-black text-green-500 uppercase">Saved</p></div>}
                  {reviewCount > 0 && <div className="text-center"><p className="text-3xl font-black text-yellow-600">{reviewCount}</p><p className="text-[10px] font-black text-yellow-500 uppercase">Review</p></div>}
                  {errorCount > 0 && <div className="text-center"><p className="text-3xl font-black text-red-600">{errorCount}</p><p className="text-[10px] font-black text-red-500 uppercase">Failed</p></div>}
                </div>
                <div className="flex gap-3">
                  <button onClick={() => { setParsed([]); setBulkText(''); }} className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 rounded-xl font-black text-xs uppercase">✕ Clear</button>
                  {pendingCount > 0 && (
                    <button onClick={handleSync} disabled={isSyncing} className={`px-8 py-2.5 rounded-xl font-black text-xs uppercase text-white transition-all ${isSyncing ? 'bg-slate-400 cursor-wait' : 'bg-green-600 hover:bg-green-500'}`}>
                      {isSyncing ? `Saving ${syncProgress}%...` : `💾 Save ${pendingCount} to Database`}
                    </button>
                  )}
                </div>
              </div>

              {isSyncing && (
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-green-500 transition-all duration-300" style={{ width: `${syncProgress}%` }} />
                </div>
              )}

              {reviewCount > 0 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4 text-sm text-yellow-800">
                  <p className="font-black"> {reviewCount} question(s) need your attention</p>
                  <p className="mt-1 text-xs">No answer marker was detected. Please select the correct answer below before saving.</p>
                </div>
              )}

              {/* Question cards */}
              <div className="space-y-4">
                {parsed.map((q, idx) => (
                  <div key={idx} className={`bg-white rounded-2xl border-2 p-6 transition-all ${q._status === 'synced' ? 'border-green-200 opacity-60' : q._status === 'error' ? 'border-red-200' : q._issues?.length ? 'border-yellow-300' : 'border-slate-100'}`}>
                    {/* Card header */}
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-black text-xs">{idx + 1}</span>
                        <DiffBadge d={q.difficulty} />
                        {q._status === 'synced' && <span className="text-[10px] font-black text-green-600 bg-green-100 px-2 py-0.5 rounded-full">✓ Saved</span>}
                        {q._status === 'error'  && <span className="text-[10px] font-black text-red-600 bg-red-100 px-2 py-0.5 rounded-full">✗ Failed</span>}
                        {q._issues?.length > 0  && <span className="text-[10px] font-black text-yellow-700 bg-yellow-100 px-2 py-0.5 rounded-full">⚠ Needs review</span>}
                      </div>
                      {q._status === 'pending' && (
                        <button onClick={() => removeItem(idx)} className="text-slate-300 hover:text-red-500 font-black text-sm transition-colors">✕</button>
                      )}
                    </div>

                    {/* Question text */}
                    <p className="font-bold text-slate-800 mb-4 leading-relaxed">{q.text}</p>

                    {/* Options */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
                      {q.options.map(opt => (
                        <div key={opt.id} className={`flex items-center gap-3 p-3 rounded-xl border text-sm cursor-pointer transition-all ${opt.id === q.correctAnswer ? 'bg-green-50 border-green-300 font-black text-green-800' : 'bg-slate-50 border-slate-100 text-slate-600 hover:border-blue-300'}`}
                          onClick={() => q._status === 'pending' && updateField(idx, 'correctAnswer', opt.id)}>
                          <span className={`w-6 h-6 rounded-md flex items-center justify-center text-xs font-black flex-shrink-0 ${opt.id === q.correctAnswer ? 'bg-green-500 text-white' : 'bg-slate-200 text-slate-500'}`}>{opt.id}</span>
                          {opt.text}
                        </div>
                      ))}
                    </div>

                    {/* If needs review: prompt to pick answer */}
                    {q._issues?.length > 0 && q._status === 'pending' && (
                      <p className="text-xs text-yellow-700 bg-yellow-50 border border-yellow-200 rounded-xl p-3 mb-4">
                        👆 <strong>Click the correct answer above</strong> to mark it before saving. Issues: {q._issues.join(', ')}
                      </p>
                    )}

                    {/* Explanation */}
                    <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                      <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Explanation</p>
                      {q._status === 'pending' ? (
                        <textarea
                          className="w-full text-xs text-slate-600 bg-transparent resize-none outline-none leading-relaxed min-h-[60px]"
                          value={q.explanation}
                          onChange={e => updateField(idx, 'explanation', e.target.value)}
                          placeholder="Add an explanation..."
                        />
                      ) : (
                        <p className="text-xs text-slate-500 leading-relaxed">{q.explanation}</p>
                      )}
                    </div>

                    {/* Difficulty selector */}
                    {q._status === 'pending' && (
                      <div className="mt-3 flex items-center gap-2">
                        <p className="text-[10px] font-black text-slate-400 uppercase">Difficulty:</p>
                        {(['Easy','Medium','Hard'] as const).map(d => (
                          <button key={d} onClick={() => updateField(idx, 'difficulty', d)}
                            className={`text-xs font-black px-3 py-1 rounded-full transition-all ${q.difficulty === d ? (d === 'Easy' ? 'bg-green-500 text-white' : d === 'Medium' ? 'bg-yellow-500 text-white' : 'bg-red-500 text-white') : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}>
                            {d}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
