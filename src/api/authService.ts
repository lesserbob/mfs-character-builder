import axios from 'axios';

// Use environment variable for API calls to the backend
const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'https://localhost:3443/api';

interface LoginRequest {
  username: string;
  password: string;
}

interface RegisterRequest {
  username: string;
  password: string;
}

interface ResetPasswordRequest {
  username: string;
  password: string;
}

interface AuthResponse {
  message: string;
  token: string;
  user: {
    id: number;
    username: string;
  };
}

interface UserResponse {
  user: {
    id: number;
    username: string;
    type: string;
  };
}

export const authService = {
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/auth/login`,
        credentials
      );
      return response.data;
    } catch (error: any) {
      console.error('Login error:', error.response?.data || error.message);
      throw error;
    }
  },

  async register(credentials: RegisterRequest): Promise<AuthResponse> {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/auth/register`,
        credentials
      );
      return response.data;
    } catch (error: any) {
      console.error('Register error:', error.response?.data || error.message);
      throw error;
    }
  },

  async getCurrentUser(token: string): Promise<UserResponse> {
    try {
      const response = await axios.get(`${API_BASE_URL}/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error: any) {
      console.error(
        'Get current user error:',
        error.response?.data || error.message
      );
      throw error;
    }
  },

  async setPassword(
    credentials: ResetPasswordRequest,
    token: string
  ): Promise<any> {
    try {
      await axios.post(`${API_BASE_URL}/auth/resetPassword`, credentials, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error: any) {
      console.error(
        'Reset password error:',
        error.response?.data || error.message
      );
      throw error;
    }
  },
};
