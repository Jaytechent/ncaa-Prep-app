
import { GoogleGenAI, Type } from "@google/genai";
import { Trade } from "../types";

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

  async parseBulkQuestions(rawText: string, targetTrade: Trade): Promise<any[]> {
    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: `I have the following raw text containing aviation quiz questions for ${targetTrade}:
        
        "${rawText}"
        
        Parse these into a JSON array. Each object must have:
        - "text": The question string.
        - "options": Array of 4 objects with "id" (A, B, C, D) and "text".
        - "correctAnswer": The letter of the correct option.
        - "explanation": A technical explanation for the answer.
        - "difficulty": One of "Easy", "Medium", "Hard".
        
        Ensure strictly valid JSON.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                text: { type: Type.STRING },
                options: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      id: { type: Type.STRING },
                      text: { type: Type.STRING }
                    },
                    required: ['id', 'text']
                  }
                },
                correctAnswer: { type: Type.STRING },
                explanation: { type: Type.STRING },
                difficulty: { type: Type.STRING }
              },
              required: ['text', 'options', 'correctAnswer', 'explanation', 'difficulty']
            }
          }
        }
      });
      return JSON.parse(response.text || '[]');
    } catch (error) {
      console.error("Bulk Parse Error:", error);
      throw new Error("AI failed to parse text. Check format.");
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
