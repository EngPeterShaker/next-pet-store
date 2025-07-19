'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { LoginFormData, RegisterFormData, loginSchema, registerSchema } from '@/lib/validations/auth';
import { FormInput } from '@/components/ui/form-input';
import { axiosInstance } from '@/lib/axiosInstance';

export default function LoginPage() {
  const [error, setError] = useState('');
  const [showRegister, setShowRegister] = useState(false);
  const [registerSuccess, setRegisterSuccess] = useState('');
  const router = useRouter();

  const { 
    register: loginRegister, 
    handleSubmit: handleLoginSubmit,
    formState: { errors: loginErrors }
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema)
  });

  const {
    register: registerRegister,
    handleSubmit: handleRegisterSubmit,
    formState: { errors: registerErrors },
    reset: resetRegisterForm
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema)
  });

  const onLogin = async (data: LoginFormData) => {
    setError('');
    try {
      const response = await axiosInstance.get('/user/login', {
        params: data
      });
      localStorage.setItem('token', 'demo-token');
      router.push('/');
    } catch (err: any) {
      setError('Login failed: ' + (err.response?.data?.message || err.message));
    }
  };

  const onRegister = async (data: RegisterFormData) => {
    setError('');
    setRegisterSuccess('');
    try {
      const payload = {
        id: 0,
        ...data,
        userStatus: 0,
      };
      await axiosInstance.post('/user', payload);
      setRegisterSuccess('Account created! You can now log in.');
      setShowRegister(false);
      resetRegisterForm();
    } catch (err: any) {
      setError('Registration failed: ' + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="w-full max-w-md">
        <h1 className="text-4xl font-bold mb-8 text-center">
          {showRegister ? 'Create Account' : 'Login'}
        </h1>
        
        {registerSuccess && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            {registerSuccess}
          </div>
        )}
        
        {showRegister ? (
          <form onSubmit={handleRegisterSubmit(onRegister)} className="space-y-4">
            <FormInput
              type="text"
              placeholder="Username"
              registration={registerRegister('username')}
              error={registerErrors.username?.message}
            />
            <FormInput
              type="text"
              placeholder="First Name"
              registration={registerRegister('firstName')}
              error={registerErrors.firstName?.message}
            />
            <FormInput
              type="text"
              placeholder="Last Name"
              registration={registerRegister('lastName')}
              error={registerErrors.lastName?.message}
            />
            <FormInput
              type="email"
              placeholder="Email"
              registration={registerRegister('email')}
              error={registerErrors.email?.message}
            />
            <FormInput
              type="password"
              placeholder="Password"
              registration={registerRegister('password')}
              error={registerErrors.password?.message}
            />
            <FormInput
              type="tel"
              placeholder="Phone"
              registration={registerRegister('phone')}
              error={registerErrors.phone?.message}
            />
            <button 
              type="submit" 
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Create Account
            </button>
            <button 
              type="button" 
              onClick={() => setShowRegister(false)}
              className="w-full bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Back to Login
            </button>
          </form>
        ) : (
          <form onSubmit={handleLoginSubmit(onLogin)} className="space-y-4">
            <FormInput
              type="text"
              placeholder="Username"
              registration={loginRegister('username')}
              error={loginErrors.username?.message}
            />
            <FormInput
              type="password"
              placeholder="Password"
              registration={loginRegister('password')}
              error={loginErrors.password?.message}
            />
            <button 
              type="submit" 
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Login
            </button>
            <button 
              type="button" 
              onClick={() => setShowRegister(true)}
              className="w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              Create Account
            </button>
          </form>
        )}
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mt-4">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}
