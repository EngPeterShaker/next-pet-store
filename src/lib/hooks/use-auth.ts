// src/lib/hooks/use-auth.ts
import { useMutation, useQuery } from '@tanstack/react-query';
import { authApi, LoginCredentials, RegisterData, AuthResponse } from '../api/auth';

// Hook for login
export function useLogin() {
  return useMutation<AuthResponse, Error, LoginCredentials>({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      // Store token in localStorage or apply any side-effects
      localStorage.setItem('auth_token', data.token);
      console.log('Logged in successfully!');
    },
    onError: (error) => {
      console.error('Login failed:', error);
    }
  });
}

// Hook for registration
export function useRegister() {
  return useMutation<AuthResponse, Error, RegisterData>({
    mutationFn: authApi.register,
    onSuccess: (data) => {
      localStorage.setItem('auth_token', data.token);
      console.log('Registered successfully!');
    },
    onError: (error) => {
      console.error('Registration failed:', error);
    }
  });
}

// Hook for getting current user
export function useCurrentUser() {
  return useQuery<AuthResponse['user'], Error>({
    queryKey: ['current-user'],
    queryFn: authApi.getCurrentUser,
    staleTime: Infinity,
    gcTime: Infinity, // gcTime replaces cacheTime in v5
  });
}

