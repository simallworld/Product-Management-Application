import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { AuthState, LoginCredentials, RegisterCredentials, User, AuthResponse, DummyJsonLoginResponse } from '../../types/auth';
import { authApi } from '../../services/api';

// Initial state
const initialState: AuthState = {
  user: null,
  token: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

// Check for existing token on app load
const storedToken = localStorage.getItem('token');
const storedUser = localStorage.getItem('user');
const storedRefreshToken = localStorage.getItem('refreshToken');

if (storedToken && storedUser) {
  initialState.token = storedToken;
  initialState.user = JSON.parse(storedUser);
  initialState.refreshToken = storedRefreshToken;
  initialState.isAuthenticated = true;
}

// Login async thunk
export const login = createAsyncThunk<
  AuthResponse,
  LoginCredentials,
  { rejectValue: string }
>(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      // Use email as username for dummyjson API
      const username = credentials.email.split('@')[0]; // Extract username from email
      
      const response = (await authApi.login(username, credentials.password)) as DummyJsonLoginResponse;

      // Transform dummyjson response to our format
      const user: User = {
        id: response.id,
        username: response.username,
        firstName: response.firstName,
        lastName: response.lastName,
        email: response.email,
        gender: response.gender,
        image: response.image,
      };

      const authResponse: AuthResponse = {
        user,
        token: response.accessToken,
        refreshToken: response.refreshToken,
      };

      // Store tokens in localStorage for persistence
      localStorage.setItem('token', authResponse.token);
      localStorage.setItem('user', JSON.stringify(authResponse.user));
      if (authResponse.refreshToken) {
        localStorage.setItem('refreshToken', authResponse.refreshToken);
      }

      return authResponse;
    } catch (error) {
      let errorMessage = 'Login failed';

      if (error instanceof Error) {
        // Handle specific error messages
        if (error.message.includes('401')) {
          errorMessage = 'Invalid username or password';
        } else if (error.message.includes('Network')) {
          errorMessage = 'Network error. Please check your connection';
        } else if (error.message.includes('timeout')) {
          errorMessage = 'Request timeout. Please try again';
        } else {
          errorMessage = error.message;
        }
      }

      return rejectWithValue(errorMessage);
    }
  }
);

// Register async thunk (not supported by dummyjson, but kept for future use)
export const register = createAsyncThunk<
  AuthResponse,
  RegisterCredentials,
  { rejectValue: string }
>(
  'auth/register',
  async (credentials, { rejectWithValue }) => {
    try {
      // DummyJSON doesn't have a register endpoint, so we return a mock response
      // In a real app, this would call your backend API
      
      const mockUser: User = {
        id: Math.floor(Math.random() * 1000),
        firstName: credentials.firstName,
        lastName: credentials.lastName,
        email: credentials.email,
      };

      const mockResponse: AuthResponse = {
        user: mockUser,
        token: 'mock-token-' + Date.now(),
      };

      localStorage.setItem('token', mockResponse.token);
      localStorage.setItem('user', JSON.stringify(mockResponse.user));

      return mockResponse;
    } catch {
      return rejectWithValue('Registration failed');
    }
  }
);

// Logout async thunk
export const logout = createAsyncThunk<void, void, { rejectValue: string }>(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('refreshToken');
    } catch (error) {
      const err = error as Error;
      return rejectWithValue(err.message || 'Logout failed');
    }
  }
);

// Auth slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCredentials: (
      state,
      action: PayloadAction<{ user: User; token: string; refreshToken?: string }>
    ) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.refreshToken = action.payload.refreshToken;
      state.isAuthenticated = true;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login cases
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.refreshToken = action.payload.refreshToken;
        state.isAuthenticated = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Login failed';
      })
      // Register cases
      .addCase(register.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Registration failed';
      })
      // Logout cases
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.refreshToken = null;
        state.isAuthenticated = false;
        state.error = null;
      });
  },
});

export const { clearError, setCredentials } = authSlice.actions;
export default authSlice.reducer;
