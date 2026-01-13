
import { Question } from '../types';

const API_BASE_URL = 'http://localhost:5000/api';

export const apiService = {
  async fetchQuestions(): Promise<Question[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/questions`);
      if (!response.ok) throw new Error('Failed to fetch from backend');
      const data = await response.json();
      // Map MongoDB _id to frontend id
      return data.map((q: any) => ({ ...q, id: q._id }));
    } catch (error) {
      console.warn('Backend unreachable, using sample data.', error);
      throw error;
    }
  },

  async saveQuestion(question: Omit<Question, 'id'>): Promise<Question> {
    const response = await fetch(`${API_BASE_URL}/questions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(question),
    });
    if (!response.ok) throw new Error('Failed to save question');
    const data = await response.json();
    return { ...data, id: data._id };
  },

  async deleteQuestion(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/questions/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete question');
  }
};
