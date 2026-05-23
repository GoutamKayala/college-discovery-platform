import { College, User, SavedComparison, PredictionResult, ChatMessage } from '../types';

let authToken: string | null = localStorage.getItem('edupath_token');
let cachedUser: User | null = null;
try {
  const savedUser = localStorage.getItem('edupath_user');
  if (savedUser) cachedUser = JSON.parse(savedUser);
} catch (e) {
  console.error('Error parsing cached user', e);
}

// Function to set credentials
export function setCredentials(token: string, user: User) {
  authToken = token;
  cachedUser = user;
  localStorage.setItem('edupath_token', token);
  localStorage.setItem('edupath_user', JSON.stringify(user));
}

// Function to clear credentials
export function clearCredentials() {
  authToken = null;
  cachedUser = null;
  localStorage.removeItem('edupath_token');
  localStorage.removeItem('edupath_user');
}

export function getActiveToken() {
  return authToken;
}

export function getActiveUser() {
  return cachedUser;
}

// Global fetch wrapper with Token injection
async function apiRequest<T>(url: string, options: RequestInit = {}): Promise<T> {
  const headers = new Headers(options.headers || {});
  if (authToken) {
    headers.set('Authorization', `Bearer ${authToken}`);
  }
  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetch(url, { ...options, headers });
  
  if (!response.ok) {
    let errorMessage = `HTTP Error ${response.status}`;
    try {
      const errBody = await response.json();
      if (errBody && errBody.error) errorMessage = errBody.error;
    } catch (e) {
      // Non-JSON or error parsing failure
    }
    throw new Error(errorMessage);
  }

  return response.json() as Promise<T>;
}

export const api = {
  // Authentication
  async register(name: string, email: string, password: string): Promise<{ token: string; user: User }> {
    const res = await apiRequest<{ token: string; user: User }>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    });
    setCredentials(res.token, res.user);
    return res;
  },

  async login(email: string, password: string): Promise<{ token: string; user: User }> {
    const res = await apiRequest<{ token: string; user: User }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    setCredentials(res.token, res.user);
    return res;
  },

  async verifyMe(): Promise<User> {
    const res = await apiRequest<{ user: User }>('/api/auth/me');
    setCredentials(authToken || '', res.user);
    return res.user;
  },

  // Colleges queries
  async getColleges(params: {
    q?: string;
    location?: string;
    course?: string;
    minFees?: number;
    maxFees?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    collegeType?: string;
    exam?: string;
  } = {}): Promise<College[]> {
    const query = new URLSearchParams();
    if (params.q) query.set('q', params.q);
    if (params.location && params.location !== 'All') query.set('location', params.location);
    if (params.course && params.course !== 'All') query.set('course', params.course);
    if (params.minFees !== undefined) query.set('minFees', String(params.minFees));
    if (params.maxFees !== undefined) query.set('maxFees', String(params.maxFees));
    if (params.sortBy) query.set('sortBy', params.sortBy);
    if (params.sortOrder) query.set('sortOrder', params.sortOrder);
    if (params.collegeType && params.collegeType !== 'All') query.set('collegeType', params.collegeType);
    if (params.exam && params.exam !== 'All') query.set('exam', params.exam);

    return apiRequest<College[]>(`/api/colleges?${query.toString()}`);
  },

  async getCollegeById(id: string): Promise<College> {
    return apiRequest<College>(`/api/colleges/${id}`);
  },

  async submitReview(collegeId: string, userName: string, rating: number, comment: string): Promise<any> {
    return apiRequest<any>(`/api/colleges/${collegeId}/review`, {
      method: 'POST',
      body: JSON.stringify({ userName, rating, comment }),
    });
  },

  // Saves actions
  async toggleSaveCollege(collegeId: string, unsave = false): Promise<any> {
    return apiRequest<any>('/api/save-college', {
      method: 'POST',
      body: JSON.stringify({ collegeId, unsave }),
    });
  },

  async getSavedColleges(): Promise<College[]> {
    return apiRequest<College[]>('/api/save-college');
  },

  // Comparisons actions
  async saveComparison(collegeIds: string[]): Promise<any> {
    return apiRequest<any>('/api/save-comparison', {
      method: 'POST',
      body: JSON.stringify({ collegeIds }),
    });
  },

  async getSavedComparisons(): Promise<SavedComparison[]> {
    return apiRequest<SavedComparison[]>('/api/comparisons');
  },

  async deleteComparison(id: string): Promise<any> {
    return apiRequest<any>(`/api/comparisons/${id}`, {
      method: 'DELETE',
    });
  },

  // Predictor tool
  async predictColleges(exam: string, rank: number): Promise<PredictionResult[]> {
    return apiRequest<PredictionResult[]>('/api/predictor', {
      method: 'POST',
      body: JSON.stringify({ exam, rank }),
    });
  },

  // Gemini Educational Counselor Chat
  async askCounselor(messages: { role: 'user' | 'assistant'; content: string }[]): Promise<{ reply: string }> {
    return apiRequest<{ reply: string }>('/api/ai/chat', {
      method: 'POST',
      body: JSON.stringify({ messages }),
    });
  },
};
