
import { GoogleGenAI, Type } from "@google/genai";

export class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  }

  async generateExplanation(question: string, correctAnswer: string): Promise<string> {
    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Provide a professional, concise aviation-focused explanation for why "${correctAnswer}" is the correct answer to the following question: "${question}". Include relevant regulatory references (ICAO/NCAA) if applicable.`,
      });
      return response.text || "No explanation available.";
    } catch (error) {
      console.error("Gemini Error:", error);
      return "An error occurred while generating the explanation.";
    }
  }

  async checkQuestionQuality(question: string): Promise<{ score: number, feedback: string }> {
    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Evaluate this aviation quiz question for technical accuracy and clarity: "${question}". Return your response as JSON.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              score: { type: Type.NUMBER, description: 'Score out of 100' },
              feedback: { type: Type.STRING, description: 'Constructive feedback' }
            },
            required: ['score', 'feedback']
          }
        }
      });
      return JSON.parse(response.text || '{"score": 0, "feedback": "Failed to analyze"}');
    } catch (error) {
      return { score: 0, feedback: "AI analysis unavailable." };
    }
  }
}

export const geminiService = new GeminiService();
