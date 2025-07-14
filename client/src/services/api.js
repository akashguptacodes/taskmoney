const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

class ApiService {
  constructor() {
    this.token = localStorage.getItem('authToken');
  }

  getHeaders() {
    const headers = {
      'Content-Type': 'application/json',
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    return headers;
  }

  async handleResponse(response) {
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'An error occurred');
    }
    return response.json();
  }

  // Authentication methods
  async register(name, email, password) {
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

  async login(email, password) {
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
  async getUsers() {
    const response = await fetch(`${API_BASE_URL}/users`, {
      headers: this.getHeaders(),
    });

    return this.handleResponse(response);
  }

  async getUserById(id) {
    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
      headers: this.getHeaders(),
    });

    return this.handleResponse(response);
  }

  async createUser(name, email, password) {
    const response = await fetch(`${API_BASE_URL}/users`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ name, email, password }),
    });

    return this.handleResponse(response);
  }

  // Points methods
  async claimPoints(userId) {
    const response = await fetch(`${API_BASE_URL}/points/claim`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ userId }),
    });

    return this.handleResponse(response);
  }

  async getPointHistory(limit = 50, page = 1) {
    const response = await fetch(
      `${API_BASE_URL}/points/history?limit=${limit}&page=${page}`,
      {
        headers: this.getHeaders(),
      }
    );

    return this.handleResponse(response);
  }

  async getUserPointHistory(userId, limit = 20, page = 1) {
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
  isAuthenticated() {
    return !!this.token;
  }

  getToken() {
    return this.token;
  }
}

export const apiService = new ApiService();