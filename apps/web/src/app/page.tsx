import Link from 'next/link';
import {
  Gamepad2,
  Users,
  Building2,
  Star,
  Sparkles,
  ArrowRight,
  Trophy,
  Target,
  Rocket,
  Zap,
  Crown,
  Flame,
  Gift,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';

const stats = [
  { value: '50+', label: 'Epic Quests', icon: '🎮', color: 'from-purple-400 to-pink-500' },
  { value: '10K+', label: 'Heroes Trained', icon: '🦸', color: 'from-blue-400 to-cyan-500' },
  { value: '200+', label: 'Guild Partners', icon: '🏰', color: 'from-amber-400 to-orange-500' },
];

const features = [
  {
    icon: Gamepad2,
    title: 'Quest-Based Learning',
    description:
      'Embark on learning adventures, complete missions, and level up your skills!',
    emoji: '🗡️',
    color: 'from-purple-500 to-pink-500',
  },
  {
    icon: Trophy,
    title: 'Collect Achievements',
    description:
      'Unlock rare badges and trophies that showcase your legendary abilities.',
    emoji: '🏆',
    color: 'from-yellow-500 to-orange-500',
  },
  {
    icon: Target,
    title: 'Boss Battles (Quizzes)',
    description:
      'Challenge yourself with epic quizzes and prove your mastery.',
    emoji: '🎯',
    color: 'from-red-500 to-rose-500',
  },
  {
    icon: Rocket,
    title: 'Join the Leaderboard',
    description:
      'Compete with fellow learners and climb to the top of the rankings!',
    emoji: '🚀',
    color: 'from-green-500 to-emerald-500',
  },
];

export default function HomePage() {
  return (
    <div className="bg-[#FFF9E6] overflow-hidden">
      {/* Floating Decorations */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-10 text-4xl animate-float opacity-20">⭐</div>
        <div className="absolute top-40 right-20 text-3xl animate-float opacity-20" style={{ animationDelay: '1s' }}>🎮</div>
        <div className="absolute bottom-40 left-20 text-3xl animate-float opacity-20" style={{ animationDelay: '2s' }}>🏆</div>
        <div className="absolute top-60 right-40 text-2xl animate-float opacity-20" style={{ animationDelay: '0.5s' }}>💎</div>
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-16 md:py-24">
        {/* Background Pattern */}
        <div className="absolute inset-0 dots-pattern opacity-30" />

        <div className="container mx-auto px-4 relative">
          <div className="mx-auto max-w-4xl text-center">
            {/* Animated Badge */}
            <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#FFD93D] to-[#FF6B6B] border-3 border-[#2D2D2D] px-6 py-3 text-sm font-bold text-[#2D2D2D] shadow-[4px_4px_0_#2D2D2D] animate-bounce-in">
              <Zap className="h-5 w-5 animate-pulse" />
              <span>🎮 Level Up Your DX Skills</span>
              <Crown className="h-5 w-5" />
            </div>

            {/* Main Heading */}
            <h1 className="mt-10 text-5xl font-bold tracking-tight text-[#2D2D2D] sm:text-6xl md:text-7xl animate-slide-up" style={{ fontFamily: "'Fredoka', sans-serif" }}>
              <span className="inline-block hover:animate-wiggle">Master</span>{' '}
              <span className="inline-block hover:animate-wiggle">Digital</span>{' '}
              <span className="inline-block hover:animate-wiggle">Skills</span>
              <span className="inline-block ml-2 animate-float">✨</span>
              <br />
              <span className="relative inline-block mt-2">
                <span className="relative z-10 bg-gradient-to-r from-[#FF6B6B] via-[#A66CFF] to-[#4ECDC4] bg-clip-text text-transparent">
                  Through Epic Quests!
                </span>
              </span>
            </h1>

            {/* Subtitle with game-like styling */}
            <div className="mt-8 mx-auto max-w-2xl">
              <p className="text-xl text-gray-700 leading-relaxed">
                🎯 Complete <span className="font-bold text-[#FF6B6B]">challenges</span>,
                earn <span className="font-bold text-[#FFD93D]">XP</span>,
                unlock <span className="font-bold text-[#A66CFF]">achievements</span>, and
                get discovered by <span className="font-bold text-[#4ECDC4]">top companies</span>!
              </p>
            </div>

            {/* XP Bar Demo */}
            <div className="mt-8 mx-auto max-w-md">
              <div className="flex items-center justify-between text-sm font-bold text-[#2D2D2D] mb-2">
                <span>🌟 Your Journey Begins</span>
                <span className="text-[#6BCB77]">Level 1</span>
              </div>
              <div className="xp-bar">
                <div className="xp-bar-fill" style={{ width: '15%' }} />
              </div>
              <p className="text-xs text-gray-500 mt-1">150 / 1000 XP to Level 2</p>
            </div>

            {/* CTA Buttons */}
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/courses">
                <Button size="xl" className="group">
                  <Gamepad2 className="mr-2 h-6 w-6 group-hover:animate-wiggle" />
                  Start Your Quest
                  <span className="ml-2">→</span>
                </Button>
              </Link>
              <Link href="/about">
                <Button size="xl" variant="secondary" className="group">
                  <Users className="mr-2 h-6 w-6" />
                  Join the Guild
                </Button>
              </Link>
            </div>

            {/* Quick Stats Below CTA */}
            <div className="mt-8 flex items-center justify-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <Flame className="h-5 w-5 text-orange-500 animate-pulse" />
                <span className="font-bold">1,234</span>
                <span className="text-gray-500">active today</span>
              </div>
              <div className="h-4 w-px bg-gray-300" />
              <div className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-yellow-500" />
                <span className="font-bold">50K+</span>
                <span className="text-gray-500">badges earned</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section - Game Achievement Style */}
      <section className="py-16 relative">
        <div className="container mx-auto px-4">
          {/* Section Title */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 rounded-full bg-[#A66CFF]/20 px-4 py-2 text-sm font-bold text-[#A66CFF] mb-4">
              <Trophy className="h-4 w-4" />
              <span>Our Achievements</span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {stats.map((stat, index) => (
              <div
                key={stat.label}
                className="group relative"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={`stat-card flex flex-col items-center py-8 hover:scale-105 transition-transform`}>
                  {/* Glow effect */}
                  <div className={`absolute inset-0 bg-gradient-to-r ${stat.color} opacity-0 group-hover:opacity-10 rounded-[20px] transition-opacity`} />

                  {/* Icon with bounce */}
                  <span className="text-5xl animate-float" style={{ animationDelay: `${index * 0.3}s` }}>{stat.icon}</span>

                  {/* Value with gradient */}
                  <p className={`mt-4 text-4xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`} style={{ fontFamily: "'Fredoka', sans-serif" }}>
                    {stat.value}
                  </p>

                  {/* Label */}
                  <p className="text-sm font-semibold text-gray-600 mt-1">{stat.label}</p>

                  {/* Decorative stars */}
                  <div className="absolute top-2 right-2 text-lg opacity-50">✨</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section - Power-Up Cards */}
      <section className="py-16 relative">
        {/* Background decoration */}
        <div className="absolute inset-0 dots-pattern opacity-20" />

        <div className="container mx-auto px-4 relative">
          <div className="text-center">
            {/* Section Badge */}
            <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#FF6B6B] to-[#FF9EAA] border-2 border-[#2D2D2D] px-5 py-2 text-sm font-bold text-white shadow-[3px_3px_0_#2D2D2D] mb-6">
              <Sparkles className="h-4 w-4 animate-sparkle" />
              <span>Power-Ups Unlocked!</span>
            </div>

            <h2 className="text-4xl font-bold text-[#2D2D2D] sm:text-5xl" style={{ fontFamily: "'Fredoka', sans-serif" }}>
              Why Choose{' '}
              <span className="relative inline-block">
                <span className="relative z-10 bg-gradient-to-r from-[#FFD93D] to-[#FF6B6B] bg-clip-text text-transparent">DXTalent</span>
                <span className="absolute bottom-1 left-0 right-0 h-4 bg-[#FFD93D]/40 -z-10 transform -rotate-1" />
              </span>
              ?
            </h2>
            <p className="mt-4 text-lg text-gray-600 max-w-xl mx-auto">
              Unlock special abilities and level up your career with our unique approach to learning 🎮
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="group relative"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="card-playful p-6 text-center h-full relative overflow-visible">
                  {/* Colored top bar */}
                  <div className={`absolute top-0 left-0 right-0 h-2 bg-gradient-to-r ${feature.color} rounded-t-[17px]`} />

                  {/* Floating emoji */}
                  <div className="relative -mt-2">
                    <span className="text-5xl block animate-float" style={{ animationDelay: `${index * 0.2}s` }}>
                      {feature.emoji}
                    </span>
                    {/* Sparkle effect on hover */}
                    <span className="absolute -top-1 -right-1 text-lg opacity-0 group-hover:opacity-100 transition-opacity">✨</span>
                  </div>

                  {/* Feature Icon Badge */}
                  <div className={`mx-auto mt-3 w-12 h-12 rounded-full bg-gradient-to-br ${feature.color} flex items-center justify-center border-2 border-[#2D2D2D] shadow-[2px_2px_0_#2D2D2D] group-hover:scale-110 transition-transform`}>
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>

                  <h3 className="mt-4 text-lg font-bold text-[#2D2D2D]" style={{ fontFamily: "'Fredoka', sans-serif" }}>
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-sm text-gray-600 leading-relaxed">{feature.description}</p>

                  {/* Bottom decoration */}
                  <div className="mt-4 flex justify-center gap-1">
                    {[...Array(3)].map((_, i) => (
                      <div
                        key={i}
                        className={`w-2 h-2 rounded-full bg-gradient-to-r ${feature.color} opacity-60`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section - Quest Map Style */}
      <section className="py-20 relative overflow-hidden">
        {/* Background with subtle pattern */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#4ECDC4]/5 to-transparent" />

        <div className="container mx-auto px-4 relative">
          <div className="text-center">
            {/* Section Badge */}
            <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#4ECDC4] to-[#6BCB77] border-2 border-[#2D2D2D] px-5 py-2 text-sm font-bold text-white shadow-[3px_3px_0_#2D2D2D] mb-6">
              <Target className="h-4 w-4" />
              <span>Quest Guide</span>
            </div>

            <h2 className="text-4xl font-bold text-[#2D2D2D] sm:text-5xl" style={{ fontFamily: "'Fredoka', sans-serif" }}>
              Your Adventure{' '}
              <span className="bg-gradient-to-r from-[#4ECDC4] to-[#6BCB77] bg-clip-text text-transparent">Map</span>
              <span className="inline-block ml-2 animate-float">🗺️</span>
            </h2>
            <p className="mt-4 text-lg text-gray-600 max-w-xl mx-auto">
              Follow these steps to become a legendary DX hero!
            </p>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-3 relative">
            {/* Connecting line (hidden on mobile) */}
            <div className="hidden md:block absolute top-20 left-1/4 right-1/4 h-1 bg-gradient-to-r from-[#FFD93D] via-[#FF6B6B] to-[#6BCB77] rounded-full" style={{ zIndex: 0 }} />

            {[
              {
                step: '1',
                emoji: '📚',
                title: 'Learn',
                description: 'Take interactive courses and master DX skills at your own pace.',
                color: 'from-[#FFD93D] to-[#FFC107]',
                bgColor: 'bg-[#FFD93D]',
              },
              {
                step: '2',
                emoji: '🎮',
                title: 'Challenge',
                description: 'Complete quizzes and challenges to test your knowledge.',
                color: 'from-[#FF6B6B] to-[#FF9EAA]',
                bgColor: 'bg-[#FF6B6B]',
              },
              {
                step: '3',
                emoji: '🏆',
                title: 'Get Recognized',
                description: 'Earn badges, climb leaderboards, and get noticed by recruiters.',
                color: 'from-[#6BCB77] to-[#4ECDC4]',
                bgColor: 'bg-[#6BCB77]',
              },
            ].map((item, index) => (
              <div key={item.step} className="relative z-10 group">
                <div className="text-center">
                  {/* Step number badge */}
                  <div className={`mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br ${item.color} border-4 border-[#2D2D2D] text-3xl font-bold text-white shadow-[4px_4px_0_#2D2D2D] group-hover:scale-110 group-hover:rotate-6 transition-all`} style={{ fontFamily: "'Fredoka', sans-serif" }}>
                    {item.step}
                  </div>

                  {/* Emoji with animation */}
                  <span className="mt-6 block text-5xl animate-float" style={{ animationDelay: `${index * 0.3}s` }}>
                    {item.emoji}
                  </span>

                  {/* Title */}
                  <h3 className="mt-4 text-2xl font-bold text-[#2D2D2D]" style={{ fontFamily: "'Fredoka', sans-serif" }}>
                    {item.title}
                  </h3>

                  {/* Description card */}
                  <div className="mt-4 mx-auto max-w-xs">
                    <div className={`p-4 rounded-2xl border-2 border-[#2D2D2D] bg-white shadow-[3px_3px_0_#2D2D2D] group-hover:shadow-[5px_5px_0_#2D2D2D] group-hover:-translate-y-1 transition-all`}>
                      <p className="text-gray-600 text-sm">{item.description}</p>
                    </div>
                  </div>

                  {/* Arrow indicator (except last) */}
                  {index < 2 && (
                    <div className="hidden md:block absolute -right-4 top-10 text-2xl animate-pulse">
                      ➡️
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section - Level Up Banner */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="relative overflow-hidden rounded-[30px] border-4 border-[#2D2D2D] bg-gradient-to-br from-[#A66CFF] via-[#FF6B6B] to-[#FFD93D] p-8 md:p-12 shadow-[8px_8px_0_#2D2D2D]">
            {/* Floating decorations */}
            <div className="absolute top-4 left-4 text-4xl animate-float opacity-30">⭐</div>
            <div className="absolute top-10 right-10 text-3xl animate-float opacity-30" style={{ animationDelay: '1s' }}>🎮</div>
            <div className="absolute bottom-4 left-1/4 text-3xl animate-float opacity-30" style={{ animationDelay: '0.5s' }}>💎</div>
            <div className="absolute bottom-10 right-1/4 text-2xl animate-float opacity-30" style={{ animationDelay: '1.5s' }}>🚀</div>

            <div className="grid items-center gap-8 md:grid-cols-2 relative z-10">
              <div>
                {/* Badge */}
                <div className="inline-flex items-center gap-2 rounded-full bg-white border-3 border-[#2D2D2D] px-5 py-2 text-sm font-bold shadow-[3px_3px_0_#2D2D2D] animate-bounce-in">
                  <Zap className="h-4 w-4 text-[#FFD93D]" />
                  <span>🎉 100% Free to Start</span>
                  <span className="text-lg">🆓</span>
                </div>

                {/* Heading */}
                <h2 className="mt-6 text-4xl font-bold text-white md:text-5xl drop-shadow-lg" style={{ fontFamily: "'Fredoka', sans-serif" }}>
                  Ready to{' '}
                  <span className="inline-block animate-wiggle">Level Up?</span>
                  <span className="inline-block ml-2 animate-float">🎯</span>
                </h2>

                {/* Description */}
                <p className="mt-4 text-white/90 text-lg max-w-md">
                  Join <span className="font-bold">thousands of heroes</span> who are already mastering digital
                  skills and getting noticed by top companies!
                </p>

                {/* CTA Button */}
                <Link href="/register">
                  <Button size="xl" className="mt-8 group bg-white text-[#2D2D2D] hover:bg-[#FFD93D]">
                    <Rocket className="mr-2 h-5 w-5 group-hover:animate-wiggle" />
                    Start Your Quest
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>

                {/* Trust indicators */}
                <div className="mt-6 flex items-center gap-4 text-white/80 text-sm">
                  <div className="flex items-center gap-1">
                    <span className="text-lg">✅</span> No credit card
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-lg">✅</span> Cancel anytime
                  </div>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="hidden md:flex justify-center">
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { emoji: '🎯', value: '50+', label: 'Courses', delay: '0s' },
                    { emoji: '🏅', value: '100+', label: 'Badges', delay: '0.1s' },
                    { emoji: '📊', value: '∞', label: 'Leaderboards', delay: '0.2s' },
                    { emoji: '💼', value: '200+', label: 'Job Matches', delay: '0.3s' },
                  ].map((item, index) => (
                    <div
                      key={item.label}
                      className="stat-card p-5 hover:scale-105 transition-transform animate-bounce-in"
                      style={{ animationDelay: item.delay }}
                    >
                      <span className="text-4xl block animate-float" style={{ animationDelay: `${index * 0.2}s` }}>{item.emoji}</span>
                      <p className="mt-2 text-2xl font-bold text-[#2D2D2D]" style={{ fontFamily: "'Fredoka', sans-serif" }}>{item.value}</p>
                      <p className="text-sm text-gray-600 font-semibold">{item.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* For Recruiters Section - Guild Hall */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <div className="relative bg-gradient-to-br from-[#2D2D2D] to-[#1a1a1a] rounded-[30px] border-4 border-[#FFD93D] p-8 md:p-12 overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-[#FFD93D]/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#A66CFF]/10 rounded-full blur-3xl" />

            <div className="text-center relative z-10">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#FFD93D] to-[#FFC107] border-2 border-white px-5 py-2 text-sm font-bold text-[#2D2D2D] shadow-[3px_3px_0_rgba(255,255,255,0.3)] mb-6">
                <Building2 className="h-4 w-4" />
                <span>For Guild Masters (Recruiters)</span>
              </div>

              {/* Heading */}
              <h2 className="text-4xl font-bold text-white md:text-5xl" style={{ fontFamily: "'Fredoka', sans-serif" }}>
                Are You a Recruiter?{' '}
                <span className="inline-block animate-wiggle">👀</span>
              </h2>

              {/* Description */}
              <p className="mt-6 text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed">
                Discover <span className="text-[#FFD93D] font-bold">pre-vetted heroes</span> with verified digital skills. Our
                platform helps you find candidates who have <span className="text-[#6BCB77] font-bold">proven their abilities</span> through real challenges and quests!
              </p>

              {/* Features */}
              <div className="mt-10 grid gap-4 sm:grid-cols-3 max-w-3xl mx-auto">
                {[
                  { emoji: '🎖️', text: 'Verified Skills', desc: 'Real achievements' },
                  { emoji: '📊', text: 'Talent Rankings', desc: 'Top performers' },
                  { emoji: '🎯', text: 'Smart Matching', desc: 'Perfect fit' },
                ].map((item, index) => (
                  <div key={item.text} className="bg-white/10 rounded-2xl p-4 border border-white/20 hover:bg-white/20 transition-colors group">
                    <span className="text-3xl block animate-float" style={{ animationDelay: `${index * 0.2}s` }}>{item.emoji}</span>
                    <p className="mt-2 font-bold text-white">{item.text}</p>
                    <p className="text-sm text-gray-400">{item.desc}</p>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Link href="/recruiters">
                  <Button size="xl" className="group">
                    <Building2 className="mr-2 h-5 w-5 group-hover:animate-wiggle" />
                    Join as Recruiter
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link href="/about">
                  <Button size="xl" variant="secondary" className="group border-white/30 text-white hover:bg-white/10">
                    <Star className="mr-2 h-5 w-5" />
                    Learn More
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
