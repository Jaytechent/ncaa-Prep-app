import React, { useState, useCallback } from 'react';
import { Trade, Question } from '../types';
import { geminiService } from '../services/geminiService';
import { apiService } from '../services/apiService';

const MONO = "'Space Mono', 'Courier New', monospace";

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
    Easy: 'border-[#0057FF] text-[#0057FF]',
    Medium: 'border-yellow-600 text-yellow-700',
    Hard: 'border-red-600 text-red-700',
  };
  return (
    <span
      className={`text-[9px] font-black px-2 py-0.5 uppercase tracking-widest border ${c[d] || 'border-gray-400 text-gray-500'}`}
      style={{ fontFamily: MONO }}
    >
      {d}
    </span>
  );
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
    <div className="space-y-0 pb-20" style={{ fontFamily: MONO }}>

      {/* Header */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-black pb-5 mb-0">
        <div>
          <h2 className="text-3xl font-black uppercase tracking-tight">Command Console</h2>
          <p className="text-[10px] text-gray-400 uppercase tracking-widest mt-1">{questions.length} questions in database</p>
        </div>
        <div className="flex gap-0">
          <button
            onClick={() => setTab('registry')}
            className={`px-5 py-3 font-black text-[10px] uppercase tracking-widest border-2 border-black transition-colors ${tab === 'registry' ? 'bg-black text-white' : 'bg-white text-black hover:bg-gray-100'}`}
          >
            Registry
          </button>
          <button
            onClick={() => setTab('uplink')}
            className={`px-5 py-3 font-black text-[10px] uppercase tracking-widest border-2 border-l-0 border-black transition-colors ${tab === 'uplink' ? 'bg-[#0057FF] text-white border-[#0057FF]' : 'bg-white text-black hover:bg-gray-100'}`}
          >
            + Add Questions
          </button>
        </div>
      </header>

      {/* ── REGISTRY TAB ────────────────────────────────────────────────────── */}
      {tab === 'registry' && (
        <div className="border-2 border-black overflow-hidden">
          <div className="px-6 py-4 border-b-2 border-black bg-gray-50 flex items-center justify-between">
            <span className="font-black text-xs uppercase tracking-widest">Question Registry</span>
            <span className="text-[10px] text-gray-400 uppercase tracking-widest">{questions.length} total</span>
          </div>

          {questions.length === 0 ? (
            <div className="p-16 text-center">
              <p className="text-4xl mb-4">📭</p>
              <p className="font-black text-sm uppercase tracking-tight">No questions yet.</p>
              <p className="text-xs text-gray-400 mt-2 uppercase tracking-widest">Use the Add Questions tab to get started.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left" style={{ fontFamily: MONO }}>
                <thead className="bg-black text-white text-[9px] font-black uppercase tracking-widest">
                  <tr>
                    {['#', 'Question', 'Trade', 'Diff', 'Ans', 'Action'].map((h, i) => (
                      <th key={h} className={`px-4 py-3 ${i > 0 ? 'border-l border-gray-800' : ''}`}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {questions.map((q, idx) => (
                    <tr key={q.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-4 text-gray-300 text-xs font-mono">{idx + 1}</td>
                      <td className="px-4 py-4 max-w-xs">
                        <p className="font-bold text-sm truncate">{q.text}</p>
                      </td>
                      <td className="px-4 py-4">
                        <span className="text-[10px] font-black text-[#0057FF] uppercase tracking-widest">{q.trade}</span>
                      </td>
                      <td className="px-4 py-4"><DiffBadge d={q.difficulty} /></td>
                      <td className="px-4 py-4">
                        <span className="w-7 h-7 border-2 border-[#0057FF] text-[#0057FF] flex items-center justify-center font-black text-sm">
                          {q.correctAnswer}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <button
                          onClick={() => {
                            if (confirm('Delete this question?')) {
                              apiService.deleteQuestion(q.id).then(() =>
                                setQuestions(prev => prev.filter(i => i.id !== q.id))
                              );
                            }
                          }}
                          className="text-[10px] font-black uppercase tracking-widest text-red-500 hover:text-red-700 hover:underline"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ── ADD QUESTIONS TAB ────────────────────────────────────────────────── */}
      {tab === 'uplink' && (
        <div className="space-y-0">

          {/* Format guide */}
          <div className="border-2 border-black overflow-hidden">
            <button
              onClick={() => setShowFormat(f => !f)}
              className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors border-b-2 border-black"
            >
              <div className="flex items-center gap-4">
                <span className="w-7 h-7 border-2 border-black flex items-center justify-center font-black text-xs">?</span>
                <div>
                  <p className="font-black text-sm uppercase tracking-tight">How to format your questions</p>
                  <p className="text-[10px] text-gray-400 uppercase tracking-widest mt-0.5">
                    Supports ANS:, asterisk (*), or Answer: markers
                  </p>
                </div>
              </div>
              <span className="font-black text-sm">{showFormat ? '▲' : '▼'}</span>
            </button>

            {showFormat && (
              <div className="border-t border-black">
                <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-0">
                  {[
                    { label: 'Method 1 — ANS:', color: 'border-[#0057FF] text-[#0057FF]', code: `1. Question text?\nA. Option one\nB. Option two\nC. Option three\nD. Option four\nANS: B` },
                    { label: 'Method 2 — Asterisk *', color: 'border-black text-black', code: `1. Question text?\nA. Option one\nB. Option two *\nC. Option three\nD. Option four` },
                    { label: 'Method 3 — Answer:', color: 'border-yellow-600 text-yellow-700', code: `1. Question text?\nA) Option one\nB) Option two\nC) Option three\nD) Option four\nAnswer: C` },
                  ].map((m, i) => (
                    <div key={m.label} className={`p-4 border-b md:border-b-0 border-black ${i < 2 ? 'md:border-r' : ''}`}>
                      <p className={`font-black text-[10px] uppercase tracking-widest mb-3 border-b pb-2 ${m.color}`}>{m.label}</p>
                      <pre className="text-xs text-gray-600 leading-relaxed whitespace-pre-wrap font-mono">{m.code}</pre>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Trade selector + paste area */}
          <div className="border-2 border-t-0 border-black bg-black">
            <div className="flex flex-col sm:flex-row gap-0 border-b-2 border-gray-800">
              <div className="flex-1 p-4">
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Target Trade</label>
                <select
                  className="w-full bg-gray-900 border border-gray-700 px-3 py-2 font-black text-white text-xs focus:outline-none focus:border-[#0057FF] transition-colors"
                  style={{ fontFamily: MONO }}
                  value={bulkTrade}
                  onChange={e => setBulkTrade(e.target.value as Trade)}
                >
                  {Object.values(Trade).map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div className="flex items-end p-4">
                <button
                  onClick={() => setBulkText(FORMAT_EXAMPLE)}
                  className="px-5 py-2 bg-gray-800 hover:bg-gray-700 text-white font-black text-[10px] uppercase tracking-widest border border-gray-700 transition-colors"
                >
                  Load Example
                </button>
              </div>
            </div>

            <div className="p-4">
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">
                Paste Questions Here
                {bulkText.length > 0 && (
                  <span className="ml-2 text-gray-600 normal-case font-normal">{bulkText.length} chars</span>
                )}
              </label>
              <textarea
                className="w-full h-72 bg-gray-950 border border-gray-700 px-4 py-3 font-mono text-sm text-gray-200 placeholder-gray-700 focus:outline-none focus:border-[#0057FF] transition-colors resize-y"
                placeholder={`Paste your questions here...\n\n1. Question text?\nA. Option one\nB. Option two\nANS: B`}
                value={bulkText}
                onChange={e => { setBulkText(e.target.value); setParseError(''); }}
              />
            </div>

            {parseError && (
              <div className="mx-4 mb-4 border border-red-500 bg-red-900/20 text-red-400 px-4 py-3 text-xs font-bold flex items-center gap-3">
                <span className="w-2 h-2 bg-red-500 flex-shrink-0" />
                {parseError}
              </div>
            )}

            {parsed.length === 0 && (
              <div className="p-4 pt-0">
                <button
                  onClick={handleParse}
                  disabled={isParsing || !bulkText.trim()}
                  className={`w-full py-4 font-black text-sm uppercase tracking-widest border-2 transition-colors ${
                    isParsing ? 'bg-gray-800 border-gray-700 text-gray-500 cursor-wait'
                    : 'bg-[#0057FF] border-[#0057FF] text-white hover:bg-white hover:text-black'
                  } disabled:opacity-40 disabled:cursor-not-allowed`}
                  style={{ fontFamily: MONO }}
                >
                  {isParsing ? (
                    <span className="flex items-center justify-center gap-3">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white animate-spin" />
                      Parsing questions...
                    </span>
                  ) : '⚡ Parse Questions →'}
                </button>
              </div>
            )}
          </div>

          {/* Preview */}
          {parsed.length > 0 && (
            <div className="space-y-0">
              {/* Summary bar */}
              <div className="border-2 border-t-0 border-black flex flex-wrap items-center justify-between px-6 py-4 gap-4">
                <div className="flex gap-0">
                  {[
                    { label: 'Parsed', val: parsed.length, color: 'text-black' },
                    ...(syncedCount > 0 ? [{ label: 'Saved', val: syncedCount, color: 'text-[#0057FF]' }] : []),
                    ...(reviewCount > 0 ? [{ label: 'Review', val: reviewCount, color: 'text-yellow-600' }] : []),
                    ...(errorCount > 0 ? [{ label: 'Failed', val: errorCount, color: 'text-red-600' }] : []),
                  ].map((s, i) => (
                    <div key={s.label} className={`px-6 py-2 text-center ${i > 0 ? 'border-l-2 border-black' : ''}`}>
                      <p className={`text-2xl font-black ${s.color}`}>{s.val}</p>
                      <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{s.label}</p>
                    </div>
                  ))}
                </div>
                <div className="flex gap-0">
                  <button
                    onClick={() => { setParsed([]); setBulkText(''); }}
                    className="px-5 py-3 bg-white text-black font-black text-[10px] uppercase tracking-widest border-2 border-black hover:bg-black hover:text-white transition-colors"
                  >
                    ✕ Clear
                  </button>
                  {pendingCount > 0 && (
                    <button
                      onClick={handleSync}
                      disabled={isSyncing}
                      className={`px-6 py-3 font-black text-[10px] uppercase tracking-widest border-2 border-l-0 transition-colors ${
                        isSyncing
                          ? 'bg-gray-400 border-gray-400 text-white cursor-wait'
                          : 'bg-[#0057FF] border-[#0057FF] text-white hover:bg-black hover:border-black'
                      }`}
                    >
                      {isSyncing ? `Saving ${syncProgress}%...` : `💾 Save ${pendingCount} to Database`}
                    </button>
                  )}
                </div>
              </div>

              {/* Sync progress */}
              {isSyncing && (
                <div className="border-2 border-t-0 border-black p-3">
                  <div className="w-full h-2 bg-gray-100 border border-black">
                    <div className="h-full bg-[#0057FF] transition-all duration-300" style={{ width: `${syncProgress}%` }} />
                  </div>
                </div>
              )}

              {reviewCount > 0 && (
                <div className="border-2 border-t-0 border-yellow-600 bg-yellow-50 px-6 py-4 flex items-start gap-3">
                  <span className="w-2 h-2 bg-yellow-500 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-black text-xs uppercase tracking-widest text-yellow-700">
                      {reviewCount} question(s) need your attention
                    </p>
                    <p className="text-xs text-yellow-600 mt-1">
                      No answer marker detected. Click the correct option below before saving.
                    </p>
                  </div>
                </div>
              )}

              {/* Question cards */}
              <div>
                {parsed.map((q, idx) => (
                  <div
                    key={idx}
                    className={`border-2 border-t-0 border-black ${
                      q._status === 'synced' ? 'opacity-60 bg-gray-50'
                      : q._status === 'error' ? 'bg-red-50'
                      : q._issues?.length ? 'bg-yellow-50'
                      : 'bg-white'
                    }`}
                  >
                    {/* Card header */}
                    <div className="flex items-start justify-between gap-4 px-6 py-4 border-b border-black">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="w-7 h-7 border-2 border-[#0057FF] text-[#0057FF] flex items-center justify-center font-black text-xs">{idx + 1}</span>
                        <DiffBadge d={q.difficulty} />
                        {q._status === 'synced' && (
                          <span className="text-[9px] font-black text-[#0057FF] border border-[#0057FF] px-2 py-0.5 uppercase tracking-widest">✓ Saved</span>
                        )}
                        {q._status === 'error' && (
                          <span className="text-[9px] font-black text-red-600 border border-red-500 px-2 py-0.5 uppercase tracking-widest">✗ Failed</span>
                        )}
                        {q._issues && q._issues.length > 0 && (
                          <span className="text-[9px] font-black text-yellow-700 border border-yellow-500 px-2 py-0.5 uppercase tracking-widest">⚠ Review</span>
                        )}
                      </div>
                      {q._status === 'pending' && (
                        <button onClick={() => removeItem(idx)} className="text-gray-300 hover:text-red-500 font-black text-sm transition-colors">✕</button>
                      )}
                    </div>

                    {/* Question text */}
                    <div className="px-6 py-4 border-b border-black">
                      <p className="font-bold text-sm leading-relaxed">{q.text}</p>
                    </div>

                    {/* Options */}
                    <div className="grid grid-cols-1 sm:grid-cols-2">
                      {q.options.map((opt, oi) => (
                        <div
                          key={opt.id}
                          className={`flex items-center gap-3 px-5 py-3 cursor-pointer transition-colors border-b border-r-0 sm:border-r border-black text-sm ${
                            opt.id === q.correctAnswer
                              ? 'bg-[#EEF3FF] border-[#0057FF] font-black text-[#0057FF]'
                              : 'bg-white text-gray-600 hover:bg-gray-50 font-bold'
                          } ${oi % 2 !== 0 ? 'sm:border-r-0' : ''}`}
                          onClick={() => q._status === 'pending' && updateField(idx, 'correctAnswer', opt.id)}
                        >
                          <span className={`w-6 h-6 border flex items-center justify-center text-xs font-black flex-shrink-0 ${opt.id === q.correctAnswer ? 'bg-[#0057FF] border-[#0057FF] text-white' : 'border-black text-black'}`}>
                            {opt.id}
                          </span>
                          {opt.text}
                        </div>
                      ))}
                    </div>

                    {q._issues && q._issues.length > 0 && q._status === 'pending' && (
                      <div className="px-6 py-3 bg-yellow-50 border-t border-yellow-300 text-xs text-yellow-700">
                        <span className="font-black">👆 Click the correct answer above</span> to mark it before saving.
                        Issues: {q._issues.join(', ')}
                      </div>
                    )}

                    {/* Explanation */}
                    <div className="px-6 py-4 bg-gray-50 border-t border-black">
                      <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2">Explanation</p>
                      {q._status === 'pending' ? (
                        <textarea
                          className="w-full text-xs text-gray-600 bg-transparent resize-none outline-none leading-relaxed min-h-[48px] border-none"
                          style={{ fontFamily: MONO }}
                          value={q.explanation}
                          onChange={e => updateField(idx, 'explanation', e.target.value)}
                          placeholder="Add an explanation..."
                        />
                      ) : (
                        <p className="text-xs text-gray-500 leading-relaxed">{q.explanation}</p>
                      )}
                    </div>

                    {/* Difficulty selector */}
                    {q._status === 'pending' && (
                      <div className="flex items-center gap-0 border-t border-black">
                        <p className="px-4 py-2 text-[9px] font-black text-gray-400 uppercase tracking-widest border-r border-black">Difficulty:</p>
                        {(['Easy', 'Medium', 'Hard'] as const).map((d, di) => (
                          <button
                            key={d}
                            onClick={() => updateField(idx, 'difficulty', d)}
                            className={`px-4 py-2 text-[9px] font-black uppercase tracking-widest transition-colors ${di < 2 ? 'border-r border-black' : ''} ${
                              q.difficulty === d
                                ? d === 'Easy' ? 'bg-[#0057FF] text-white'
                                  : d === 'Medium' ? 'bg-yellow-500 text-white'
                                  : 'bg-black text-white'
                                : 'bg-white text-gray-400 hover:bg-gray-100'
                            }`}
                          >
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