import { Question } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const STORAGE_KEYS = {
  QUESTIONS: 'ncaa_offline_questions',
  TOKEN: 'ncaa_auth_token',
  USER: 'ncaa_user_data',
};  

export const apiService = {
  getToken(): string | null {
    return localStorage.getItem(STORAGE_KEYS.TOKEN);
  },

  setToken(token: string) {
    localStorage.setItem(STORAGE_KEYS.TOKEN, token);
  },

  clearAuth() {
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
  },

  async fetchQuestions(
    page = 1,
    limit = 200,
    trade?: string
  ): Promise<Question[]> {
    try {
      let url = `${API_BASE_URL}/questions?page=${page}&limit=${limit}`;
      if (trade) url += `&trade=${encodeURIComponent(trade)}`;

      const response = await fetch(url);
      if (!response.ok) throw new Error('Network response not ok');

      const data = await response.json();
      const questionsArray = Array.isArray(data)
        ? data
        : data.questions || [];

      const formatted: Question[] = questionsArray.map((q: any) => ({
        ...q,
        id: q._id || q.id,
      }));

      if (!trade) {
        localStorage.setItem(STORAGE_KEYS.QUESTIONS, JSON.stringify(formatted));
      }

      return formatted;
    } catch (error) {
      console.warn('Backend unreachable. Loading from offline cache...', error);
      const cached = localStorage.getItem(STORAGE_KEYS.QUESTIONS);
      if (cached) {
        const questions: Question[] = JSON.parse(cached);
        return trade ? questions.filter((q) => q.trade === trade) : questions;
      }
      return [];
    }
  },

  async login(credentials: { email: string; password: string }) {
    const response = await fetch(`${API_BASE_URL}/users/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.message || 'Login failed');
    }
    const data = await response.json();
    this.setToken(data.token);
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(data));
    return data;
  },

  async register(userData: {
    name: string;
    email: string;
    password: string;
  }) {
    const response = await fetch(`${API_BASE_URL}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.message || 'Registration failed');
    }
    const data = await response.json();
    this.setToken(data.token);
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(data));
    return data;
  },

  async updateStats(quizData: {
    trade: string;
    score: number;
    total: number;
  }) {
    const token = this.getToken();
    if (!token) return null;
    try {
      const response = await fetch(`${API_BASE_URL}/users/stats`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(quizData),
      });
      if (!response.ok) return null;
      return await response.json();
    } catch {
      console.warn('Could not sync stats to cloud.');
      return null;
    }
  },

  async saveQuestion(question: Omit<Question, 'id'>): Promise<Question> {
    const token = this.getToken();
    const response = await fetch(`${API_BASE_URL}/questions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(question),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to save question');
    }
    const data = await response.json();
    return { ...data, id: data._id };
  },

  async deleteQuestion(id: string): Promise<void> {
    const token = this.getToken();
    const response = await fetch(`${API_BASE_URL}/questions/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to delete question');
    }
  },
};