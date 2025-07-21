// src/lib/api/auth.ts
import { api } from './axios';

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterData extends LoginCredentials {
  email?: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: number;
    username: string;
    email?: string;
  };
}

export const authApi = {
  // Login user
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    // Since the Petstore API doesn't have real auth, we'll simulate it
    // In a real app, this would be an actual API call
    const response = await api.get('/user/login', {
      params: credentials
    });
    
    // Simulate a token response
    return {
      token: btoa(`${credentials.username}:${credentials.password}`),
      user: {
        id: Date.now(),
        username: credentials.username,
      }
    };
  },

  // Register new user
  register: async (data: RegisterData): Promise<AuthResponse> => {
    // Since the Petstore API doesn't have real registration, we'll simulate it
    const response = await api.post('/user', {
      username: data.username,
      password: data.password,
      email: data.email,
    });
    
    // Simulate a token response
    return {
      token: btoa(`${data.username}:${data.password}`),
      user: {
        id: Date.now(),
        username: data.username,
        email: data.email,
      }
    };
  },

  // Logout user
  logout: async (): Promise<void> => {
    // In a real app, this might invalidate the token on the server
    await api.get('/user/logout');
  },

  // Get current user
  getCurrentUser: async (): Promise<AuthResponse['user']> => {
    // In a real app, this would fetch the current user from the server
    const token = localStorage.getItem('auth_token');
    if (!token) {
      throw new Error('Not authenticated');
    }
    
    // Decode the token to get username (this is just for demo)
    const decoded = atob(token);
    const [username] = decoded.split(':');
    
    return {
      id: Date.now(),
      username,
    };
  },
};
