'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, Mail, Lock, User, Sparkles, Zap, Trophy, Star, Rocket, Shield, Target } from 'lucide-react';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAuthStore } from '@/stores/authStore';

const registerSchema = z.object({
  firstName: z.string().min(1, 'First name is required').max(50),
  lastName: z.string().min(1, 'Last name is required').max(50),
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  agreeToTerms: z.boolean().refine((val) => val === true, {
    message: 'You must agree to the terms and conditions',
  }),
});

type RegisterForm = z.infer<typeof registerSchema>;

const benefits = [
  { icon: '🎮', title: 'Epic Quests', desc: 'Learn through adventure' },
  { icon: '🏆', title: 'Earn Badges', desc: 'Show off achievements' },
  { icon: '📊', title: 'Track Progress', desc: 'Level up your skills' },
  { icon: '👥', title: 'Join Guild', desc: 'Connect with heroes' },
];

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const { register: registerUser, isLoading, error, clearError } = useAuthStore();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      agreeToTerms: false,
    },
  });

  const password = watch('password', '');

  const passwordRequirements = [
    { label: '8+ characters', met: password.length >= 8, icon: '📏' },
    { label: 'Uppercase letter', met: /[A-Z]/.test(password), icon: '🔠' },
    { label: 'Lowercase letter', met: /[a-z]/.test(password), icon: '🔡' },
    { label: 'Number', met: /[0-9]/.test(password), icon: '🔢' },
  ];

  const strengthScore = passwordRequirements.filter(r => r.met).length;
  const strengthColors = ['bg-gray-200', 'bg-red-400', 'bg-orange-400', 'bg-yellow-400', 'bg-green-500'];
  const strengthLabels = ['', 'Weak', 'Fair', 'Good', 'Strong! 💪'];

  const onSubmit = async (data: RegisterForm) => {
    try {
      clearError();
      await registerUser({
        email: data.email,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName,
      });
      toast.success('Welcome to the adventure! 🎉');
      router.push('/dashboard');
    } catch {
      toast.error(error || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] bg-[#FFF9E6] relative overflow-hidden">
      {/* Floating decorations */}
      <div className="absolute top-10 left-10 text-4xl animate-float opacity-20">⭐</div>
      <div className="absolute top-40 right-10 text-3xl animate-float opacity-20" style={{ animationDelay: '1s' }}>🎮</div>
      <div className="absolute bottom-20 left-1/4 text-3xl animate-float opacity-20" style={{ animationDelay: '0.5s' }}>🏆</div>
      <div className="absolute top-1/3 right-1/4 text-2xl animate-float opacity-20" style={{ animationDelay: '1.5s' }}>💎</div>

      {/* Left Side - Benefits (hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 items-center justify-center p-12 relative">
        <div className="max-w-lg">
          {/* Hero badge */}
          <div className="relative inline-block mb-8">
            <div className="w-24 h-24 bg-gradient-to-br from-[#A66CFF] to-[#FF6B6B] rounded-full flex items-center justify-center border-4 border-[#2D2D2D] shadow-[6px_6px_0_#2D2D2D] animate-float">
              <Rocket className="w-12 h-12 text-white" />
            </div>
            <div className="absolute -top-2 -right-2 text-2xl animate-sparkle">✨</div>
          </div>

          <h2 className="text-4xl font-bold text-[#2D2D2D] mb-4" style={{ fontFamily: "'Fredoka', sans-serif" }}>
            Begin Your
            <br />
            <span className="bg-gradient-to-r from-[#4ECDC4] to-[#6BCB77] bg-clip-text text-transparent">
              Epic Journey!
            </span>
            <span className="inline-block ml-2 animate-wiggle">🚀</span>
          </h2>

          <p className="text-gray-600 text-lg mb-8">
            Join thousands of heroes mastering digital skills through gamified learning adventures.
          </p>

          {/* Benefits grid */}
          <div className="grid grid-cols-2 gap-4">
            {benefits.map((benefit, index) => (
              <div
                key={benefit.title}
                className="bg-white rounded-2xl border-3 border-[#2D2D2D] p-4 shadow-[4px_4px_0_#2D2D2D] hover:-translate-y-1 hover:shadow-[6px_6px_0_#2D2D2D] transition-all group"
              >
                <span className="text-3xl block animate-float" style={{ animationDelay: `${index * 0.15}s` }}>{benefit.icon}</span>
                <h3 className="font-bold text-[#2D2D2D] mt-2" style={{ fontFamily: "'Fredoka', sans-serif" }}>{benefit.title}</h3>
                <p className="text-xs text-gray-500">{benefit.desc}</p>
              </div>
            ))}
          </div>

          {/* Stats bar */}
          <div className="mt-8 bg-white rounded-2xl border-3 border-[#2D2D2D] p-4 shadow-[4px_4px_0_#2D2D2D]">
            <div className="flex items-center justify-between">
              <div className="text-center">
                <p className="text-2xl font-bold text-[#FF6B6B]" style={{ fontFamily: "'Fredoka', sans-serif" }}>10K+</p>
                <p className="text-xs text-gray-500">Heroes</p>
              </div>
              <div className="h-8 w-px bg-gray-200" />
              <div className="text-center">
                <p className="text-2xl font-bold text-[#FFD93D]" style={{ fontFamily: "'Fredoka', sans-serif" }}>50+</p>
                <p className="text-xs text-gray-500">Quests</p>
              </div>
              <div className="h-8 w-px bg-gray-200" />
              <div className="text-center">
                <p className="text-2xl font-bold text-[#6BCB77]" style={{ fontFamily: "'Fredoka', sans-serif" }}>100+</p>
                <p className="text-xs text-gray-500">Badges</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex w-full items-center justify-center px-4 py-8 lg:w-1/2">
        <div className="w-full max-w-md">
          {/* Card */}
          <div className="relative bg-white rounded-[30px] border-4 border-[#2D2D2D] p-6 sm:p-8 shadow-[8px_8px_0_#2D2D2D]">
            {/* Colored top bar */}
            <div className="absolute top-0 left-0 right-0 h-3 bg-gradient-to-r from-[#4ECDC4] via-[#6BCB77] to-[#FFD93D] rounded-t-[26px]" />

            {/* Header */}
            <div className="text-center mt-2">
              <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#A66CFF] to-[#FF6B6B] border-2 border-[#2D2D2D] px-4 py-2 text-sm font-bold text-white shadow-[3px_3px_0_#2D2D2D] mb-4">
                <Sparkles className="h-4 w-4" />
                <span>Create Character</span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-bold text-[#2D2D2D]" style={{ fontFamily: "'Fredoka', sans-serif" }}>
                Join the Adventure
                <span className="inline-block ml-2 animate-bounce">🎮</span>
              </h1>
              <p className="mt-1 text-sm text-gray-600">
                Create your hero profile and start your quest!
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
              {/* Name fields */}
              <div className="grid grid-cols-2 gap-3">
                <div className="relative group">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-gradient-to-br from-[#FFD93D] to-[#FFC107] rounded-lg border-2 border-[#2D2D2D] flex items-center justify-center group-focus-within:scale-105 transition-transform">
                    <User className="h-4 w-4 text-[#2D2D2D]" />
                  </div>
                  <Input
                    placeholder="First name"
                    className="pl-14 h-12 rounded-xl border-3 border-[#2D2D2D] shadow-[2px_2px_0_#2D2D2D] text-sm"
                    {...register('firstName')}
                    error={errors.firstName?.message}
                  />
                </div>
                <Input
                  placeholder="Last name"
                  className="h-12 rounded-xl border-3 border-[#2D2D2D] shadow-[2px_2px_0_#2D2D2D] text-sm"
                  {...register('lastName')}
                  error={errors.lastName?.message}
                />
              </div>

              {/* Email */}
              <div className="relative group">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-gradient-to-br from-[#4ECDC4] to-[#6BCB77] rounded-lg border-2 border-[#2D2D2D] flex items-center justify-center group-focus-within:scale-105 transition-transform">
                  <Mail className="h-4 w-4 text-white" />
                </div>
                <Input
                  type="email"
                  placeholder="Email address"
                  className="pl-14 h-12 rounded-xl border-3 border-[#2D2D2D] shadow-[2px_2px_0_#2D2D2D] text-sm"
                  {...register('email')}
                  error={errors.email?.message}
                />
              </div>

              {/* Password */}
              <div>
                <div className="relative group">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-gradient-to-br from-[#A66CFF] to-[#FF6B6B] rounded-lg border-2 border-[#2D2D2D] flex items-center justify-center group-focus-within:scale-105 transition-transform">
                    <Shield className="h-4 w-4 text-white" />
                  </div>
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Create password"
                    className="pl-14 pr-12 h-12 rounded-xl border-3 border-[#2D2D2D] shadow-[2px_2px_0_#2D2D2D] text-sm"
                    {...register('password')}
                    error={errors.password?.message}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-gray-200 transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-600" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-600" />
                    )}
                  </button>
                </div>

                {/* Password Strength Bar */}
                {password && (
                  <div className="mt-3">
                    <div className="flex gap-1 mb-2">
                      {[1, 2, 3, 4].map((level) => (
                        <div
                          key={level}
                          className={`h-2 flex-1 rounded-full transition-colors ${
                            level <= strengthScore ? strengthColors[strengthScore] : 'bg-gray-200'
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-xs text-gray-500 flex items-center justify-between">
                      <span>Password strength:</span>
                      <span className={`font-semibold ${strengthScore >= 4 ? 'text-green-600' : strengthScore >= 3 ? 'text-yellow-600' : 'text-red-500'}`}>
                        {strengthLabels[strengthScore]}
                      </span>
                    </p>

                    {/* Requirements */}
                    <div className="mt-2 grid grid-cols-2 gap-1">
                      {passwordRequirements.map((req) => (
                        <div
                          key={req.label}
                          className={`flex items-center gap-1 text-xs ${
                            req.met ? 'text-green-600' : 'text-gray-400'
                          }`}
                        >
                          <span>{req.met ? '✅' : '⬜'}</span>
                          <span>{req.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Terms checkbox */}
              <label className="flex items-start gap-3 cursor-pointer group p-3 rounded-xl bg-gray-50 border-2 border-gray-200 hover:border-[#4ECDC4] transition-colors">
                <div className="relative mt-0.5">
                  <input
                    type="checkbox"
                    className="peer sr-only"
                    {...register('agreeToTerms')}
                  />
                  <div className="w-5 h-5 border-2 border-[#2D2D2D] rounded-md bg-white peer-checked:bg-[#6BCB77] peer-checked:border-[#6BCB77] transition-all" />
                  <Star className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity" />
                </div>
                <span className="text-sm text-gray-600 leading-tight">
                  I agree to the{' '}
                  <Link href="#" className="text-[#A66CFF] font-semibold hover:underline">
                    Quest Rules
                  </Link>{' '}
                  and{' '}
                  <Link href="#" className="text-[#A66CFF] font-semibold hover:underline">
                    Privacy Shield
                  </Link>
                </span>
              </label>
              {errors.agreeToTerms && (
                <p className="text-sm text-red-600 flex items-center gap-1">
                  <span>⚠️</span> {errors.agreeToTerms.message}
                </p>
              )}

              {error && (
                <div className="rounded-xl bg-red-50 border-2 border-red-200 p-3 text-sm text-red-600 flex items-center gap-2">
                  <span className="text-lg">😢</span>
                  {error}
                </div>
              )}

              <Button
                type="submit"
                className="w-full h-12 text-base group"
                size="lg"
                isLoading={isLoading}
              >
                <Rocket className="mr-2 h-5 w-5 group-hover:animate-wiggle" />
                Start My Adventure
                <span className="ml-2">🎮</span>
              </Button>
            </form>

            {/* Divider */}
            <div className="relative mt-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t-2 border-dashed border-gray-300" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-white px-4 text-xs text-gray-500 font-semibold">or join with</span>
              </div>
            </div>

            {/* Social Login */}
            <div className="mt-5 grid grid-cols-2 gap-3">
              <button
                type="button"
                className="flex items-center justify-center gap-2 h-11 rounded-xl border-3 border-[#2D2D2D] bg-white font-bold text-sm text-[#2D2D2D] shadow-[2px_2px_0_#2D2D2D] hover:-translate-y-0.5 hover:shadow-[3px_3px_0_#2D2D2D] transition-all"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Google
              </button>
              <button
                type="button"
                className="flex items-center justify-center gap-2 h-11 rounded-xl border-3 border-[#2D2D2D] bg-[#2D2D2D] font-bold text-sm text-white shadow-[2px_2px_0_#FFD93D] hover:-translate-y-0.5 hover:shadow-[3px_3px_0_#FFD93D] transition-all"
              >
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
                GitHub
              </button>
            </div>

            {/* Login Link */}
            <p className="mt-6 text-center text-sm text-gray-600">
              Already a hero?{' '}
              <Link
                href="/login"
                className="font-bold text-[#FF6B6B] hover:text-[#A66CFF] transition-colors"
              >
                Enter the arena →
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
