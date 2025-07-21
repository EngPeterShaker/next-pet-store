'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { LoginFormData, RegisterFormData, loginSchema, registerSchema } from '@/lib/validations/auth';
import { FormInput } from '@/components/ui/form-input';
import { useLogin, useRegister } from '@/lib/hooks/use-auth';
import { LogIn, UserPlus, ArrowLeft, Loader2 } from 'lucide-react';
import { useUser } from '@/contexts/UserContext';
import { useToast } from '@/components/ui/use-toast';

export default function LoginPage() {
  const [showRegister, setShowRegister] = useState(false);
  const router = useRouter();
  const { setUser } = useUser();
  const { toast } = useToast();

  // React Query hooks
  const { mutate: login, isPending: isLoginPending } = useLogin();
  const { mutate: register, isPending: isRegisterPending } = useRegister();

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
    formState: { errors: registerErrors }
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema)
  });

  const onLogin = (data: LoginFormData) => {
    login(data, {
      onSuccess: (response) => {
        // Set user in context
        const mockUser = {
          username: data.username,
          firstName: 'peter',
          lastName: 'shaker',
          email: 'peter.shaker@example.com'
        };
        setUser(mockUser);

        toast({
          title: 'Welcome back!',
          description: `Logged in as ${response.user.username}`,
        });

        router.push('/');
      },
      onError: (error) => {
        toast({
          variant: 'destructive',
          title: 'Login failed',
          description: error.message || 'Invalid credentials',
        });
      }
    });
  };

  const onRegister = (data: RegisterFormData) => {
    const payload = {
      ...data,
      email: data.email || undefined,
    };

    register(payload, {
      onSuccess: () => {
        // Store user data in context
        const userData = {
          username: data.username,
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email
        };
        setUser(userData);

        toast({
          title: 'Account created!',
          description: 'Welcome to LovePets!',
        });
        
        // Redirect to home page
        router.push('/');
      },
      onError: (error) => {
        toast({
          variant: 'destructive',
          title: 'Registration failed',
          description: error.message || 'Could not create account',
        });
      }
    });
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="w-full max-w-md">
        <h1 className="text-4xl font-bold mb-8 text-center">
          {showRegister ? 'Create Account' : 'Welcome to LovePets'}
        </h1>


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
              disabled={isRegisterPending}
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isRegisterPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Account...
                </>
              ) : (
                <>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Create Account
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => setShowRegister(false)}
              className="w-full bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 flex items-center justify-center"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
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
              disabled={isLoginPending}
              className="w-full bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoginPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Logging in...
                </>
              ) : (
                <>
                  <LogIn className="mr-2 h-4 w-4" />
                  Log in
                </>
              )}
            </button>
            <p className="text-center text-sm text-gray-500">
              New to LovePets?{" "}
              <button
                onClick={() => setShowRegister(true)}
                className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
              >
                <UserPlus className="mr-1 h-4 w-4" />
                <span>Create Account</span>
              </button>
            </p>
          </form>
        )}

      </div>
    </div>
  );
}
