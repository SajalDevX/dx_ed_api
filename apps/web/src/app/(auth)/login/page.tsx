'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, Mail, Lock, Gamepad2, Sparkles, Zap, Trophy, Star } from 'lucide-react';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAuthStore } from '@/stores/authStore';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const { login, isLoading, error, clearError } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    try {
      clearError();
      await login(data.email, data.password);
      toast.success('Welcome back, Hero! 🎮');
      router.push('/dashboard');
    } catch {
      toast.error(error || 'Login failed. Please try again.');
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] bg-[#FFF9E6] relative overflow-hidden">
      {/* Floating decorations */}
      <div className="absolute top-10 left-10 text-4xl animate-float opacity-30">⭐</div>
      <div className="absolute top-20 right-20 text-3xl animate-float opacity-30" style={{ animationDelay: '1s' }}>🎮</div>
      <div className="absolute bottom-20 left-20 text-3xl animate-float opacity-30" style={{ animationDelay: '0.5s' }}>🏆</div>
      <div className="absolute bottom-40 right-40 text-2xl animate-float opacity-30" style={{ animationDelay: '1.5s' }}>💎</div>
      <div className="absolute top-1/2 left-10 text-2xl animate-float opacity-20" style={{ animationDelay: '2s' }}>🚀</div>

      {/* Left Side - Fun Graphics (hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 items-center justify-center p-12 relative">
        <div className="max-w-md text-center">
          {/* Game controller icon */}
          <div className="relative inline-block mb-8">
            <div className="w-32 h-32 bg-gradient-to-br from-[#FFD93D] to-[#FF6B6B] rounded-full flex items-center justify-center border-4 border-[#2D2D2D] shadow-[6px_6px_0_#2D2D2D] animate-float">
              <Gamepad2 className="w-16 h-16 text-[#2D2D2D]" />
            </div>
            <div className="absolute -top-2 -right-2 text-3xl animate-sparkle">✨</div>
            <div className="absolute -bottom-2 -left-2 text-2xl animate-bounce">🎯</div>
          </div>

          <h2 className="text-4xl font-bold text-[#2D2D2D] mb-4" style={{ fontFamily: "'Fredoka', sans-serif" }}>
            Welcome Back,
            <br />
            <span className="bg-gradient-to-r from-[#FF6B6B] to-[#A66CFF] bg-clip-text text-transparent">
              Hero!
            </span>
          </h2>

          <p className="text-gray-600 text-lg mb-8">
            Your quest awaits! Continue your journey and level up your skills.
          </p>

          {/* Fun stats */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { icon: '🎮', value: '50+', label: 'Quests' },
              { icon: '🏆', value: '100+', label: 'Badges' },
              { icon: '⚡', value: '∞', label: 'XP' },
            ].map((stat, index) => (
              <div
                key={stat.label}
                className="bg-white rounded-2xl border-3 border-[#2D2D2D] p-4 shadow-[4px_4px_0_#2D2D2D] hover:-translate-y-1 hover:shadow-[6px_6px_0_#2D2D2D] transition-all"
              >
                <span className="text-2xl block animate-float" style={{ animationDelay: `${index * 0.2}s` }}>{stat.icon}</span>
                <p className="text-xl font-bold text-[#2D2D2D] mt-1" style={{ fontFamily: "'Fredoka', sans-serif" }}>{stat.value}</p>
                <p className="text-xs text-gray-500">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex w-full items-center justify-center px-4 py-12 lg:w-1/2">
        <div className="w-full max-w-md">
          {/* Card */}
          <div className="relative bg-white rounded-[30px] border-4 border-[#2D2D2D] p-8 shadow-[8px_8px_0_#2D2D2D]">
            {/* Colored top bar */}
            <div className="absolute top-0 left-0 right-0 h-3 bg-gradient-to-r from-[#FFD93D] via-[#FF6B6B] to-[#A66CFF] rounded-t-[26px]" />

            {/* Header */}
            <div className="text-center mt-4">
              <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#4ECDC4] to-[#6BCB77] border-2 border-[#2D2D2D] px-4 py-2 text-sm font-bold text-white shadow-[3px_3px_0_#2D2D2D] mb-6">
                <Zap className="h-4 w-4" />
                <span>Player Login</span>
              </div>

              <h1 className="text-3xl font-bold text-[#2D2D2D]" style={{ fontFamily: "'Fredoka', sans-serif" }}>
                Enter the Arena
                <span className="inline-block ml-2 animate-wiggle">🎮</span>
              </h1>
              <p className="mt-2 text-gray-600">
                Sign in to continue your adventure
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
              <div className="space-y-4">
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-gradient-to-br from-[#FFD93D] to-[#FFC107] rounded-xl border-2 border-[#2D2D2D] flex items-center justify-center group-focus-within:scale-110 transition-transform">
                    <Mail className="h-5 w-5 text-[#2D2D2D]" />
                  </div>
                  <Input
                    type="email"
                    placeholder="Your email address"
                    className="pl-16 h-14 rounded-2xl border-3 border-[#2D2D2D] focus:border-[#4ECDC4] shadow-[3px_3px_0_#2D2D2D] focus:shadow-[4px_4px_0_#2D2D2D] transition-all text-base"
                    {...register('email')}
                    error={errors.email?.message}
                  />
                </div>

                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-gradient-to-br from-[#A66CFF] to-[#FF6B6B] rounded-xl border-2 border-[#2D2D2D] flex items-center justify-center group-focus-within:scale-110 transition-transform">
                    <Lock className="h-5 w-5 text-white" />
                  </div>
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Secret password"
                    className="pl-16 pr-14 h-14 rounded-2xl border-3 border-[#2D2D2D] focus:border-[#A66CFF] shadow-[3px_3px_0_#2D2D2D] focus:shadow-[4px_4px_0_#2D2D2D] transition-all text-base"
                    {...register('password')}
                    error={errors.password?.message}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center hover:bg-gray-200 transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-600" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-600" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <div className="relative">
                    <input
                      type="checkbox"
                      className="peer sr-only"
                    />
                    <div className="w-5 h-5 border-2 border-[#2D2D2D] rounded-md bg-white peer-checked:bg-[#6BCB77] peer-checked:border-[#6BCB77] transition-all" />
                    <Star className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity" />
                  </div>
                  <span className="text-sm text-gray-600 group-hover:text-[#2D2D2D]">Remember me</span>
                </label>
                <Link
                  href="/forgot-password"
                  className="text-sm font-semibold text-[#A66CFF] hover:text-[#FF6B6B] transition-colors"
                >
                  Forgot password?
                </Link>
              </div>

              {error && (
                <div className="rounded-2xl bg-red-50 border-2 border-red-200 p-4 text-sm text-red-600 flex items-center gap-2">
                  <span className="text-lg">😢</span>
                  {error}
                </div>
              )}

              <Button
                type="submit"
                className="w-full h-14 text-lg group"
                size="lg"
                isLoading={isLoading}
              >
                <Gamepad2 className="mr-2 h-5 w-5 group-hover:animate-wiggle" />
                Start Playing
                <span className="ml-2">→</span>
              </Button>
            </form>

            {/* Divider */}
            <div className="relative mt-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t-2 border-dashed border-gray-300" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-white px-4 text-sm text-gray-500 font-semibold">or continue with</span>
              </div>
            </div>

            {/* Social Login */}
            <div className="mt-6 grid grid-cols-2 gap-4">
              <button
                type="button"
                className="flex items-center justify-center gap-2 h-12 rounded-2xl border-3 border-[#2D2D2D] bg-white px-4 font-bold text-[#2D2D2D] shadow-[3px_3px_0_#2D2D2D] hover:-translate-y-1 hover:shadow-[5px_5px_0_#2D2D2D] transition-all"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Google
              </button>
              <button
                type="button"
                className="flex items-center justify-center gap-2 h-12 rounded-2xl border-3 border-[#2D2D2D] bg-[#2D2D2D] px-4 font-bold text-white shadow-[3px_3px_0_#FFD93D] hover:-translate-y-1 hover:shadow-[5px_5px_0_#FFD93D] transition-all"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
                GitHub
              </button>
            </div>

            {/* Register Link */}
            <p className="mt-8 text-center text-gray-600">
              New to the game?{' '}
              <Link
                href="/register"
                className="font-bold text-[#FF6B6B] hover:text-[#A66CFF] transition-colors"
              >
                Create your character →
              </Link>
            </p>
          </div>

          {/* Bottom decoration */}
          <div className="flex justify-center gap-2 mt-6">
            {['🎮', '⭐', '🏆', '💎', '🚀'].map((emoji, i) => (
              <span key={i} className="text-2xl opacity-50 animate-float" style={{ animationDelay: `${i * 0.2}s` }}>
                {emoji}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
