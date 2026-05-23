export interface Course {
  id: string;
  name: string;
  duration: string;
  fees: number;
}

export interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
}

export interface PredictorData {
  exam: string;
  minRank: number;
  maxRank: number;
}

export interface College {
  id: string;
  name: string;
  location: string;
  state: string;
  fees: number;
  rating: number;
  establishedYear: number;
  description: string;
  image: string;
  placementPercentage: number;
  averagePackage: number;
  courses: Course[];
  reviews: Review[];
  predictorData: PredictorData[];
  type?: 'Government' | 'Private' | 'Autonomous';
}

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface SavedComparison {
  id: string;
  collegeIds: string[];
  colleges: College[];
  savedAt: string;
}

export interface PredictionResult {
  college: College;
  cutoffMin: number;
  cutoffMax: number;
  probability: 'High' | 'Medium' | 'Low';
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  content: string;
  timestamp: string;
}

export interface QueryFilters {
  q: string;
  location: string;
  course: string;
  minFees: number;
  maxFees: number;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  collegeType: string;
  exam: string;
}
