'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { Search, Filter, X, BookOpen, Loader2, Sparkles, Trophy, Zap, Target, Flame, Star } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { CourseCard } from '@/components/course/CourseCard';
import { coursesApi } from '@/lib/api/courses';
import type { Course } from '@/types';

const levels = [
  { value: '', label: 'All Levels', emoji: '🎯' },
  { value: 'beginner', label: 'Beginner', emoji: '🌱' },
  { value: 'intermediate', label: 'Intermediate', emoji: '🚀' },
  { value: 'advanced', label: 'Advanced', emoji: '⚡' },
];

const sortOptions = [
  { value: 'newest', label: '✨ Newest', emoji: '✨' },
  { value: 'popular', label: '🔥 Most Popular', emoji: '🔥' },
  { value: 'rating', label: '⭐ Highest Rated', emoji: '⭐' },
  { value: 'price-low', label: '💰 Price: Low to High', emoji: '💰' },
  { value: 'price-high', label: '💎 Price: High to Low', emoji: '💎' },
];

export default function CoursesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [showFilters, setShowFilters] = useState(false);

  // Get filter values from URL
  const category = searchParams.get('category') || '';
  const level = searchParams.get('level') || '';
  const pricing = searchParams.get('pricing') || '';
  const sort = searchParams.get('sort') || 'newest';
  const page = parseInt(searchParams.get('page') || '1');

  // Fetch courses
  const { data, isLoading, error } = useQuery({
    queryKey: ['courses', { category, level, pricing, sort, page, search: searchQuery }],
    queryFn: () =>
      coursesApi.getCourses({
        category: category || undefined,
        level: level as 'beginner' | 'intermediate' | 'advanced' | undefined,
        pricing: pricing as 'free' | 'paid' | undefined,
        sort: sort as 'newest' | 'popular' | 'rating' | 'price-low' | 'price-high',
        page,
        limit: 12,
        search: searchQuery || undefined,
      }),
  });

  const courses = data?.data?.courses || [];
  const pagination = data?.data?.pagination;

  // Update URL with filters
  const updateFilters = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.delete('page'); // Reset page when filters change
    router.push(`/courses?${params.toString()}`);
  };

  const clearFilters = () => {
    router.push('/courses');
    setSearchQuery('');
  };

  const hasActiveFilters = category || level || pricing || searchQuery;

  // Handle search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery !== searchParams.get('search')) {
        updateFilters('search', searchQuery);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery]);

  return (
    <div className="min-h-screen bg-[#FFF9E6]">
      {/* Floating decorations */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-10 text-4xl animate-float opacity-20">📚</div>
        <div className="absolute top-40 right-20 text-3xl animate-float opacity-20" style={{ animationDelay: '1s' }}>🎮</div>
        <div className="absolute bottom-40 left-20 text-3xl animate-float opacity-20" style={{ animationDelay: '2s' }}>🏆</div>
      </div>

      {/* Header */}
      <div className="relative border-b-4 border-[#2D2D2D] bg-gradient-to-r from-[#FFD93D]/20 via-[#FF6B6B]/10 to-[#A66CFF]/20">
        <div className="container mx-auto px-4 py-10">
          {/* Title Section */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#4ECDC4] to-[#6BCB77] border-2 border-[#2D2D2D] px-5 py-2 text-sm font-bold text-white shadow-[3px_3px_0_#2D2D2D] mb-6">
              <Target className="h-4 w-4" />
              <span>Quest Board</span>
            </div>

            <h1 className="text-4xl font-bold text-[#2D2D2D] sm:text-5xl" style={{ fontFamily: "'Fredoka', sans-serif" }}>
              Explore{' '}
              <span className="bg-gradient-to-r from-[#FF6B6B] to-[#A66CFF] bg-clip-text text-transparent">
                Epic Quests
              </span>
              <span className="inline-block ml-2 animate-wiggle">🗡️</span>
            </h1>
            <p className="mt-4 text-gray-600 max-w-xl mx-auto">
              Choose your adventure and start leveling up your digital skills!
            </p>
          </div>

          {/* Search and Filter Bar */}
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              {/* Search Input */}
              <div className="relative flex-1 group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-gradient-to-br from-[#FFD93D] to-[#FFC107] rounded-xl border-2 border-[#2D2D2D] flex items-center justify-center group-focus-within:scale-105 transition-transform">
                  <Search className="h-5 w-5 text-[#2D2D2D]" />
                </div>
                <Input
                  placeholder="Search for quests..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-16 h-14 rounded-2xl border-3 border-[#2D2D2D] bg-white shadow-[4px_4px_0_#2D2D2D] focus:shadow-[6px_6px_0_#2D2D2D] transition-all text-base"
                />
              </div>

              {/* Filter & Sort */}
              <div className="flex gap-3">
                <Button
                  variant="secondary"
                  onClick={() => setShowFilters(!showFilters)}
                  className="sm:hidden h-14 rounded-2xl border-3 border-[#2D2D2D] shadow-[3px_3px_0_#2D2D2D]"
                >
                  <Filter className="mr-2 h-4 w-4" />
                  Filters
                </Button>

                <div className="relative">
                  <select
                    value={sort}
                    onChange={(e) => updateFilters('sort', e.target.value)}
                    className="h-14 rounded-2xl border-3 border-[#2D2D2D] bg-white px-4 pr-10 text-sm font-semibold shadow-[3px_3px_0_#2D2D2D] focus:shadow-[4px_4px_0_#2D2D2D] focus:outline-none transition-all cursor-pointer appearance-none"
                  >
                    {sortOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                    ▼
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="mt-6 flex items-center justify-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <Flame className="h-5 w-5 text-orange-500 animate-pulse" />
                <span className="font-bold">{pagination?.total || 0}</span>
                <span className="text-gray-500">quests available</span>
              </div>
              <div className="h-4 w-px bg-gray-300" />
              <div className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-yellow-500" />
                <span className="text-gray-500">Earn XP & badges</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Sidebar Filters - Desktop */}
          <aside className="hidden w-72 shrink-0 lg:block">
            <div className="sticky top-24 bg-white rounded-[25px] border-4 border-[#2D2D2D] p-6 shadow-[6px_6px_0_#2D2D2D]">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-[#A66CFF] to-[#FF6B6B] rounded-lg border-2 border-[#2D2D2D] flex items-center justify-center">
                    <Filter className="h-4 w-4 text-white" />
                  </div>
                  <h3 className="font-bold text-[#2D2D2D]" style={{ fontFamily: "'Fredoka', sans-serif" }}>Filters</h3>
                </div>
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="text-sm font-semibold text-[#FF6B6B] hover:underline flex items-center gap-1"
                  >
                    <X className="h-3 w-3" />
                    Clear
                  </button>
                )}
              </div>

              {/* Pricing Filter */}
              <div className="mb-6">
                <h4 className="text-sm font-bold text-[#2D2D2D] mb-3 flex items-center gap-2">
                  <span>💰</span> Pricing
                </h4>
                <div className="space-y-2">
                  {[
                    { value: '', label: 'All Quests', emoji: '🎯' },
                    { value: 'free', label: 'Free Quests', emoji: '🆓' },
                    { value: 'paid', label: 'Premium Quests', emoji: '💎' },
                  ].map((option) => (
                    <label
                      key={option.value}
                      className={`flex cursor-pointer items-center gap-3 p-3 rounded-xl border-2 transition-all ${
                        pricing === option.value
                          ? 'border-[#6BCB77] bg-[#6BCB77]/10'
                          : 'border-gray-200 hover:border-[#FFD93D]'
                      }`}
                    >
                      <input
                        type="radio"
                        name="pricing"
                        value={option.value}
                        checked={pricing === option.value}
                        onChange={() => updateFilters('pricing', option.value)}
                        className="sr-only"
                      />
                      <span className="text-lg">{option.emoji}</span>
                      <span className={`text-sm font-semibold ${pricing === option.value ? 'text-[#6BCB77]' : 'text-gray-600'}`}>
                        {option.label}
                      </span>
                      {pricing === option.value && (
                        <Star className="h-4 w-4 text-[#6BCB77] ml-auto" />
                      )}
                    </label>
                  ))}
                </div>
              </div>

              {/* Level Filter */}
              <div>
                <h4 className="text-sm font-bold text-[#2D2D2D] mb-3 flex items-center gap-2">
                  <span>📊</span> Difficulty
                </h4>
                <div className="space-y-2">
                  {levels.map((option) => (
                    <label
                      key={option.value}
                      className={`flex cursor-pointer items-center gap-3 p-3 rounded-xl border-2 transition-all ${
                        level === option.value
                          ? 'border-[#A66CFF] bg-[#A66CFF]/10'
                          : 'border-gray-200 hover:border-[#FFD93D]'
                      }`}
                    >
                      <input
                        type="radio"
                        name="level"
                        value={option.value}
                        checked={level === option.value}
                        onChange={() => updateFilters('level', option.value)}
                        className="sr-only"
                      />
                      <span className="text-lg">{option.emoji}</span>
                      <span className={`text-sm font-semibold ${level === option.value ? 'text-[#A66CFF]' : 'text-gray-600'}`}>
                        {option.label}
                      </span>
                      {level === option.value && (
                        <Star className="h-4 w-4 text-[#A66CFF] ml-auto" />
                      )}
                    </label>
                  ))}
                </div>
              </div>

              {/* Pro tip */}
              <div className="mt-6 p-4 bg-gradient-to-r from-[#FFD93D]/20 to-[#FF6B6B]/20 rounded-xl border-2 border-dashed border-[#FFD93D]">
                <p className="text-xs text-gray-600">
                  <span className="font-bold">💡 Pro tip:</span> Start with beginner quests to earn your first badges!
                </p>
              </div>
            </div>
          </aside>

          {/* Mobile Filters */}
          {showFilters && (
            <div className="fixed inset-0 z-50 bg-black/50 lg:hidden">
              <div className="absolute right-0 top-0 h-full w-80 bg-[#FFF9E6] p-6 overflow-y-auto">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold" style={{ fontFamily: "'Fredoka', sans-serif" }}>
                    🎮 Filters
                  </h3>
                  <button
                    onClick={() => setShowFilters(false)}
                    className="w-10 h-10 bg-white rounded-xl border-2 border-[#2D2D2D] flex items-center justify-center"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {/* Pricing Filter */}
                <div className="mb-6">
                  <h4 className="text-sm font-bold text-[#2D2D2D] mb-3">💰 Pricing</h4>
                  <div className="space-y-2">
                    {[
                      { value: '', label: 'All Quests', emoji: '🎯' },
                      { value: 'free', label: 'Free Quests', emoji: '🆓' },
                      { value: 'paid', label: 'Premium Quests', emoji: '💎' },
                    ].map((option) => (
                      <label
                        key={option.value}
                        className={`flex cursor-pointer items-center gap-3 p-3 rounded-xl border-2 transition-all ${
                          pricing === option.value
                            ? 'border-[#6BCB77] bg-[#6BCB77]/10'
                            : 'border-gray-200 bg-white'
                        }`}
                      >
                        <input
                          type="radio"
                          name="pricing-mobile"
                          value={option.value}
                          checked={pricing === option.value}
                          onChange={() => {
                            updateFilters('pricing', option.value);
                            setShowFilters(false);
                          }}
                          className="sr-only"
                        />
                        <span className="text-lg">{option.emoji}</span>
                        <span className="text-sm font-semibold">{option.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Level Filter */}
                <div className="mb-6">
                  <h4 className="text-sm font-bold text-[#2D2D2D] mb-3">📊 Difficulty</h4>
                  <div className="space-y-2">
                    {levels.map((option) => (
                      <label
                        key={option.value}
                        className={`flex cursor-pointer items-center gap-3 p-3 rounded-xl border-2 transition-all ${
                          level === option.value
                            ? 'border-[#A66CFF] bg-[#A66CFF]/10'
                            : 'border-gray-200 bg-white'
                        }`}
                      >
                        <input
                          type="radio"
                          name="level-mobile"
                          value={option.value}
                          checked={level === option.value}
                          onChange={() => {
                            updateFilters('level', option.value);
                            setShowFilters(false);
                          }}
                          className="sr-only"
                        />
                        <span className="text-lg">{option.emoji}</span>
                        <span className="text-sm font-semibold">{option.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <Button onClick={() => setShowFilters(false)} className="w-full">
                  Apply Filters
                </Button>
              </div>
            </div>
          )}

          {/* Course Grid */}
          <div className="flex-1">
            {/* Active Filters Tags */}
            {hasActiveFilters && (
              <div className="mb-6 flex flex-wrap gap-2">
                {searchQuery && (
                  <span className="inline-flex items-center gap-2 rounded-full bg-[#4ECDC4]/20 border-2 border-[#4ECDC4] px-4 py-2 text-sm font-semibold text-[#2D9A93]">
                    🔍 &quot;{searchQuery}&quot;
                    <button
                      onClick={() => setSearchQuery('')}
                      className="hover:text-[#FF6B6B] transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </span>
                )}
                {pricing && (
                  <span className="inline-flex items-center gap-2 rounded-full bg-[#6BCB77]/20 border-2 border-[#6BCB77] px-4 py-2 text-sm font-semibold text-[#4AA85A]">
                    {pricing === 'free' ? '🆓 Free' : '💎 Premium'}
                    <button
                      onClick={() => updateFilters('pricing', '')}
                      className="hover:text-[#FF6B6B] transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </span>
                )}
                {level && (
                  <span className="inline-flex items-center gap-2 rounded-full bg-[#A66CFF]/20 border-2 border-[#A66CFF] px-4 py-2 text-sm font-semibold text-[#8A4FD6]">
                    {levels.find((l) => l.value === level)?.emoji} {levels.find((l) => l.value === level)?.label}
                    <button
                      onClick={() => updateFilters('level', '')}
                      className="hover:text-[#FF6B6B] transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </span>
                )}
              </div>
            )}

            {/* Results Count */}
            {pagination && (
              <div className="mb-6 flex items-center justify-between">
                <p className="text-sm text-gray-600">
                  Showing <span className="font-bold text-[#2D2D2D]">{courses.length}</span> of{' '}
                  <span className="font-bold text-[#2D2D2D]">{pagination.total}</span> quests
                </p>
              </div>
            )}

            {/* Loading State */}
            {isLoading && (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="relative">
                  <div className="w-20 h-20 bg-gradient-to-br from-[#FFD93D] to-[#FF6B6B] rounded-full flex items-center justify-center border-4 border-[#2D2D2D] shadow-[4px_4px_0_#2D2D2D] animate-bounce">
                    <Loader2 className="h-10 w-10 text-[#2D2D2D] animate-spin" />
                  </div>
                </div>
                <p className="mt-6 text-lg font-semibold text-[#2D2D2D]" style={{ fontFamily: "'Fredoka', sans-serif" }}>
                  Loading quests...
                </p>
                <p className="text-sm text-gray-500">Preparing your adventure 🗡️</p>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="bg-white rounded-[25px] border-4 border-[#FF6B6B] p-8 text-center shadow-[6px_6px_0_#2D2D2D]">
                <span className="text-5xl block mb-4">😢</span>
                <h3 className="text-xl font-bold text-[#2D2D2D]" style={{ fontFamily: "'Fredoka', sans-serif" }}>
                  Quest Loading Failed
                </h3>
                <p className="mt-2 text-gray-600">Something went wrong. Please try again.</p>
                <Button onClick={() => window.location.reload()} className="mt-6">
                  Try Again
                </Button>
              </div>
            )}

            {/* Empty State */}
            {!isLoading && !error && courses.length === 0 && (
              <div className="bg-white rounded-[25px] border-4 border-[#2D2D2D] p-12 text-center shadow-[6px_6px_0_#2D2D2D]">
                <div className="w-24 h-24 bg-gradient-to-br from-[#FFD93D]/30 to-[#FF6B6B]/30 rounded-full flex items-center justify-center mx-auto border-4 border-dashed border-[#2D2D2D]/30">
                  <BookOpen className="h-12 w-12 text-[#2D2D2D]/50" />
                </div>
                <h3 className="mt-6 text-2xl font-bold text-[#2D2D2D]" style={{ fontFamily: "'Fredoka', sans-serif" }}>
                  No Quests Found
                </h3>
                <p className="mt-2 text-gray-600">
                  Try adjusting your filters or search for different adventures
                </p>
                <Button onClick={clearFilters} className="mt-6">
                  <Sparkles className="mr-2 h-4 w-4" />
                  Clear All Filters
                </Button>
              </div>
            )}

            {/* Course Grid */}
            {!isLoading && !error && courses.length > 0 && (
              <>
                <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                  {courses.map((course: Course) => (
                    <CourseCard key={course._id} course={course} />
                  ))}
                </div>

                {/* Pagination */}
                {pagination && pagination.pages > 1 && (
                  <div className="mt-12 flex items-center justify-center gap-4">
                    <Button
                      variant="secondary"
                      disabled={page <= 1}
                      onClick={() => updateFilters('page', String(page - 1))}
                      className="rounded-xl border-3 border-[#2D2D2D] shadow-[3px_3px_0_#2D2D2D] disabled:opacity-50"
                    >
                      ← Previous
                    </Button>

                    <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl border-3 border-[#2D2D2D] shadow-[3px_3px_0_#2D2D2D]">
                      <span className="text-sm font-bold text-[#2D2D2D]">
                        Page {page} of {pagination.pages}
                      </span>
                    </div>

                    <Button
                      variant="secondary"
                      disabled={!pagination.hasMore}
                      onClick={() => updateFilters('page', String(page + 1))}
                      className="rounded-xl border-3 border-[#2D2D2D] shadow-[3px_3px_0_#2D2D2D] disabled:opacity-50"
                    >
                      Next →
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
