import { useAppSelector, useAppDispatch } from '../store';
import { login, logout, register, clearError as clearAuthError } from '../store/slices/authSlice';
import type { LoginCredentials, RegisterCredentials } from '../types/auth';

// Custom hook for authentication operations
// Provides login, register, logout functions and auth state

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const authState = useAppSelector((state) => state.auth);

  const handleLogin = async (credentials: LoginCredentials) => {
    const result = await dispatch(login(credentials));
    return result;
  };

  const handleRegister = async (credentials: RegisterCredentials) => {
    const result = await dispatch(register(credentials));
    return result;
  };

  const handleLogout = async () => {
    await dispatch(logout());
  };

  const clearError = () => {
    dispatch(clearAuthError());
  };

  return {
    ...authState,
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout,
    clearError,
  };
};

// Hook to check if user is authenticated
export const useIsAuthenticated = () => {
  return useAppSelector((state) => state.auth.isAuthenticated);
};

// Hook to get current user
export const useCurrentUser = () => {
  return useAppSelector((state) => state.auth.user);
};
