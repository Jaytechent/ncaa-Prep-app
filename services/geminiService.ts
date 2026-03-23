import { GoogleGenAI, Type } from "@google/genai";
import { Trade } from "../types";

// ─── CONFIG ───────────────────────────────────────────────────────────────────
const API_BASE_URL = 'http://localhost:5000/api';

function getToken(): string {
  return localStorage.getItem('ncaa_auth_token') || '';
}

// ─── LOGGING ──────────────────────────────────────────────────────────────────
const log = {
  info:    (tag: string, msg: string, data?: any) => console.log(`%c[GeminiService | ${tag}] ${msg}`,    'color:#3b82f6;font-weight:bold;', data ?? ''),
  success: (tag: string, msg: string, data?: any) => console.log(`%c[GeminiService | ${tag}] ✅ ${msg}`, 'color:#22c55e;font-weight:bold;', data ?? ''),
  warn:    (tag: string, msg: string, data?: any) => console.warn(`%c[GeminiService | ${tag}] ⚠️  ${msg}`,'color:#f59e0b;font-weight:bold;', data ?? ''),
  error:   (tag: string, msg: string, data?: any) => console.error(`%c[GeminiService | ${tag}] ❌ ${msg}`,'color:#ef4444;font-weight:bold;', data ?? ''),
};

// ─── SERVICE ──────────────────────────────────────────────────────────────────
export class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    const apiKey = process.env.API_KEY || process.env.GEMINI_API_KEY || '';
    this.ai = new GoogleGenAI({ apiKey });
    if (!apiKey) {
      log.warn('Init', 'No client-side Gemini key — explanation generation disabled. Parsing works via backend.');
    }
  }

  // ── Parse pasted text via backend (pure JS, no AI, always works) ──────────
  async parseBulkText(rawText: string, targetTrade: Trade): Promise<any[]> {
    const TAG = 'parseBulkText';
    log.info(TAG, `Sending ${rawText.length} chars to backend → /api/parse/text`);

    const res = await fetch(`${API_BASE_URL}/parse/text`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`,
      },
      body: JSON.stringify({ rawText, trade: targetTrade }),
    });

    const data = await res.json();

    if (!res.ok) {
      log.error(TAG, `Backend error ${res.status}`, data);
      throw new Error(data.message || `Server error ${res.status}`);
    }

    log.success(TAG, `Parsed: ${data.stats.valid} valid, ${data.stats.needsReview} need review, ${data.stats.skipped} skipped`, data.stats);

    if (data.stats.skipped > 0) {
      log.warn(TAG, 'Skipped blocks:', data.stats.skippedDetails);
    }

    if (data.needsReview?.length > 0) {
      log.warn(TAG, `${data.needsReview.length} questions need review (no answer marker found):`, data.needsReview.map((q: any) => q.text?.slice(0, 60)));
    }

    // Return valid + needsReview together so admin can see all and decide
    return [...(data.questions || []), ...(data.needsReview || [])];
  }

  // ── Legacy alias ──────────────────────────────────────────────────────────
  async parseBulkQuestions(rawText: string, targetTrade: Trade): Promise<any[]> {
    return this.parseBulkText(rawText, targetTrade);
  }

  // ── File parsing is no longer supported — advise copy-paste ──────────────
  async parseFileContent(_base64: string, _mime: string, _trade: Trade): Promise<any[]> {
    const TAG = 'parseFileContent';
    log.warn(TAG, 'File upload is disabled. Please copy-paste your questions instead.');
    throw new Error('File upload is currently disabled. Please copy the text from your document and paste it in the text box.');
  }

  // ── Single explanation (client-side, lightweight) ─────────────────────────
  async generateExplanation(question: string, correctAnswer: string): Promise<string> {
    const TAG = 'generateExplanation';
    try {
      log.info(TAG, `Generating explanation for answer "${correctAnswer}"...`);
      const response = await this.ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Provide a professional, concise aviation-focused explanation for why "${correctAnswer}" is the correct answer to: "${question}". Include relevant ICAO/NCAA regulatory references. Keep under 3 sentences.`,
      });
      const text = response.text || 'No explanation available.';
      log.success(TAG, 'Done');
      return text;
    } catch (error: any) {
      log.error(TAG, 'Failed', { message: error?.message });
      return 'Explanation unavailable.';
    }
  }

  // ── Quality check (client-side, lightweight) ──────────────────────────────
  async checkQuestionQuality(question: string): Promise<{ score: number; feedback: string }> {
    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Evaluate this aviation quiz question for accuracy and clarity: "${question}". Return JSON with score (0-100) and feedback.`,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              score:    { type: Type.NUMBER, description: 'Quality score 0-100' },
              feedback: { type: Type.STRING, description: 'Constructive feedback' },
            },
            required: ['score', 'feedback'],
          },
        },
      });
      return JSON.parse(response.text || '{"score":0,"feedback":"Failed"}');
    } catch {
      return { score: 0, feedback: 'Quality check unavailable.' };
    }
  }
}

export const geminiService = new GeminiService();