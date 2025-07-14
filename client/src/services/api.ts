const API_BASE_URL = `${window.location.protocol}//${window.location.hostname}:5000/api`;

interface User {
  id: string;
  name: string;
  points: number;
  rank?: number;
  joinedAt?: string;
}

interface PointClaim {
  id: string;
  userName: string;
  points: number;
  claimedBy: string;
  timestamp: string;
  description?: string;
}

interface AuthResponse {
  message: string;
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    totalPoints: number;
  };
}

class ApiService {
  private token: string | null = null;

  constructor() {
    this.token = localStorage.getItem('authToken');
  }

  private getHeaders() {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    return headers;
  }

  private async handleResponse(response: Response) {
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'An error occurred');
    }
    return response.json();
  }

  // Authentication methods
  async register(name: string, email: string, password: string): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ name, email, password }),
    });

    const data = await this.handleResponse(response);
    this.token = data.token;
    localStorage.setItem('authToken', data.token);
    return data;
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ email, password }),
    });

    const data = await this.handleResponse(response);
    this.token = data.token;
    localStorage.setItem('authToken', data.token);
    return data;
  }

  async getCurrentUser() {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: this.getHeaders(),
    });

    return this.handleResponse(response);
  }

  logout() {
    this.token = null;
    localStorage.removeItem('authToken');
  }

  // User methods
  async getUsers(): Promise<{ users: User[] }> {
    const response = await fetch(`${API_BASE_URL}/users`, {
      headers: this.getHeaders(),
    });

    return this.handleResponse(response);
  }

  async getUserById(id: string): Promise<{ user: User }> {
    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
      headers: this.getHeaders(),
    });

    return this.handleResponse(response);
  }

  async createUser(name: string, email: string, password: string) {
    const response = await fetch(`${API_BASE_URL}/users`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ name, email, password }),
    });

    return this.handleResponse(response);
  }

  // Points methods
  async claimPoints(userId: string) {
    const response = await fetch(`${API_BASE_URL}/points/claim`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ userId }),
    });

    return this.handleResponse(response);
  }

  async getPointHistory(limit = 50, page = 1): Promise<{
    history: PointClaim[];
    pagination: {
      current: number;
      total: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
  }> {
    const response = await fetch(
      `${API_BASE_URL}/points/history?limit=${limit}&page=${page}`,
      {
        headers: this.getHeaders(),
      }
    );

    return this.handleResponse(response);
  }

  async getUserPointHistory(userId: string, limit = 20, page = 1) {
    const response = await fetch(
      `${API_BASE_URL}/points/history/${userId}?limit=${limit}&page=${page}`,
      {
        headers: this.getHeaders(),
      }
    );

    return this.handleResponse(response);
  }

  async getStats() {
    const response = await fetch(`${API_BASE_URL}/points/stats`, {
      headers: this.getHeaders(),
    });

    return this.handleResponse(response);
  }

  // Utility methods
  isAuthenticated(): boolean {
    return !!this.token;
  }

  getToken(): string | null {
    return this.token;
  }
}

export const apiService = new ApiService();
export type { User, PointClaim, AuthResponse };